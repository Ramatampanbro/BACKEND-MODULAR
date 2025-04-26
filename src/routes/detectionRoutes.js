const express = require("express");
const { addDetection, getDetection, getLatestDetection } = require("../controllers/detectionController"); // ✅ Pastikan importnya benar
const verifyApiKey = require("../middlewares/apiKeyMiddleware");

const router = express.Router();

// ✅ Route GET untuk mendapatkan data deteksi
router.get("/detection", verifyApiKey, getDetection);

router.get("/detection-latest", verifyApiKey, getLatestDetection);

// ✅ Route POST untuk menambahkan data deteksi
router.post("/detection", verifyApiKey, addDetection);

module.exports = router;
