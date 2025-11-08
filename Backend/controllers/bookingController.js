const pool = require("../db");
const { generateTimeSlots, timeToMinutes } = require("../utils/timeUtils");

// GET /pitches
exports.getPitches = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pitches ORDER BY pitch_id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error in /pitches:", err);
    res.status(500).send("Server error");
  }
};

// GET /pitches/available-slots
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  if (!date)
    return res
      .status(400)
      .json({ message: "กรุณาส่ง date เป็น query param เช่น 2025-10-23" });

  const slots = generateTimeSlots();

  try {
    const bookings = await pool.query(
      `SELECT pitch_id, start_time, end_time FROM bookings WHERE booking_date = $1 AND status = 'confirmed'`,
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
};

// POST /bookings
// controllers/bookingController.js

exports.createBooking = async (req, res) => {
  const { pitch_id, booking_date, start_time, duration_hours } = req.body;
  const user_id = req.user.user_id;

  if (!pitch_id || !booking_date || !start_time || !duration_hours) {
    return res.status(400).json({ message: "กรุณาส่งข้อมูลครบทุก field" });
  } // 1. แปลง start_time (จาก "HH:MM") ให้เป็น "HH:MM:SS"

  const startTimeWithSeconds = start_time.includes(":")
    ? `${start_time.split(":")[0]}:${start_time.split(":")[1]}:00`
    : start_time; // 2. คำนวณ end_time ให้มีวินาที (HH:MM:SS)

  let [h, m] = startTimeWithSeconds.split(":").map(Number);
  let endH = h + Number(duration_hours);
  let endM = m;

  const end_h_str = endH >= 24 ? "00" : endH.toString().padStart(2, "0");
  const end_m_str = endM.toString().padStart(2, "0");
  const calculated_end_time = `${end_h_str}:${end_m_str}:00`;

  try {
    // 3. ⭐️ (แก้ไข) SQL Query ตรวจสอบ (แบบบรรทัดเดียว)
    const checkQuery =
      "SELECT * FROM bookings WHERE pitch_id = $1 AND booking_date = $2 AND status = 'confirmed' AND (start_time < $3 OR $3 = '00:00:00') AND (end_time > $4 OR end_time = '00:00:00')";

    const check = await pool.query(checkQuery, [
      pitch_id,
      booking_date,
      calculated_end_time,
      startTimeWithSeconds,
    ]);

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "สนามนี้ถูกจองแล้วในช่วงเวลานี้" });
    } // 4. ⭐️ (แก้ไข) SQL Query บันทึก (แบบบรรทัดเดียว)

    const insertQuery =
      "INSERT INTO bookings (user_id, pitch_id, booking_date, start_time, end_time, status) VALUES ($1,$2,$3,$4,$5,'confirmed') RETURNING *";

    const result = await pool.query(insertQuery, [
      user_id,
      pitch_id,
      booking_date,
      startTimeWithSeconds,
      calculated_end_time,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in /bookings:", err);
    res.status(500).send("Server error");
  }
};
// DELETE /bookings/:booking_id
exports.cancelBooking = async (req, res) => {
  const { booking_id } = req.params;
  const user_id = req.user.user_id; // ดึง user_id จาก middleware (auth) ที่คุณใช้อยู่

  if (!booking_id) {
    return res
      .status(400)
      .json({ message: "กรุณาระบุ booking_id ที่ต้องการยกเลิก" });
  }

  try {
    // อัปเดตสถานะการจองเป็น 'cancelled'
    // เราจะตรวจสอบด้วยว่า booking_id นี้ เป็นของ user_id ที่ส่งคำขอยกเลิกมาจริงหรือไม่
    const result = await pool.query(
      `UPDATE bookings 
             SET status = 'cancelled' 
             WHERE booking_id = $1 AND user_id = $2 
             RETURNING *`,
      [booking_id, user_id]
    );

    // ตรวจสอบว่ามีการอัปเดตแถวข้อมูลหรือไม่
    if (result.rows.length === 0) {
      // ถ้า .rows เป็น 0 อาจเพราะ:
      // 1. ไม่พบ booking_id นี้
      // 2. booking_id นี้เป็นของคนอื่น (user_id ไม่ตรงกัน)
      return res
        .status(404)
        .json({ message: "ไม่พบการจองที่ตรงกัน หรือคุณไม่มีสิทธิ์ยกเลิก" });
    }

    // ส่งข้อมูลการจองที่ถูกยกเลิกกลับไป
    res.json({ message: "ยกเลิกการจองสำเร็จ", booking: result.rows[0] });
  } catch (err) {
    console.error("Error in /cancelBooking:", err);
    res.status(500).send("Server error");
  }
};
