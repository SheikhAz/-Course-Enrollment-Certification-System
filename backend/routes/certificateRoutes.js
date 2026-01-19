const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/authMiddleware");
const { issueCertificate } = require("../controllers/certificateController");

router.post(
  "/issue-certificate",
  authMiddleware, // verifies token & sets req.user
  isAdmin, // checks admin role
  issueCertificate
);

module.exports = router;
