const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /register
exports.register = async (req, res) => {
  const { username, password, email, full_name, phone } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "กรุณากรอก username, password และ email" });
  }

  try {
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Username นี้ถูกใช้แล้ว" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users (username, password_hash, email, full_name, phone, role) 
             VALUES ($1, $2, $3, $4, $5, 'customer') 
             RETURNING user_id, username, email, full_name, phone, role, created_at`,
      [username, hashedPassword, email, full_name || null, phone || null]
    );

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอก username และ password" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Username หรือ Password ไม่ถูกต้อง" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Username หรือ Password ไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const query =
      "SELECT b.booking_id, b.user_id, b.pitch_id, b.booking_date, b.start_time, b.end_time, b.status, p.name as pitch_name FROM bookings b JOIN pitches p ON b.pitch_id = p.pitch_id WHERE b.user_id = $1 AND b.status != 'cancelled' ORDER BY b.booking_date ASC, b.start_time ASC";
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error in /my-bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
