import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Container,
  Paper,
  Title,
  Text,
  Select,
  Button,
  Alert,
} from "@mantine/core";

function CreateBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. ⭐️ (อัปเกรด) รับ 'all_available_slots' มาจาก Dashboard
  const { pitch_id, pitch_name, date, start_time, all_available_slots } =
    location.state || {};

  const [duration, setDuration] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. ⭐️ (อัปเกรด) Logic ใหม่สำหรับสร้างตัวเลือก (options)
  const durationOptions = useMemo(() => {
    if (!start_time || !all_available_slots) return [];

    // ฟังก์ชันช่วยแปลง "19:00:00" เป็น 19
    const h = (t) => Number(t.split(":")[0]);
    const startTimeHour = h(start_time); // เช่น 19

    // สร้าง Set ของ "ชั่วโมงที่ว่าง" เพื่อให้ค้นหาได้เร็ว
    // เช่น all_available_slots = ["19:00:00", "22:00:00"]
    // จะได้ availableHours = Set { 19, 22 }
    const availableHours = new Set(
      all_available_slots.map((slot) => h(slot.start_time))
    );

    const options = [];

    // วนลูปเช็ก "ชั่วโมงถัดๆ ไป"
    for (let i = 1; startTimeHour + i <= 24; i++) {
      // ชั่วโมงที่เรากำลังจะจอง (เช่น 19, 20, 21...)
      const currentSlotHour = startTimeHour + (i - 1);

      // 3. ⭐️ (Logic) เช็กว่าชั่วโมงนี้ "ว่าง" หรือไม่
      if (availableHours.has(currentSlotHour)) {
        const endHour = startTimeHour + i;
        const endHourString =
          (endHour >= 24 ? "00" : String(endHour).padStart(2, "0")) + ":00";

        options.push({
          value: String(i),
          label: `${i} ชั่วโมง (สิ้นสุด ${endHourString})`,
        });
      } else {
        break;
      }
    }
    return options;
  }, [start_time, all_available_slots]); // คำนวณใหม่เมื่อค่านี้เปลี่ยน

  const handleSubmitBooking = async () => {
    setLoading(true);
    setError("");
    try {
      const bookingData = {
        pitch_id: pitch_id,
        booking_date: date,
        start_time: start_time,
        duration_hours: Number(duration),
      };
      await api.post("/bookings", bookingData);
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการจอง");
      setLoading(false);
    }
  };

  if (!location.state) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} ta="center">
          ยืนยันการจอง
        </Title>

        <Text mt="md">สนาม:</Text>
        <Text fw={700} size="lg">
          {pitch_name}{" "}
        </Text>
        <Text mt="md">วันที่:</Text>
        <Text fw={700} size="lg">
          {new Date(date).toLocaleDateString("th-TH")}
        </Text>
        <Text mt="md">เวลาเริ่มต้น:</Text>
        <Text fw={700} size="lg">
          {start_time.substring(0, 5)} น.
        </Text>

        <hr style={{ margin: "20px 0" }} />

        <Select
          label="เลือกจำนวนชั่วโมง"
          data={durationOptions} // 4. ⭐️ ใช้ options ที่ "ฉลาด" แล้ว
          value={duration}
          onChange={setDuration}
          required
        />

        <Button
          fullWidth
          mt="xl"
          onClick={handleSubmitBooking}
          loading={loading}
        >
          ยืนยันการจอง
        </Button>

        {error && (
          <Alert color="red" title="เกิดข้อผิดพลาด" mt="md">
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default CreateBooking;
