const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const cors = require("cors");
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit"); // Import fontkit
const axios = require('axios');
const {
  generateEventCertificates,
  generateExecutiveCertificate,
  generateCoreCertificate,
  generateSuperCoreCertificate,
  sendEmailWithAttachment,
} = require("./utils");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 4000;
app.use(cors());
app.post(
  "/upload",
  upload.fields([{ name: "excelFile" }, { name: "certificateDesign" }]),
  async (req, res) => {
    try {
      // Retrieve files from memory instead of disk
      const excelBuffer = req.files["excelFile"][0].buffer;
      const designBuffer = req.files["certificateDesign"][0].buffer;
      const pdfBuffer = await generateEventCertificates(
        "Aaditya Mall",
        designBuffer
      );

      // Process Excel data directly from the buffer
      const workbook = xlsx.read(excelBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      for (const row of data) {
        //   console.log(row);
        const name = row["Name"];
        const email = row["Email"];
        // const designation = row['Designation'];
        // const department = row["Department"];
        //   // Generate certificate using the buffer for the design template
        // const pdfBuffer = await generateCoreCertificate(name,department, designation, designBuffer);
        const pdfBuffer = await generateEventCertificates(name, designBuffer);

        await sendEmailWithAttachment(email, pdfBuffer);
      }

      res.status(200).send("Certificates sent successfully.");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error processing files.");
    }
  }
);

// Function to fetch Google Font as binary
async function fetchGoogleFont(fontName) {
  const fontURL = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    / /g,
    "+"
  )}&display=swap`;
  const response = await axios.get(fontURL);
  const fontMatch = response.data.match(/url\((.*?)\)/);
  if (fontMatch) {
    const fontFileUrl = fontMatch[1];
    const fontBytes = await axios.get(fontFileUrl, {
      responseType: "arraybuffer",
    });
    return fontBytes.data;
  }
  throw new Error("Google Font not found");
}

// Generate certificate endpoint
app.post(
  "/generate-certificate",
  upload.single("template"),
  async (req, res) => {
    const { name, fontName } = req.body;
    const templateBuffer = req.file.buffer;

    try {
      // Load the PDF template
      const pdfDoc = await PDFDocument.load(templateBuffer);
      pdfDoc.registerFontkit(fontkit);

      // Get the selected font (fetch Google Font)
      const fontBytes = await fetchGoogleFont(fontName);
      const customFont = await pdfDoc.embedFont(fontBytes);

      const page = pdfDoc.getPage(0);
      page.drawText(name, {
        x: 240, // Adjust as per template layout
        y: 215, // Adjust as per template layout
        size: 35,
        font: customFont,
        color: rgb(1, 1, 1),
      });

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync("./uploads/test.pdf", pdfBytes)
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).send("Failed to generate certificate");
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
