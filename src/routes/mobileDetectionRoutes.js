const express = require("express");
const { addMobileDetection, getMobileDetection } = require("../controllers/mobileDetectionController");
const verifyApiKey = require("../middlewares/apiKeyMiddleware");

const router = express.Router();

// ✅ Route GET untuk mendapatkan data dari `mobile_detection`
router.get("/mobile-detection", verifyApiKey, getMobileDetection);

// ✅ Route POST untuk menambahkan data ke `mobile_detection`
router.post("/mobile-detection", verifyApiKey, addMobileDetection);

module.exports = router;
