const db = require("../config/dbConfig");

// ✅ Fungsi untuk menyisipkan data deteksi ke dalam database
const insertDetection = (values, callback) => {
  const sql = `
    INSERT INTO driver_data (driver_id, eye_state, mouth_state, head_pose, yawning, drowsiness_status, start_time, end_time, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, values, callback);
};

// ✅ Fungsi untuk mengambil semua data deteksi dari database
const getAllDetections = (callback) => {
  const sql = "SELECT * FROM driver_data ORDER BY driver_data.id DESC LIMIT 10"; // Sesuaikan dengan nama tabel
  db.query(sql, callback);
};

const getLatestData = (callback) => {
  const sql = "SELECT * FROM driver_data ORDER BY driver_data.id DESC LIMIT 10";
  db.query(sql, callback);
}

// ✅ Pastikan semua fungsi diekspor dengan benar
module.exports = { insertDetection, getAllDetections, getLatestData };
