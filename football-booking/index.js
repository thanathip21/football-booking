const express = require("express");
const cors = require("cors");
const pool = require("./db"); // ต้องตั้งค่า Pool ของ PostgreSQL ให้เรียบร้อย

const app = express();
app.use(cors());
app.use(express.json());

// ฟังก์ชันสร้าง slots ของวัน 12:00-00:00

function generateTimeSlots(start = "12:00", end = "00:00", slotMinutes = 60) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  let [endH, endM] = end === "00:00" ? [24, 0] : end.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    const startTime = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
    let nextH = h + Math.floor((m + slotMinutes) / 60);
    let nextM = (m + slotMinutes) % 60;
    const endTimeSlot =
      nextH === 24
        ? "00:00"
        : `${nextH.toString().padStart(2, "0")}:${nextM
            .toString()
            .padStart(2, "0")}`;
    slots.push({ start_time: startTime, end_time: endTimeSlot });
    h = nextH;
    m = nextM;
  }

  return slots;
}

// แปลงเวลา HH:MM เป็นนาที

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// GET /pitches - ดูสนามทั้งหมด

app.get("/pitches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pitches ORDER BY pitch_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /pitches/available-slots?date=YYYY-MM-DD 2025-10-27
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
    console.error(err);
    res.status(500).send("Server error");
  }
});
// POST /bookings - จองสนามแบบกำหนดชั่วโมงเอง
app.post("/bookings", async (req, res) => {
  const { user_id, pitch_id, booking_date, start_time, duration_hours } =
    req.body;

  if (
    !user_id ||
    !pitch_id ||
    !booking_date ||
    !start_time ||
    !duration_hours
  ) {
    return res.status(400).json({ message: "กรุณาส่งข้อมูลครบทุก field" });
  }

  // แปลง duration เป็น end_time
  let [h, m] = start_time.split(":").map(Number);
  let endH = h + Number(duration_hours);
  let end_time = `${(endH % 24).toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;

  try {
    // ตรวจสอบว่าช่วงเวลานี้ซ้อนกับการจองเก่าหรือไม่
    const check = await pool.query(
      `SELECT * FROM bookings 
       WHERE pitch_id=$1 AND booking_date=$2
         AND start_time < $3 AND end_time > $4`,
      [pitch_id, booking_date, end_time, start_time]
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
      [user_id, pitch_id, booking_date, start_time, end_time]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -----------------------------
// Start server
// -----------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
