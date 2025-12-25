const express = require("express");
const {
  AuthenticateEmailIdAppPassword,
  SendMailWithCertificate,
  SendMails,
  SendEmailWithAttachment,
} = require("../controllers/controllers");
const router = express.Router();
const multer = require("multer");
const upload = multer({ 
  storage: multer.memoryStorage(),
  // Don't throw errors on unexpected fields when using upload.any()
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept all files
  }
});
router.route("/validate-user-email").post(AuthenticateEmailIdAppPassword);

router.post(
  "/send-mail-with-certificate",
  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "templateFile", maxCount: 1 },
    { name: "fontFile", maxCount: 1 },
  ]),
  SendMailWithCertificate
);
router.post(
  "/send-mails",
  upload.any(), // Accept any files and form fields
  SendMails
);
module.exports = router;
