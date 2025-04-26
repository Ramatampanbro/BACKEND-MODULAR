const { insertMobileDetection, getAllMobileDetections } = require("../models/mobileDetectionModel");
const response = require("../utils/response");
const { io } = require("../index"); // Pastikan io diekspor dengan benar
const sendTelegramAlert = require("../services/telegramService");

// ✅ Fungsi GET untuk mengambil semua data dari `mobile_detection`
exports.getMobileDetection = (req, res) => {
  getAllMobileDetections((err, results) => {
    if (err) {
      console.error("Error fetching mobile detection data:", err);
      return response(500, null, "Error fetching mobile detection data", res);
    }

    if (!results || results.length === 0) {
      return response(200, [], "No mobile detections found", res);
    }

    console.log("Fetched Mobile Detection Data:", results);
    response(200, results, "List of mobile detections", res);
  });
};

// ✅ Fungsi POST untuk menambahkan data ke `mobile_detection`
exports.addMobileDetection = (req, res) => {
  try {
    const { driver_id, event, start_time, end_time, duration } = req.body;

    if (!driver_id || !event || !start_time || !duration) {
      return response(400, null, "Missing required fields", res);
    }

    const values = [driver_id, event, start_time, end_time, duration];

    insertMobileDetection(values, (err, result) => {
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

        console.log("New Mobile Detection Added:", data);
        response(200, data, "Mobile detection added successfully", res);

        // Emit event ke socket.io jika tersedia
        if (io) {
          io.emit("new_mobile_detection", data);
        } else {
          console.warn("Socket.io not initialized, skipping emit.");
        }

        // Kirim notifikasi Telegram dengan error handling
        try {
          sendTelegramAlert(`New mobile detection: Driver ${driver_id}, Event: ${event}, Start: ${start_time}`);
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
