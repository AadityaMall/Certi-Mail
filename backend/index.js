const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { generateExecutiveCertificate, generateCoreCertificate, generateSuperCoreCertificate, sendEmailWithAttachment } = require('./utils');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to keep files in memory
const port = process.env.PORT || 4000;

app.post('/upload', upload.fields([{ name: 'excelFile' }, { name: 'certificateDesign' }]), async (req, res) => {
  try {
    // Retrieve files from memory instead of disk
    const excelBuffer = req.files['excelFile'][0].buffer;
    const designBuffer = req.files['certificateDesign'][0].buffer;

    // Process Excel data directly from the buffer
    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      console.log(row);
      const name = row['Name'];
      const email = row['Email'];
      // const designation = row['Designation'];
      const department = row['Department']
      // Generate certificate using the buffer for the design template
      // const pdfBuffer = await generateCoreCertificate(name,department, designation, designBuffer); 
      const pdfBuffer = await generateExecutiveCertificate(name,department, designBuffer); 

      await sendEmailWithAttachment(email, pdfBuffer);
    }

    res.status(200).send('Certificates sent successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing files.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
