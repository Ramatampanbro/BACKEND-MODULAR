const db = require("../config/dbConfig");

const insertUser = (values, callback) => {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)`;

  db.query(sql, values, callback);
};

const getUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], callback);
};

module.exports = { insertUser, getUserByEmail };
