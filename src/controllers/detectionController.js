const { detectionend } = require("../index"); // Pastikan io diekspor dengan benar
const { insertDetection, getAllDetections, getLatestData} = require("../models/detectionModel");
const response = require("../utils/response");
const sendTelegramAlert = require("../services/telegramService");

// Fungsi GET untuk mengambil semua data
exports.getDetection = (req, res) => {
  getAllDetections((err, results) => {
    if (err) {
      console.error("Error fetching detection data:", err);
      return response(500, null, "Error fetching detection data", res);
    }

    response(200, results, "List of detections", res);
  });
};

exports.getLatestDetection = (req, res) => {
   getLatestData((err, results) => {
    if (err) {
      console.error("couldn't fetch data", err);
      return response(500, null, "error fetching latest data", res);
    }
    response(200, results, "List of detections", res);
   });
}

// Fungsi POST untuk menambahkan data deteksi
exports.addDetection = (req, res) => {
  try {
    const {
      driver_id,
      eye_state,
      mouth_state,
      head_pose,
      yawning,
      drowsiness_status,
      start_time,
      end_time,
      duration,
    } = req.body;

    if (!driver_id || !start_time || !duration) {
      return response(400, null, "Missing required fields", res);
    }

    const values = [
      driver_id,
      eye_state,
      mouth_state,
      head_pose,
      yawning,
      drowsiness_status,
      start_time,
      end_time,
      duration,
    ];

    insertDetection(values, (err, result) => {
      if (err) {
        console.error("Database error:", err.sqlMessage || err);
        return response(500, null, "Database error", res);
      }

      if (result.affectedRows) {
        const data = {
          id: result.insertId,
          driver_id,
          eye_state,
          mouth_state,
          head_pose,
          yawning,
          drowsiness_status,
          start_time,
          end_time,
          duration,
        };

        response(200, data, "Data added successfully", res);

        console.log("New Detection Added:", data);

        // Pastikan detectionend sudah diinisialisasi sebelum melakukan emit
        if (detectionend) {
          detectionend.emit("new_detection", data); // Emit event ke frontend
        } else {
          console.warn("Socket.io not initialized, skipping emit.");
        }

        const message = `New detection for Driver ${driver_id}: Eye: ${eye_state}, Mouth: ${mouth_state}, Drowsy: ${drowsiness_status}, Start: ${start_time}, End: ${end_time}`;
        sendTelegramAlert(message);
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return response(500, null, "Server error", res);
  }
};
