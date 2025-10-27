// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const pool = require("./db");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====================================
// // 🔐 AUTHENTICATION APIs
// // ====================================

// // POST /register - สมัครสมาชิก
// app.post("/register", async (req, res) => {
//   const { username, password, email, full_name, phone } = req.body;

//   if (!username || !password || !email) {
//     return res.status(400).json({ 
//       message: "กรุณากรอก username, password และ email" 
//     });
//   }

//   try {
//     // ตรวจสอบว่า username ซ้ำหรือไม่
//     const checkUser = await pool.query(
//       "SELECT * FROM users WHERE username = $1",
//       [username]
//     );

//     if (checkUser.rows.length > 0) {
//       return res.status(400).json({ 
//         message: "Username นี้ถูกใช้แล้ว" 
//       });
//     }

//     // เข้ารหัส password ด้วย bcrypt
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // บันทึกลง database
//     const result = await pool.query(
//       `INSERT INTO users (username, password_hash, email, full_name, phone, role) 
//        VALUES ($1, $2, $3, $4, $5, 'customer') 
//        RETURNING user_id, username, email, full_name, role, created_at`,
//       [username, hashedPassword, email, full_name || null, phone || null]
//     );

//     res.status(201).json({
//       message: "สมัครสมาชิกสำเร็จ",
//       user: result.rows[0]
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST /login - เข้าสู่ระบบ
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ 
//       message: "กรุณากรอก username และ password" 
//     });
//   }

//   try {
//     // ค้นหา user
//     const result = await pool.query(
//       "SELECT * FROM users WHERE username = $1",
//       [username]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         message: "Username หรือ Password ไม่ถูกต้อง" 
//       });
//     }

//     const user = result.rows[0];

//     // เปรียบเทียบ password
//     const isMatch = await bcrypt.compare(password, user.password_hash);

//     if (!isMatch) {
//       return res.status(401).json({ 
//         message: "Username หรือ Password ไม่ถูกต้อง" 
//       });
//     }

