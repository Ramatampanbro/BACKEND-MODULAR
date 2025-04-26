const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/dbConfig");
const { insertUser, getUserByEmail } = require("../models/userModel");
const response = require("../utils/response");

// ✅ Fungsi GET untuk mengambil semua pengguna
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return response(500, null, "Error fetching users", res);
    }

    // ✅ log untuk menampilkan data pengguna di terminal
    console.log("Fetched Users Data:", results);

    response(200, results, "List of registered users", res);
  });
};

// ✅ Fungsi POST untuk Signup
exports.signup = (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return response(400, null, "All fields are required", res);
    }

    getUserByEmail(email, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return response(500, null, "Database error", res);
      }

      if (result.length > 0) {
        return response(400, null, "Email already registered", res);
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Hashing error:", err);
          return response(500, null, "Error hashing password", res);
        }

        const values = [name, email, hashedPassword];

        insertUser(values, (err, result) => {
          if (err) {
            console.error("Insert user error:", err);
            return response(500, null, "Error registering user", res);
          }

          // ✅ Tmelihat data pengguna yang berhasil signup
          console.log("New User Registered:", {
            id: result.insertId,
            name: name,
            email: email
          });

          response(201, { id: result.insertId, name, email }, "User registered successfully", res);
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return response(500, null, "Server error", res);
  }
};

// ✅ Fungsi POST untuk Signin (Login)
exports.signin = (req, res) => {
  const { email, password } = req.body;

  // Pastikan email dan password telah dimasukkan
  if (!email || !password) {
    return response(400, null, "All fields are required", res);
  }

  // Cari pengguna berdasarkan email
  getUserByEmail(email, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return response(500, null, "Database error", res);
    }

    if (result.length === 0) {
      return response(400, null, "User not found", res); // Menangani jika email tidak ditemukan
    }

    const user = result[0]; // Ambil pengguna pertama (seharusnya hanya satu)

    // Bandingkan password yang dimasukkan dengan yang ada di database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing password:", err);
        return response(500, null, "Error comparing password", res);
      }

      if (!isMatch) {
        return response(400, null, "Invalid email or password", res); // Jika password tidak cocok
      }

      // Jika password cocok, buat token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Kirim token ke pengguna
      return res.json({
        msg: 'Login successful',
        token,  // Kirim token kepada pengguna
      });
    });
  });
};
