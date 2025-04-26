const { insertSmokeDetection, getAllSmokeDetections } = require("../models/smokeDetectionModel");
const response = require("../utils/response");
const { io } = require("../index"); // Pastikan io diekspor dengan benar
const sendTelegramAlert = require("../services/telegramService");

// ✅ Fungsi GET untuk mengambil semua data dari `smoke_detection`
exports.getSmokeDetection = (req, res) => {
  getAllSmokeDetections((err, results) => {
    if (err) {
      console.error("Error fetching smoke detection data:", err);
      return response(500, null, "Error fetching smoke detection data", res);
    }

    if (!results || results.length === 0) {
      return response(200, [], "No smoke detections found", res);
    }

    console.log("Fetched Smoke Detection Data:", results);
    response(200, results, "List of smoke detections", res);
  });
};

// ✅ Fungsi POST untuk menambahkan data ke `smoke_detection`
exports.addSmokeDetection = (req, res) => {
  try {
    const { driver_id, event, start_time, end_time, duration } = req.body;

    if (!driver_id || !event || !start_time || !duration) {
      return response(400, null, "Missing required fields", res);
    }

    const values = [driver_id, event, start_time, end_time, duration];

    insertSmokeDetection(values, (err, result) => {
      if (err) {
        console.error("Database error:", err?.sqlMessage || err);
        return response(500, null, "Database error", res);
      }

      if (result.affectedRows) {
        const data = {
          id: result.insertId,
          driver_id,
          event,
          start_time,
          end_time,
          duration
        };

        console.log("New Smoke Detection Added:", data);
        response(200, data, "Smoke detection added successfully", res);

        // ✅ Emit event ke socket.io jika tersedia
        if (io) {
          io.emit("new_smoke_detection", data);
        } else {
          console.warn("Socket.io not initialized, skipping emit.");
        }

        // ✅ Kirim notifikasi Telegram dengan error handling
        try {
          sendTelegramAlert(`New smoke detection: Driver ${driver_id}, Event: ${event}, Start: ${start_time}`);
        } catch (err) {
          console.error("Failed to send Telegram alert:", err);
        }
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return response(500, null, "Server error", res);
  }
};
