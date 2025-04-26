const express = require("express");
const { signup, signin, getAllUsers } = require("../controllers/authController");

const router = express.Router();

// Route POST untuk signup
router.post("/signup", signup);

// Route POST untuk signin (login)
router.post("/signin", signin);

// Route GET untuk melihat daftar pengguna yang sudah terdaftar
router.get("/users", getAllUsers);

module.exports = router;
