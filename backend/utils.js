const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit"); // Import fontkit

const sendEmailWithAttachment = async (recipientEmail, pdfBuffer) => {
  try {
    // Configure your SMTP server details
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use 'Gmail', 'Yahoo', 'Outlook', or your SMTP server
      auth: {
        user: process.env.SMPT_MAIL, // Replace with your email
        pass: process.env.SMPT_PASSWORD, // Replace with your email password or app-specific password
      },
    });
    const mailOptions = {
      from: process.env.SMPT_MAIL, // Sender address
      to: recipientEmail, // Recipient address
      subject: "Your Certificate", // Email subject
      text: "Please find your certificate attached.", // Email body
        attachments: [
          {
            filename: "certificate.pdf", // Attachment name
            content: pdfBuffer, // PDF file buffer
            contentType: "application/pdf",
          },
        ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
async function generateExecutiveCertificate(name, department, designPath) {
  console.log("PDF generation function called");

  // Read the existing PDF template
  const existingPdfBytes = fs.readFileSync(designPath); // Make sure this is a PDF file
  const pdfDoc = await PDFDocument.load(existingPdfBytes); // Load the PDF template
  pdfDoc.registerFontkit(fontkit);

  const execFontBytes = fs.readFileSync("./Fonts/PinyonScript-Regular.ttf"); // Path to your custom font file
  const execNameFont = await pdfDoc.embedFont(execFontBytes); // Embed the custom font

  const execDescriptionFontBytes = fs.readFileSync(
    "./Fonts/ExecDescription.ttf"
  ); // Path to your custom font file
  const execDescriptionFont = await pdfDoc.embedFont(execDescriptionFontBytes); // Embed the custom font
  const pages = pdfDoc.getPages();
  const firstPage = pages[0]; // Use the first page for modifications (modify this if needed)

  // Add text to the existing page
  firstPage.drawText(`${name}`, {
    x: 70, // Adjust the x position as per your template layout
    y: 250, // Adjust the y position as per your template layout
    size: 60,
    font: execNameFont,
    color: rgb(0.30196078431372547, 0.37254901960784315, 0.6235294117647059), // Adjust color if needed
  });

  // Add text to the existing page
  firstPage.drawText(`${department}`, {
    x: 285, // Adjust the x position as per your template layout
    y: 185, // Adjust the y position as per your template layout
    size: 19,
    font: execDescriptionFont,
    color: rgb(0.21568627450980393, 0.25098039215686274, 0.3568627450980392), // Adjust color if needed
  });

  // Save the modified PDF and return it
  const pdfBytes = await pdfDoc.save();
  // Return the PDF bytes if needed for further processing
  return pdfBytes;
}
async function generateCoreCertificate(
  name,
  department,
  designation,
  designPath
) {
  console.log("PDF generation function called");

  // Read the existing PDF template
  const existingPdfBytes = fs.readFileSync(designPath); // Make sure this is a PDF file
  const pdfDoc = await PDFDocument.load(existingPdfBytes); // Load the PDF template
  pdfDoc.registerFontkit(fontkit);

  const execFontBytes = fs.readFileSync("./Fonts/PinyonScript-Regular.ttf"); // Path to your custom font file
  const execNameFont = await pdfDoc.embedFont(execFontBytes); // Embed the custom font

  const execDescriptionFontBytes = fs.readFileSync(
    "./Fonts/ExecDescription.ttf"
  ); // Path to your custom font file
  const execDescriptionFont = await pdfDoc.embedFont(execDescriptionFontBytes); // Embed the custom font
  const pages = pdfDoc.getPages();
  const firstPage = pages[0]; // Use the first page for modifications (modify this if needed)

  // Add text to the existing page
  firstPage.drawText(`${name}`, {
    x: 70, // Adjust the x position as per your template layout
    y: 250, // Adjust the y position as per your template layout
    size: 60,
    font: execNameFont,
    color: rgb(0.16470588235294117, 0.38823529411764707, 0.7215686274509804), // Adjust color if needed
  });

  // Add text to the existing page
  firstPage.drawText(`${designation} of ${department}`, {
    x: 285, // Adjust the x position as per your template layout
    y: 185, // Adjust the y position as per your template layout
    size: 19,
    font: execDescriptionFont,
    color: rgb(0.08235294117647059, 0.2235294117647059, 0.37254901960784315), // Adjust color if needed
  });

  // Save the modified PDF and return it
  const pdfBytes = await pdfDoc.save();

  // Return the PDF bytes if needed for further processing
  return pdfBytes;
}
async function generateSuperCoreCertificate(name, designation, designPath) {
  console.log("PDF generation function called");

  // Read the existing PDF template
  const existingPdfBytes = fs.readFileSync(designPath); // Make sure this is a PDF file
  const pdfDoc = await PDFDocument.load(existingPdfBytes); // Load the PDF template
  pdfDoc.registerFontkit(fontkit);

  const execFontBytes = fs.readFileSync("./Fonts/PinyonScript-Regular.ttf"); // Path to your custom font file
  const execNameFont = await pdfDoc.embedFont(execFontBytes); // Embed the custom font

  const execDescriptionFontBytes = fs.readFileSync(
    "./Fonts/ExecDescription.ttf"
  ); // Path to your custom font file
  const execDescriptionFont = await pdfDoc.embedFont(execDescriptionFontBytes); // Embed the custom font
  const pages = pdfDoc.getPages();
  const firstPage = pages[0]; // Use the first page for modifications (modify this if needed)

  // Add text to the existing page
  firstPage.drawText(`${name}`, {
    x: 70, // Adjust the x position as per your template layout
    y: 250, // Adjust the y position as per your template layout
    size: 60,
    font: execNameFont,
    color: rgb(0.4627450980392157, 0.20392156862745098, 0.5333333333333333), // Adjust color if needed
  });

  // Add text to the existing page
  firstPage.drawText(`${designation}`, {
    x: 350, // Adjust the x position as per your template layout
    y: 187, // Adjust the y position as per your template layout
    size: 19,
    font: execDescriptionFont,
    color: rgb(0.3215686274509804, 0.1450980392156863, 0.30196078431372547), // Adjust color if needed
  });

  // Save the modified PDF and return it
  const pdfBytes = await pdfDoc.save();

  // Return the PDF bytes if needed for further processing
  return pdfBytes;
}
module.exports = {
  generateExecutiveCertificate,
  sendEmailWithAttachment,
  generateCoreCertificate,
  generateSuperCoreCertificate,
};