//     // สร้าง JWT Token
//     const token = jwt.sign(
//       { 
//         user_id: user.user_id, 
//         username: user.username,
//         role: user.role 
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     res.json({
//       message: "เข้าสู่ระบบสำเร็จ",
//       token: token,
//       user: {
//         user_id: user.user_id,
//         username: user.username,
//         email: user.email,
//         full_name: user.full_name,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ====================================
// // 🔒 Middleware ตรวจสอบ Token
// // ====================================
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "ไม่พบ Token กรุณา Login" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
//     }
//     req.user = user;
//     next();
//   });
// }

// // GET /profile - ดูข้อมูลตัวเอง (ต้อง Login)
// app.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT user_id, username, email, full_name, phone, role, created_at 
//        FROM users WHERE user_id = $1`,
//       [req.user.user_id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ====================================
// // ⚽ APIs สนามฟุตบอล
// // ====================================

// // ฟังก์ชันสร้าง slots ของวัน 12:00-00:00
// function generateTimeSlots(start = "12:00", end = "00:00", slotMinutes = 60) {
//   const slots = [];
//   let [h, m] = start.split(":").map(Number);
//   let [endH, endM] = end === "00:00" ? [24, 0] : end.split(":").map(Number);

//   while (h < endH || (h === endH && m < endM)) {
//     const startTime = `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}`;
//     let nextH = h + Math.floor((m + slotMinutes) / 60);
//     let nextM = (m + slotMinutes) % 60;
//     const endTimeSlot =
//       nextH === 24
//         ? "00:00"
//         : `${nextH.toString().padStart(2, "0")}:${nextM
//             .toString()
//             .padStart(2, "0")}`;
//     slots.push({ start_time: startTime, end_time: endTimeSlot });
//     h = nextH;
//     m = nextM;
//   }

//   return slots;
// }

// // แปลงเวลา HH:MM เป็นนาที
// function timeToMinutes(t) {
//   const [h, m] = t.split(":").map(Number);
//   return h * 60 + m;
// }

// // GET /pitches - ดูสนามทั้งหมด
// app.get("/pitches", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM pitches ORDER BY pitch_id");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // GET /pitches/available-slots?date=YYYY-MM-DD
// app.get("/pitches/available-slots", async (req, res) => {
//   const { date } = req.query;
//   if (!date)
//     return res
//       .status(400)
//       .json({ message: "กรุณาส่ง date เป็น query param เช่น 2025-10-23" });

//   const slots = generateTimeSlots();

//   try {
//     const bookings = await pool.query(
//       `SELECT pitch_id, start_time, end_time FROM bookings WHERE booking_date = $1`,
//       [date]
//     );

//     const pitches = await pool.query(`SELECT * FROM pitches ORDER BY pitch_id`);
//     const result = [];

//     pitches.rows.forEach((pitch) => {
//       const availableSlots = slots.filter((slot) => {
//         return !bookings.rows.some(
//           (b) =>
//             b.pitch_id === pitch.pitch_id &&
//             timeToMinutes(slot.start_time) < timeToMinutes(b.end_time) &&
//             timeToMinutes(slot.end_time) > timeToMinutes(b.start_time)
//         );
//       });
//       result.push({
//         pitch_id: pitch.pitch_id,
//         name: pitch.name,
//         slots: availableSlots,
//       });
//     });

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // POST /bookings - จองสนาม (ต้อง Login)
// app.post("/bookings", authenticateToken, async (req, res) => {
//   const { pitch_id, booking_date, start_time, duration_hours } = req.body;
//   const user_id = req.user.user_id; // ดึง user_id จาก Token

//   if (!pitch_id || !booking_date || !start_time || !duration_hours) {
//     return res.status(400).json({ message: "กรุณาส่งข้อมูลครบทุก field" });
//   }

//   // แปลง duration เป็น end_time
//   let [h, m] = start_time.split(":").map(Number);
//   let endH = h + Number(duration_hours);
//   let end_time = `${(endH % 24).toString().padStart(2, "0")}:${m
//     .toString()
//     .padStart(2, "0")}`;

//   try {
//     // ตรวจสอบว่าช่วงเวลานี้ซ้อนกับการจองเก่าหรือไม่
//     const check = await pool.query(
//       `SELECT * FROM bookings 
//        WHERE pitch_id=$1 AND booking_date=$2
//          AND start_time < $3 AND end_time > $4`,
//       [pitch_id, booking_date, end_time, start_time]
//     );

//     if (check.rows.length > 0) {
//       return res
//         .status(400)
//         .json({ message: "สนามนี้ถูกจองแล้วในช่วงเวลานี้" });
//     }

//     // บันทึก booking
//     const result = await pool.query(
//       `INSERT INTO bookings (user_id, pitch_id, booking_date, start_time, end_time, status)
//        VALUES ($1,$2,$3,$4,$5,'confirmed') RETURNING *`,
//       [user_id, pitch_id, booking_date, start_time, end_time]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // -----------------------------
// // Start server
// // -----------------------------
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db"); // ดึง Connection Pool จาก db.js
require('dotenv').config(); // เพื่อให้แน่ใจว่าโหลด JWT_SECRET และตัวแปรอื่น ๆ

const app = express();
app.use(cors());
// Middleware สำคัญ: ทำให้ Express สามารถอ่าน JSON Body ได้
app.use(express.json());

// ====================================
// 💚 HEALTH CHECK API (สำหรับตรวจสอบการเชื่อมต่อ DB)
// ====================================

// GET /health - ตรวจสอบสถานะการเชื่อมต่อฐานข้อมูล
app.get("/health", async (req, res) => {
    try {
        // ทดสอบ Query ง่าย ๆ เพื่อเช็ค Pool Connection
        await pool.query("SELECT 1+1 AS result"); 
        res.json({ 
            status: "OK", 
            message: "API Server is running and DB connection is good!" 
        });
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        // ตอบกลับด้วย HTTP 503 (Service Unavailable) หากเชื่อมต่อไม่ได้
        res.status(503).json({ 
            status: "Error", 
            message: "Database connection failed. Check your .env config and Docker container status." 
        });
    }
});

// ====================================
// 🔐 AUTHENTICATION APIs
// ====================================

// POST /register - สมัครสมาชิก
app.post("/register", async (req, res) => {
  const { username, password, email, full_name, phone } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ 
      message: "กรุณากรอก username, password และ email" 
    });
  }

  try {
    // ตรวจสอบว่า username ซ้ำหรือไม่
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ 
        message: "Username นี้ถูกใช้แล้ว" 
      });
    }

    // เข้ารหัส password ด้วย bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // บันทึกลง database
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /login - เข้าสู่ระบบ
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      message: "กรุณากรอก username และ password" 
    });
  }

  try {
    // ค้นหา user
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      // เพื่อป้องกันการคาดเดา ให้ใช้ข้อความเดียวกันกับ password ผิด
      return res.status(401).json({ 
        message: "Username หรือ Password ไม่ถูกต้อง" 
      });
    }

    const user = result.rows[0];

    // เปรียบเทียบ password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ 
        message: "Username หรือ Password ไม่ถูกต้อง" 
      });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        username: user.username,
        role: user.role 
      },
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
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================================
// 🔒 Middleware ตรวจสอบ Token
// ====================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "ไม่พบ Token กรุณา Login" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }
    req.user = user;
    next();
  });
}

