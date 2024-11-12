const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit"); // Import fontkit

const sendEmailWithAttachment = async (
  recipientEmail,
  pdfBuffer,
  subject,
  body,

) => {
  try {
    // Configure your SMTP server details
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use 'Gmail', 'Yahoo', 'Outlook', or your SMTP server
      auth: {
        user: process.env.SMPT_MAIL, // Replace with your email
        pass:process.env.SMPT_PASSWORD, // Replace with your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL, // Sender address
      to: recipientEmail, // Recipient address
      subject: subject,
      html: body,
      attachments: [
        {
          filename: "certificate.pdf", // Attachment name
          content: pdfBuffer, // PDF file buffer
          contentType: "application/pdf",
        },
      ],
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
async function generateEventCertificates(name, templateFile, xCoord, yCoord, fontSize, color, fontFile) {
  try {
    if (!templateFile) return;

    // No need for arrayBuffer, directly use the buffer received from frontend
    const fontBytes = fontFile ? fontFile : null;
    const pdfBytes = templateFile; // Already a Buffer

    const pdfDoc = await PDFDocument.load(pdfBytes);

    pdfDoc.registerFontkit(fontkit);

    // Use the provided font file if available, otherwise fall back to Helvetica
    const customFont = fontBytes
      ? await pdfDoc.embedFont(fontBytes)
      : pdfDoc.embedStandardFont("Helvetica");

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    console.log(name)
    // Draw the name on the PDF at the specified coordinates
    firstPage.drawText(name, {
      x: xCoord,
      y: yCoord,
      size: fontSize,
      font: customFont,
      color: rgb(color.r, color.g, color.b), // Convert to 0-1 range
    });

    const modifiedPdfBytes = await pdfDoc.save();

    // Optionally save the file locally
    fs.writeFileSync("./test.pdf", modifiedPdfBytes);

    // Return the modified PDF bytes
    return modifiedPdfBytes;
  } catch (error) {
    console.error("Error generating certificate:", error);
  }
}
async function validateEmailCredentials(email, appPassword) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or other services like Yahoo, Outlook, etc.
    auth: {
      user: email,
      pass: appPassword,
    },
  });

  try {
    await transporter.verify();
    return { success: true, message: "Credentials are valid." };
  } catch (error) {
    return {
      success: false,
      message: "Invalid credentials, please check your email and app password.",
    };
  }
}
module.exports = {
  sendEmailWithAttachment,
  generateEventCertificates,
  validateEmailCredentials,
};
