const { json } = require("express");
const {
  validateEmailCredentials,
  generateEventCertificates,
  sendEmailWithAttachment,
  sendEmailUtil,
} = require("../setup/utils");
const xlsx = require("xlsx");

exports.AuthenticateEmailIdAppPassword = async (req, res) => {
  try {
    const { email, appPassword } = req.body;
    if (appPassword.replace(/\s/g, "").length !== 16) {
      return res.status(401).send({ message: "Invalid App Password" });
    }
    const result = await validateEmailCredentials(email, appPassword);
    if (result.success) {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in Authentication" });
  }
};
exports.SendMailWithCertificate = async (req, res) => {
  try {
    // 1. Extract uploaded files
    const excelFile = req.files["excelFile"][0].buffer;
    const templateFile = req.files["templateFile"][0].buffer;
    const fontFile = req.files["fontFile"]
      ? req.files["fontFile"][0].buffer
      : null;

    // 2. Parse request body data
    // baseTextElementsConfig holds the blueprint for dynamic text fields
    const { textElements, subject, body, userEmail, appPassword } = req.body;
    const baseTextElementsConfig = JSON.parse(textElements);

    // 3. Read and parse Excel data
    const workbook = xlsx.read(excelFile, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(sheet); // Renamed for clarity

    // Prepare to collect detailed results for each row
    const processingResults = [];

    // 4. Process each row from the Excel sheet
    for (const row of excelData) {
      const rowResult = { ...row, certificateStatus: "Pending", emailStatus: "Pending", error: null };
      const emailRecipient = row["Email"]; // Assuming 'Email' column exists

      try {
        if (!emailRecipient) {
          throw new Error("Missing 'Email' in Excel row.");
        }

        // Create a deep copy of the base text elements for the current certificate
        const currentCertificateTextElements = JSON.parse(JSON.stringify(baseTextElementsConfig));

        // Fill dynamic text elements with data from the current Excel row
        for (const textElementConfig of currentCertificateTextElements) {
          if (textElementConfig.col) { // If 'col' property exists, this is a dynamic field
            const columnName = textElementConfig.col;
            const valueFromExcel = row[columnName];

            if (valueFromExcel === undefined || valueFromExcel === null) {
              throw new Error(`Missing data in Excel column '${columnName}' for this row.`);
            }
            textElementConfig.name = String(valueFromExcel); // Assign dynamic value
          }
        }

        // Generate the personalized certificate
        const pdfBuffer = await generateEventCertificates(
          currentCertificateTextElements,
          templateFile,
          fontFile
        );

        if (!pdfBuffer) {
          throw new Error("Failed to generate PDF buffer.");
        }
        rowResult.certificateStatus = "Generated";

        // Attempt to send email with the generated certificate
        const emailSendResponse = await sendEmailWithAttachment(
          emailRecipient,
          pdfBuffer,
          subject,
          body,
          userEmail,
          appPassword
        );

        if (emailSendResponse && emailSendResponse.rejected && emailSendResponse.rejected.includes(emailRecipient)) {
          rowResult.emailStatus = "Failed";
        } else {
          rowResult.emailStatus = "Success";
        }

      } catch (rowError) {
        // Capture any error specific to processing this row
        rowResult.certificateStatus = rowResult.certificateStatus === "Pending" ? "Failed (Pre-Gen Error)" : rowResult.certificateStatus;
        rowResult.emailStatus = rowResult.emailStatus === "Pending" ? "Failed (Pre-Send Error)" : rowResult.emailStatus;
        rowResult.error = rowError.message;
      } finally {
        processingResults.push(rowResult); // Always push result for the row, whether success or failure
      }
    }

    // 5. Send a comprehensive response back to the client
    const successfulEmails = processingResults.filter(r => r.emailStatus === "Success").length;
    const failedEmails = processingResults.filter(r => r.error || r.emailStatus.includes("Failed")).length;

    res.status(200).json({
      message: "Certificate generation and email sending process completed.",
      summary: {
        totalRowsProcessed: excelData.length,
        successfulEmailsSent: successfulEmails,
        failedAttempts: failedEmails,
      },
      detailedResults: processingResults, // Provides granular status for each row
    });

  } catch (error) {
    // Catch any top-level errors (e.g., file upload issues, initial JSON parsing failures)
    console.error("Fatal error during certificate and email processing:", error);
    res.status(500).json({
      message: "A critical error occurred during processing. Please check inputs.",
      error: error.message,
    });
  }
};
exports.SendMails = async (req, res) => {
  try {
    // Access files from req.files
    const excelFile = req.files["excelFile"][0].buffer;

    const workbook = xlsx.read(excelFile, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    let { subject, body, userEmail, appPassword } = req.body;

    for (const row of data) {
      const name = row["Name"];
      const email = row["Email"];

      const response = await sendEmailUtil(
        email,
        subject,
        body,
        userEmail,
        appPassword
      );
      if (response.rejected.includes(email)) {
        row["Response"] = "Failed";
      } else {
        row["Response"] = "Success";
      }
    }
    res.status(200).json({
      message: "Files processed and certificate generated",
      generatedData: data,
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ message: "Error processing files" });
  }
};