// GET /profile - ดูข้อมูลตัวเอง (ต้อง Login)
app.get("/profile", authenticateToken, async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================================
// ⚽ APIs สนามฟุตบอล
// ====================================

// ฟังก์ชันสร้าง slots ของวัน 12:00-00:00
function generateTimeSlots(start = "12:00", end = "00:00", slotMinutes = 60) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  // แปลง 00:00 เป็น 24:00 เพื่อให้ Loop ทำงานได้ถูกต้องข้ามวัน
  let [endH, endM] = end === "00:00" ? [24, 0] : end.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    const startTime = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
    let totalMinutes = h * 60 + m + slotMinutes;
    let nextH = Math.floor(totalMinutes / 60);
    let nextM = totalMinutes % 60;

    // จัดการเวลา 24:00 ให้แสดงเป็น 00:00
    const endTimeSlot =
      (nextH >= 24)
        ? "00:00"
        : `${nextH.toString().padStart(2, "0")}:${nextM
            .toString()
            .padStart(2, "0")}`;
    
    slots.push({ start_time: startTime, end_time: endTimeSlot });
    h = nextH;
    m = nextM;

    if (h === 24 && m === 0) break; // หยุดเมื่อถึง 00:00 (24:00)
  }

  return slots;
}

// แปลงเวลา HH:MM เป็นนาที
function timeToMinutes(t) {
    if (t === "00:00") return 24 * 60; // 00:00 ถือเป็น 24:00 สำหรับการคำนวณซ้อนทับ
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

// GET /pitches - ดูสนามทั้งหมด
app.get("/pitches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pitches ORDER BY pitch_id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error in /pitches:", err);
    res.status(500).send("Server error");
  }
});

// GET /pitches/available-slots?date=YYYY-MM-DD
app.get("/pitches/available-slots", async (req, res) => {
  const { date } = req.query;
  if (!date)
    return res
      .status(400)
      .json({ message: "กรุณาส่ง date เป็น query param เช่น 2025-10-23" });

  const slots = generateTimeSlots();

  try {
    const bookings = await pool.query(
      `SELECT pitch_id, start_time, end_time FROM bookings WHERE booking_date = $1`,
      [date]
    );

    const pitches = await pool.query(`SELECT * FROM pitches ORDER BY pitch_id`);
    const result = [];

    pitches.rows.forEach((pitch) => {
      const availableSlots = slots.filter((slot) => {
        return !bookings.rows.some(
          (b) =>
            b.pitch_id === pitch.pitch_id &&
            timeToMinutes(slot.start_time) < timeToMinutes(b.end_time) &&
            timeToMinutes(slot.end_time) > timeToMinutes(b.start_time)
        );
      });
      result.push({
        pitch_id: pitch.pitch_id,
        name: pitch.name,
        slots: availableSlots,
      });
    });

    res.json(result);
  } catch (err) {
    console.error("Error in /pitches/available-slots:", err);
    res.status(500).send("Server error");
  }
});

// POST /bookings - จองสนาม (ต้อง Login)
app.post("/bookings", authenticateToken, async (req, res) => {
  const { pitch_id, booking_date, start_time, duration_hours } = req.body;
  const user_id = req.user.user_id; // ดึง user_id จาก Token

  if (!pitch_id || !booking_date || !start_time || !duration_hours) {
    return res.status(400).json({ message: "กรุณาส่งข้อมูลครบทุก field" });
  }

  // แปลง duration เป็น end_time
  let [h, m] = start_time.split(":").map(Number);
  let endH = h + Number(duration_hours);
  let endM = m;
    
    // ตรวจสอบการข้ามวันสำหรับ end_time
    const calculated_end_time = 
        (endH >= 24 ? "00" : endH.toString().padStart(2, "0")) + 
        ":" + 
        endM.toString().padStart(2, "0");

  try {
    // ตรวจสอบว่าช่วงเวลานี้ซ้อนกับการจองเก่าหรือไม่
    // ใช้เงื่อนไขการซ้อนทับ: (A.start < B.end) AND (A.end > B.start)
    const check = await pool.query(
      `SELECT * FROM bookings 
       WHERE pitch_id=$1 AND booking_date=$2
         AND start_time < $3 AND end_time > $4`,
      [pitch_id, booking_date, calculated_end_time, start_time]
    );

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "สนามนี้ถูกจองแล้วในช่วงเวลานี้" });
    }

    // บันทึก booking
    const result = await pool.query(
      `INSERT INTO bookings (user_id, pitch_id, booking_date, start_time, end_time, status)
       VALUES ($1,$2,$3,$4,$5,'confirmed') RETURNING *`,
      [user_id, pitch_id, booking_date, start_time, calculated_end_time]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in /bookings:", err);
    res.status(500).send("Server error");
  }
});

// -----------------------------
// Start server
// -----------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));