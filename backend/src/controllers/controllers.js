const { json } = require("express");
const {
  validateEmailCredentials,
  generateEventCertificates,
  sendEmailWithAttachment,
  sendEmailUtil,
  sendEmailWithGenericAttachment,
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
    // When using upload.any(), req.files is an array
    // Find excelFile and attachments by their fieldname
    let excelFile = null;
    const attachmentFiles = [];

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.fieldname === "excelFile") {
          excelFile = file.buffer;
        } else if (file.fieldname === "attachments") {
          attachmentFiles.push(file);
        }
      });
    } else if (req.files && req.files["excelFile"]) {
      // Fallback for if it's still an object (shouldn't happen with upload.any(), but just in case)
      excelFile = req.files["excelFile"][0].buffer;
      if (req.files["attachments"]) {
        attachmentFiles.push(...req.files["attachments"]);
      }
    }

    if (!excelFile) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const workbook = xlsx.read(excelFile, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    let { subject, body, userEmail, appPassword } = req.body;

    // Prepare attachments array if files are provided
    const attachments = attachmentFiles.map((file) => ({
      filename: file.originalname || `attachment_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      content: file.buffer,
      contentType: file.mimetype || "application/octet-stream",
    }));

    for (const row of data) {
      const name = row["Name"];
      const email = row["Email"];

      let response;
      // Use sendEmailWithGenericAttachment if attachments exist, otherwise use sendEmailUtil
      if (attachments.length > 0) {
        response = await sendEmailWithGenericAttachment(
          email,
          subject,
          body,
          attachments,
          userEmail,
          appPassword
        );
      } else {
        response = await sendEmailUtil(
          email,
          subject,
          body,
          userEmail,
          appPassword
        );
      }

      if (response && response.rejected && response.rejected.includes(email)) {
        row["Response"] = "Failed";
      } else {
        row["Response"] = "Success";
      }
    }
    res.status(200).json({
      message: "Files processed and emails sent",
      generatedData: data,
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ message: "Error processing files" });
  }
};

exports.SendEmailWithAttachment = async (req, res) => {
  try {
    const { recipientEmail, subject, body, userEmail, appPassword, attachmentNames } = req.body;
    
    if (!recipientEmail || !subject || !body) {
      return res.status(400).json({ 
        message: "Missing required fields: recipientEmail, subject, and body are required" 
      });
    }

    // Build attachments array from uploaded files
    const attachments = [];
    
    if (req.files && Object.keys(req.files).length > 0) {
      // If attachmentNames is provided as JSON string, parse it
      let attachmentNamesArray = [];
      if (attachmentNames) {
        try {
          attachmentNamesArray = typeof attachmentNames === 'string' 
            ? JSON.parse(attachmentNames) 
            : attachmentNames;
        } catch (parseError) {
          return res.status(400).json({ 
            message: "Invalid attachmentNames format. Expected JSON array." 
          });
        }
      }

      // Process each uploaded file
      let fileIndex = 0;
      for (const fieldName in req.files) {
        const file = req.files[fieldName][0];
        const filename = attachmentNamesArray[fileIndex] || file.originalname || `attachment_${fileIndex + 1}`;
        
        attachments.push({
          filename: filename,
          content: file.buffer,
          contentType: file.mimetype || "application/octet-stream",
        });
        fileIndex++;
      }
    }

    if (attachments.length === 0) {
      return res.status(400).json({ 
        message: "No attachments provided. Please upload at least one file." 
      });
    }

    // Send email with attachments
    const emailResponse = await sendEmailWithGenericAttachment(
      recipientEmail,
      subject,
      body,
      attachments,
      userEmail,
      appPassword
    );

    if (emailResponse && emailResponse.rejected && emailResponse.rejected.length > 0) {
      return res.status(400).json({
        message: "Email sending failed",
        rejected: emailResponse.rejected,
        accepted: emailResponse.accepted,
      });
    }

    res.status(200).json({
      message: "Email sent successfully with attachments",
      messageId: emailResponse.messageId,
      accepted: emailResponse.accepted,
      attachmentsCount: attachments.length,
    });

  } catch (error) {
    console.error("Error sending email with attachment:", error);
    res.status(500).json({ 
      message: "Error sending email with attachment",
      error: error.message 
    });
  }
};
