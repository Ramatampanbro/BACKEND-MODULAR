const db = require("../config/dbConfig");

// ✅ Fungsi untuk menyisipkan data deteksi ke dalam `mobile_detection`
const insertMobileDetection = (values, callback) => {
  const sql = `
    INSERT INTO mobile_detection (driver_id, event, start_time, end_time, duration)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, values, callback);
};

// ✅ Fungsi untuk mengambil semua data deteksi dari `mobile_detection`
const getAllMobileDetections = (callback) => {
  const sql = "SELECT * FROM mobile_detection"; 
  db.query(sql, callback);
};

// ✅ Pastikan semua fungsi diekspor dengan benar
module.exports = { insertMobileDetection, getAllMobileDetections };
