const express = require("express");
const { addSmokeDetection, getSmokeDetection } = require("../controllers/smokeDetectionController");
const verifyApiKey = require("../middlewares/apiKeyMiddleware");

const router = express.Router();

// ✅ Route GET untuk mendapatkan data dari `smoke_detection`
router.get("/smoke-detection", verifyApiKey, getSmokeDetection);

// ✅ Route POST untuk menambahkan data ke `smoke_detection`
router.post("/smoke-detection", verifyApiKey, addSmokeDetection);

module.exports = router;
