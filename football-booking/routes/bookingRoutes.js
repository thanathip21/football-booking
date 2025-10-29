// routes/bookingRoutes.js
const express = require("express");
const {
  getPitches,
  getAvailableSlots,
  createBooking,
} = require("../controllers/bookingController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/pitches", authenticateToken, getPitches);
router.get("/pitches/available-slots", authenticateToken, getAvailableSlots);
router.post("/bookings", authenticateToken, createBooking);

module.exports = router;
