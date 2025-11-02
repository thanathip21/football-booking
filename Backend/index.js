const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ====================================
// 💚 HEALTH CHECK API
// ====================================

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1+1 AS result");
    res.json({
      status: "OK",
      message: "API Server is running and DB connection is good!",
    });
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    res.status(503).json({
      status: "Error",
      message:
        "Database connection failed. Check your .env config and Docker container status.",
    });
  }
});

app.use("/", authRoutes);
app.use("/", bookingRoutes);
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
