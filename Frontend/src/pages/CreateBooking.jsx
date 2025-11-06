import React, { useState, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
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

  const { pitch_id, pitch_name, date, start_time, all_available_slots } =
    location.state || {};

  const [duration, setDuration] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const durationOptions = useMemo(() => {
    if (!start_time || !all_available_slots) return [];
    const h = (t) => Number(t.split(":")[0]);
    const startTimeHour = h(start_time);
    const availableHours = new Set(all_available_slots.map((slot) => h(slot.start_time)));
    const options = [];
    for (let i = 1; startTimeHour + i <= 24; i++) {
      const currentSlotHour = startTimeHour + (i - 1);
      if (availableHours.has(currentSlotHour)) {
        const endHour = startTimeHour + i;
        const endHourString = (endHour >= 24 ? "00" : String(endHour).padStart(2, "0")) + ":00";
        options.push({ value: String(i), label: `${i} ชั่วโมง (สิ้นสุด ${endHourString})` });
      } else {
        break;
      }
    }
    return options;
  }, [start_time, all_available_slots]);

  const handleSubmitBooking = async () => {
    setLoading(true);
    setError("");
    try {
      const bookingData = { pitch_id, booking_date: date, start_time, duration_hours: Number(duration) };
      await api.post("/bookings", bookingData);
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการจอง");
      setLoading(false);
    }
  };

  if (!location.state) return <Navigate to="/dashboard" replace />;

  return (
    <div className="booking-bg">
      <style>{`
        .booking-bg{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:flex-start;
          padding:40px 20px;
          background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
        }
        .glass-card{
          background: rgba(255,255,255,0.06);
          backdrop-filter:blur(20px);
          border-radius:25px;
          padding:35px;
          box-shadow:0 15px 60px rgba(0,0,0,0.5);
          border:1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .glass-card:hover{
          transform:scale(1.02);
          box-shadow:0 20px 70px rgba(0,0,0,0.6);
        }
        .section-title{
          color:#00fff7;
          font-size:1.5rem;
          font-weight:700;
          margin-bottom:15px;
          text-align:center;
          text-shadow:0 0 10px #00fff7,0 0 20px #00bfff;
        }
        .info-label{
          color:#00fff7;
          font-weight:600;
          margin-top:15px;
        }
        .info-value{
          font-weight:700;
          color:#fff;
          font-size:1.1rem;
        }
        .mantine-Select-root .mantine-Input-input{
          background: rgba(255,255,255,0.15);
          color:#00fff7;
          border:1px solid rgba(0,255,255,0.4);
          border-radius:12px;
          padding:10px;
          box-shadow:0 0 15px rgba(0,255,255,0.2);
        }
        .mantine-Select-root .mantine-Input-input:focus{
          box-shadow:0 0 25px #00fff7;
        }
        .neon-button{
          background: linear-gradient(135deg,#00fff7,#00d4ff);
          color:#000;
          font-weight:700;
          border-radius:12px;
          border:none;
          padding:12px 0;
          font-size:1.1rem;
          transition: all 0.3s;
          text-shadow:0 0 5px #00fff7;
        }
        .neon-button:hover{
          background: linear-gradient(135deg,#ff00e0,#00fff7);
          color:#fff;
          box-shadow:0 0 25px rgba(0,255,200,0.8);
          transform:scale(1.05);
        }
        .error-alert{
          margin-top:20px;
        }
      `}</style>

      <Container size={420}>
        <Paper withBorder shadow="md" className="glass-card">
          <Title order={2} className="section-title">ยืนยันการจอง</Title>

          <Text className="info-label">สนาม:</Text>
          <Text className="info-value">{pitch_name}</Text>

          <Text className="info-label">วันที่:</Text>
          <Text className="info-value">{new Date(date).toLocaleDateString("th-TH")}</Text>

          <Text className="info-label">เวลาเริ่มต้น:</Text>
          <Text className="info-value">{start_time.substring(0,5)} น.</Text>

          <hr style={{ margin: "25px 0", borderColor:"rgba(0,255,255,0.3)" }} />

          <Select
            label="เลือกจำนวนชั่วโมง"
            data={durationOptions}
            value={duration}
            onChange={setDuration}
            required
          />

          <Button fullWidth mt="xl" className="neon-button" onClick={handleSubmitBooking} loading={loading}>
            ยืนยันการจอง
          </Button>

          {error && (
            <Alert color="red" title="เกิดข้อผิดพลาด" className="error-alert">
              {error}
            </Alert>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default CreateBooking;
