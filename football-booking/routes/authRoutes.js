// routes/authRoutes.js
const express = require("express");
const { register, login, getProfile, getMyBookings } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/my-bookings', authenticateToken, getMyBookings);
module.exports = router;