import express from "express";
import Certificate from "../models/Certificate.js";

const router = express.Router();

/* =========================================================
   STUDENT – VIEW CERTIFICATE (NO DOWNLOAD)
   ========================================================= */

router.get("/view/:enrollmentId", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      enrollment: req.params.enrollmentId,
    })
      .populate("student")
      .populate("course");

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not issued",
      });
    }

    res.status(200).json(certificate);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch certificate",
      error: err.message,
    });
  }
});

export default router;
