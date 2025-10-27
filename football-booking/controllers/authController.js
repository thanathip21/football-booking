// controllers/authController.js
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /register
exports.register = async (req, res) => {
    const { username, password, email, full_name, phone } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "กรุณากรอก username, password และ email" });
    }

    try {
        const checkUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: "Username นี้ถูกใช้แล้ว" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO users (username, password_hash, email, full_name, phone, role) 
             VALUES ($1, $2, $3, $4, $5, 'customer') 
             RETURNING user_id, username, email, full_name, role, created_at`,
            [username, hashedPassword, email, full_name || null, phone || null]
        );

        res.status(201).json({
            message: "สมัครสมาชิกสำเร็จ",
            user: result.rows[0]
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
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Username หรือ Password ไม่ถูกต้อง" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Username หรือ Password ไม่ถูกต้อง" });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "เข้าสู่ระบบสำเร็จ",
            token: token,
            user: { user_id: user.user_id, username: user.username, email: user.email, full_name: user.full_name, role: user.role }
        });

    } catch (err) {
        console.error("Error in /login:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /profile
exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT user_id, username, email, full_name, phone, role, created_at 
             FROM users WHERE user_id = $1`,
            [req.user.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error in /profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};