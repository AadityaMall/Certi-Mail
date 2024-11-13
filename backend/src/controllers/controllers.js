const {
  validateEmailCredentials,
  generateEventCertificates,
  sendEmailWithAttachment,
} = require("../setup/utils");
const xlsx = require("xlsx");

exports.AuthenticateEmailIdAppPassword = async (req, res) => {
  try {
    const { email, appPassword } = req.body;
    console.log(appPassword.replace(/\s/g, "").length);
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
    // Access files from req.files
    const excelFile = req.files["excelFile"][0].buffer;
    const templateFile = req.files["templateFile"][0].buffer;
    const fontFile = req.files["fontFile"]
      ? req.files["fontFile"][0].buffer
      : null;

    const workbook = xlsx.read(excelFile, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    let { xCoord, yCoord, fontSize, color, subject, body } = req.body;

    const parsedColor = color ? JSON.parse(color) : { r: 0, g: 0, b: 0 };
    
    xCoord = parseInt(xCoord, 10);
    yCoord = parseInt(yCoord, 10);
    fontSize = parseInt(fontSize, 10);

    for (const row of data) {
      const name = row["Name"];
      const email = row["Email"];
      const pdfBuffer = await generateEventCertificates(
        name,
        templateFile,
        xCoord,
        yCoord,
        fontSize,
        parsedColor,
        fontFile
      );
      const response = await sendEmailWithAttachment(email, pdfBuffer, subject, body);
      if (response.rejected.includes(email)) {
        row["Response"] = "Failed"
      } else {
        row["Response"] = "Success"
      }
    }
    console.log(data)
    res
      .status(200)
      .json({ message: "Files processed and certificate generated",generatedData:data});
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ message: "Error processing files" });
  }
};
