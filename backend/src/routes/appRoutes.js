const express = require("express");
const {
  AuthenticateEmailIdAppPassword,
  SendMailWithCertificate,
  SendMails,
} = require("../controllers/controllers");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
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
  upload.fields([{ name: "excelFile", maxCount: 1 }]),
  SendMails
);
module.exports = router;
