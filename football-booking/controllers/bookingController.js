// controllers/bookingController.js
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
        return res.status(400).json({ message: "กรุณาส่ง date เป็น query param เช่น 2025-10-23" });

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
};

// POST /bookings
exports.createBooking = async (req, res) => {
    const { pitch_id, booking_date, start_time, duration_hours } = req.body;
    const user_id = req.user.user_id;

    if (!pitch_id || !booking_date || !start_time || !duration_hours) {
        return res.status(400).json({ message: "กรุณาส่งข้อมูลครบทุก field" });
    }

    // แปลง duration เป็น end_time
    let [h, m] = start_time.split(":").map(Number);
    let endH = h + Number(duration_hours);
    let endM = m;

    const calculated_end_time =
        (endH >= 24 ? "00" : endH.toString().padStart(2, "0")) +
        ":" +
        endM.toString().padStart(2, "0");

    try {
        // ตรวจสอบว่าช่วงเวลานี้ซ้อนกับการจองเก่าหรือไม่
        const check = await pool.query(
            `SELECT * FROM bookings 
             WHERE pitch_id=$1 AND booking_date=$2
               AND start_time < $3 AND end_time > $4`,
            [pitch_id, booking_date, calculated_end_time, start_time]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ message: "สนามนี้ถูกจองแล้วในช่วงเวลานี้" });
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
};