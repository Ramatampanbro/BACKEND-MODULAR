const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routesy
const detectionRoutes = require("./routes/detectionRoutes");
const db = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const mobileDetectionRoutes = require("./routes/mobileDetectionRoutes");
const smokeDetectionRoutes = require("./routes/smokeDetectionRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Buat server HTTP
const server = http.createServer(app);

//cors pengaturan
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: "*",
};
app.use(cors(corsOptions));

// Inisialisasi Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Izinkan semua origin (untuk development)
    methods: ["GET", "POST"], // Izinkan metode GET dan POST
  },
});

// Handle koneksi Socket.io utama
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle event disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Buat namespace untuk deteksi
const detectionend = io.of("/api/detection");
detectionend.on("connection", (socket) => {
  console.log("User connected to /api/detection:", socket.id);

  // Handle event disconnect untuk namespace ini
  socket.on("disconnect", () => {
    console.log("User disconnected from /api/detection:", socket.id);
  });
});

// Routes
app.use("/api", authRoutes);
app.use("/api", detectionRoutes);
app.use("/api", mobileDetectionRoutes);
app.use("/api", smokeDetectionRoutes);

// Handle 404 (Route tidak ditemukan)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Handle error global
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Jalankan server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Ekspor io dan detectionend untuk digunakan di file lain
module.exports = { io, detectionend }; // Pastikan ekspor dengan benar
