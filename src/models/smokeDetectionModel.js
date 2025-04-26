const db = require("../config/dbConfig");

// ✅ Fungsi untuk menyisipkan data deteksi ke dalam `smoke_detection`
const insertSmokeDetection = (values, callback) => {
  const sql = `
    INSERT INTO smoke_detection (driver_id, event, start_time, end_time, duration)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, values, callback);
};

// ✅ Fungsi untuk mengambil semua data deteksi dari `smoke_detection`
const getAllSmokeDetections = (callback) => {
  const sql = "SELECT * FROM smoke_detection"; 
  db.query(sql, callback);
};

// ✅ Pastikan semua fungsi diekspor dengan benar
module.exports = { insertSmokeDetection, getAllSmokeDetections };
