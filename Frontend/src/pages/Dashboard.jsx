import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { DatePicker } from "@mantine/dates";
import {
  Button,
  Loader,
  Alert,
  Text,
  Title,
  Group,
  Paper,
} from "@mantine/core";
import "dayjs/locale/th";

const toYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [pitchesData, setPitchesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      let dateObj = null;
      if (selectedDate instanceof Date && !isNaN(selectedDate))
        dateObj = selectedDate;
      else if (
        typeof selectedDate === "string" &&
        selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        const parts = selectedDate.split("-");
        dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      } else if (
        selectedDate &&
        typeof selectedDate.toISOString === "function"
      )
        dateObj = selectedDate;

      if (dateObj) {
        setLoading(true);
        setError("");
        setPitchesData([]);
        try {
          const dateString = toYYYYMMDD(dateObj);
          const response = await api.get(
            `/pitches/available-slots?date=${dateString}`
          );
          setPitchesData(response.data);
        } catch (err) {
          setError(
            "ไม่สามารถโหลดข้อมูลช่องว่างได้: " +
              (err.response?.data?.message || err.message)
          );
        }
        setLoading(false);
      }
    };
    fetchAvailableSlots();
  }, [selectedDate]);

  const handleBookingClick = (pitch, slot) => {
    let dateObj = null;
    if (selectedDate instanceof Date && !isNaN(selectedDate))
      dateObj = selectedDate;
    else if (
      typeof selectedDate === "string" &&
      selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      const parts = selectedDate.split("-");
      dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    }
    if (dateObj) {
      navigate("/create-booking", {
        state: {
          pitch_id: pitch.pitch_id,
          pitch_name: pitch.name,
          date: toYYYYMMDD(dateObj),
          start_time: slot.start_time,
          all_available_slots: pitch.slots,
        },
      });
    }
  };

  return (
    <div className="dashboard-bg">
      <style>{`
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  width: 100%;
  font-family: 'Prompt', sans-serif;
  background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
}

.dashboard-bg {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px;
}

.dashboard-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.dashboard-title {
  color: #00fff7;
  font-weight: 900;
  font-size: 3rem;
  text-align: center;
  text-shadow: 0 0 10px #00fff7, 0 0 20px #00bfff;
  letter-spacing: 1px;
  animation: glow 1.8s infinite alternate;
}
@keyframes glow {
  0% { text-shadow: 0 0 10px #00fff7, 0 0 20px #00bfff; }
  100% { text-shadow: 0 0 25px #00fff7, 0 0 50px #00bfff; }
}

.glass-card {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(25px);
  border-radius: 25px;
  padding: 35px;
  margin-left: 100px;
  margin-right: 100px;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}
.glass-card:hover {
  transform: scale(1.03);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.6);
}

.section-title {
  color: #00fff7;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 20px;
  margin-left: 180px;
  text-shadow: 0 0 10px rgba(0,255,255,0.6);
}

/* ✅ ปรับปฏิทิน DatePicker ให้ดูเด่น */
.custom-datepicker {
  background: rgba(255, 255, 255, 1);
  border-radius: 20px;
  padding: 18px;
  margin-left: 150px;
  margin-right: 120px;
  border: 1px solid rgba(0,255,255,0.4);
  box-shadow: 0 0 15px rgba(0,255,255,0.3);
}
.custom-datepicker:hover {
  transform: scale(1.03);
  box-shadow: 0 0 35px rgba(0,255,255,0.8);
}

/* หัวเดือน */
.mantine-DatePicker-calendarHeader {
  justify-content: center;
}

.mantine-DatePicker-calendarHeaderLevel {
  color: #000000ff;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(0,255,255,0.6);
}

/* ลูกศรเปลี่ยนเดือน */
.calendar-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,#00fff7,#00d4ff);
  color: #000;
  font-weight: bold;
  font-size: 20px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  box-shadow: 0 0 15px rgba(0,255,255,0.6);
  transition: all 0.3s ease;
  cursor: pointer;
}
.calendar-arrow:hover {
  background: linear-gradient(135deg,#ff00e0,#00fff7);
  transform: scale(1.15) rotate(15deg);
  box-shadow: 0 0 35px rgba(255,0,200,0.8);
  color: white;
}

/* ปรับสีวันต่างๆ */
.mantine-DatePicker-day {
  border-radius: 50% !important;
  font-weight: 600;
  color: #000000ff;
  transition: all 0.2s ease;
}

.mantine-DatePicker-day:hover {
  background: linear-gradient(135deg,#00fff7,#00d4ff) !important;
  color: #000 !important;
  transform: scale(1.15);
  box-shadow: 0 0 15px rgba(0,255,255,0.6);
}

/* วันเสาร์เป็นฟ้า วันอาทิตย์เป็นชมพู */
.mantine-DatePicker-day[data-day-of-week="6"] {
  color: #00d4ff !important;
}
.mantine-DatePicker-day[data-day-of-week="0"] {
  color: #ff6bc6 !important;
}

/* วันถูกเลือก */
.mantine-DatePicker-day[data-selected] {
  background: linear-gradient(135deg,#ff00e0,#00fff7) !important;
  color: #fff !important;
  box-shadow: 0 0 25px rgba(255,0,200,0.8);
}

/* กล่องสนามและปุ่มเวลา */
.pitch-card {
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.time-button {
  background: linear-gradient(135deg,#00fff7,#00d4ff);
  color: #000;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  padding: 10px 22px;
  transition: all 0.25s ease;
}
.time-button:hover {
  background: linear-gradient(135deg,#ff00e0,#00fff7);
  transform: scale(1.15);
  box-shadow: 0 0 25px rgba(0,255,200,0.8);
  color: #fff;
}

/* สกอลล์รายการสนาม */
.pitches-scroll {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 5px;
}
.pitches-scroll::-webkit-scrollbar {
  width: 8px;
}
.pitches-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,255,255,0.5);
  border-radius: 4px;
}
`}</style>


      <div className="dashboard-container">
        <Title order={1} className="dashboard-title">
          ⚽ ระบบจองสนามฟุตบอล ⚽
        </Title>

        <Paper shadow="xl" p="xl" withBorder className="glass-card">
          <Title order={3} className="section-title">
            📅 เลือกวันที่
          </Title>

          <DatePicker
            locale="th"
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={new Date()}
            className="custom-datepicker"
            nextIcon={
              <div className="calendar-arrow right">
                <span>›</span>
              </div>
            }
            previousIcon={
              <div className="calendar-arrow left">
                <span>‹</span>
              </div>
            }
            
          />
        </Paper>

        {loading && <Loader my="xl" size="xl" variant="dots" />}
        {error && <Alert color="red" my="xl">{error}</Alert>}

        {selectedDate && !loading && (
          <Paper shadow="xl" p="xl" withBorder mt="xl" className="glass-card pitches-wrapper">
            <Title order={3} className="section-title">🕒 เลือกสนามและช่วงเวลา</Title>
            <div className="pitches-scroll">
              {pitchesData.length === 0 && (
                <Text c="gray.4">⚠️ ไม่มีสนามว่างสำหรับวันที่เลือก</Text>
              )}
              {pitchesData.map((pitch) => (
                <div key={pitch.pitch_id} className="pitch-card">
                  <Title order={4}>{pitch.name}</Title>
                  {pitch.slots.length === 0 ? (
                    <Text c="gray.4">-- สนามนี้เต็มแล้ว --</Text>
                  ) : (
                    <Group mt="sm" spacing="sm">
                      {pitch.slots.map((slot) => (
                        <Button
                          key={slot.start_time}
                          className="time-button"
                          onClick={() => handleBookingClick(pitch, slot)}
                        >
                          {slot.start_time.substring(0, 5)}
                        </Button>
                      ))}
                    </Group>
                  )}
                </div>
              ))}
            </div>
          </Paper>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
