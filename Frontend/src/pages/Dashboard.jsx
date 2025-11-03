import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { DatePicker } from "@mantine/dates";
import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  Loader,
  Alert,
  Text,
  Center,
  Box,
} from "@mantine/core";
import "dayjs/locale/th";

// Constants for time slot generation
const START_HOUR = 12; // 12:00 PM
const END_HOUR = 23; // 11:00 PM (Last bookable slot)
const TIME_SLOTS = [];

// Generate 12:00, 13:00, ..., 23:00, 00:00
for (let h = START_HOUR; h <= END_HOUR; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
}
TIME_SLOTS.push("00:00"); // 24:00 (Midnight)

// Convert Date to YYYY-MM-DD (No Timezone)
const toYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null); // 🌟 1. เปลี่ยนเป็น null เพื่อไม่ให้โหลดอัตโนมัติ
  const [pitchesData, setPitchesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDataInitialized, setIsDataInitialized] = useState(false); // 🌟 2. NEW: สถานะควบคุมการแสดงตาราง
  const navigate = useNavigate();

  // Custom Hook to ensure valid Date Object is used
  const validDate = useMemo(() => {
    return selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : null;
  }, [selectedDate]);

  // Map pitch ID to Name for display (assuming standard pitch IDs)
  const PITCH_MAP = useMemo(() => {
    return pitchesData.reduce((map, pitch) => {
      map[pitch.pitch_id] = pitch.name;
      return map;
    }, {});
  }, [pitchesData]);
  
  // 🌟 Logic: จัดเรียงข้อมูลช่องว่างให้อยู่ในโครงสร้าง Map เพื่อให้ค้นหาเร็วขึ้น
  const availableSlotsMap = useMemo(() => {
    return pitchesData.reduce((acc, pitch) => {
      // สร้าง Set ของ 'HH:MM:SS' ที่ว่างสำหรับแต่ละสนาม
      const availableTimes = new Set(
        pitch.slots.map((slot) => slot.start_time)
      );
      acc[pitch.pitch_id] = availableTimes;
      return acc;
    }, {});
  }, [pitchesData]);

  // -----------------------------------------------------
  // API Fetch Logic (ถูกเรียกโดยปุ่ม Search เท่านั้น)
  // -----------------------------------------------------
  // 🌟 3. fetchAvailableSlots ไม่ใช่ useCallback อีกต่อไป และรับ Date Object
  const fetchAvailableSlots = async (dateToFetch) => {
    setLoading(true);
    setError("");
    
    const dateString = toYYYYMMDD(dateToFetch);
    
    try {
      const response = await api.get(
        `/pitches/available-slots?date=${dateString}`
      );

      setPitchesData(response.data);
    } catch (err) {
      setError(
        "ไม่สามารถโหลดข้อมูลช่องว่างได้: " +
          (err.response?.data?.message || "กรุณาตรวจสอบเซิร์ฟเวอร์")
      );
      setPitchesData([]); // เคลียร์ข้อมูลหากเกิดข้อผิดพลาด
    } finally {
      setLoading(false);
      setIsDataInitialized(true); // 🌟 4. เมื่อโหลดเสร็จแล้วอนุญาตให้แสดงตาราง
    }
  };

  // 🌟 5. ลบ useEffect ที่ทำให้เกิดการยิง API อัตโนมัติออก
  useEffect(() => {
    // กำหนด Default Date เป็นวันนี้เมื่อเปิดหน้าครั้งแรก (แต่ไม่ยิง API)
    if (selectedDate === null) {
        setSelectedDate(new Date());
    }
  }, []); 


  // 🌟 6. NEW: Handler สำหรับปุ่ม Search
  const handleSearchClick = () => {
    if (validDate) {
        fetchAvailableSlots(validDate);
    } else {
        setError("กรุณาเลือกวันที่ก่อนกดค้นหา");
        setIsDataInitialized(false);
    }
  }


  // -----------------------------------------------------
  // Booking Handler (remains the same)
  // -----------------------------------------------------
  const handleBookingClick = (pitchId, startTime) => {
    if (!validDate) {
      setError("กรุณาเลือกวันที่ที่ถูกต้องก่อนดำเนินการจอง");
      return;
    }
    
    // ค้นหาข้อมูลสนามทั้งหมดเพื่อส่งไปหน้า CreateBooking
    const pitch = pitchesData.find(p => p.pitch_id === pitchId);
    
    if (pitch) {
        navigate("/create-booking", {
            state: {
                pitch_id: pitchId,
                pitch_name: pitch.name,
                date: toYYYYMMDD(validDate),
                start_time: startTime, // 'HH:MM:SS'
                // ส่ง Array ของช่องว่างทั้งหมดของสนามนั้นๆ ไป
                all_available_slots: pitch.slots, 
            },
        });
    }
  };


  // -----------------------------------------------------
  // Component Rendering
  // -----------------------------------------------------
  
  // Custom Cell Component for Schedule (remains the same)
  const TimeSlotCell = ({ pitchId, time }) => {
    const isAvailable = availableSlotsMap[pitchId]?.has(time);
    
    // '00:00:00' should not be bookable (it's the start of next day)
    if (time === "00:00") {
        return <div className="time-slot midnight-slot" />;
    }

    // Determine the next hour (e.g., 14:00:00 for 13:00:00 slot)
    const nextHour = String(Number(time.substring(0, 2)) + 1).padStart(2, "0") + ":00";

    const statusClass = isAvailable ? "available" : "booked";
    const action = isAvailable ? () => handleBookingClick(pitchId, time) : null;
    
    // Only available slots are clickable
    return (
      <div 
        className={`time-slot ${statusClass}`}
        onClick={action}
        title={isAvailable ? `จอง ${time} - ${nextHour.substring(0, 5)}` : "ไม่ว่าง"}
      >
        {isAvailable ? "" : "X"}
      </div>
    );
  };
  
  // Get unique pitch IDs from fetched data to build columns
  const pitchIds = pitchesData.map(p => p.pitch_id);


  return (
    <Container size="xl" px="xs">
      <Title order={1} ta="center" my="lg" color="#16a34a">
        ตารางเวลาสนามฟุตบอล
      </Title>

      <Paper shadow="xl" p="md" withBorder style={{ backgroundColor: "#f0fff0", marginBottom: '20px' }}>
        <Title order={4} color="#15803d">ค้นหาวันที่ว่าง</Title>
        <Group mt="sm">
            <DatePicker
              locale="th"
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              placeholder="เลือกวันที่"
              clearable={false}
            />
            {/* 🌟 7. ปุ่ม Search ถูกผูกกับ handleSearchClick */}
            <Button 
                onClick={handleSearchClick}
                style={{ backgroundColor: "#16a34a" }}
                disabled={!validDate || loading}
            >
                Search
            </Button>
        </Group>
      </Paper>
      
      {loading && <Center py="xl"><Loader size="lg" /></Center>}
      {error && <Alert color="red" my="lg">{error}</Alert>}
      
      {/* 🌟 8. CONDITION: แสดงตารางเมื่อ isDataInitialized เป็น true และมีข้อมูล */}
      {!loading && !error && isDataInitialized && pitchesData.length > 0 && (
        <Paper shadow="xl" p="xs" withBorder style={{ overflowX: "auto" }}>
          <div className="schedule-grid">
            {/* Header Row (Time Slots) */}
            <div className="header-cell sticky-header">เวลา / สนาม</div> 
            {TIME_SLOTS.map((time) => (
              <div key={time} className="header-cell time-label">
                {time.substring(0, 5)}
              </div>
            ))}
            
            {/* Body Rows (Pitches) */}
            {pitchIds.map((pitchId) => (
              <React.Fragment key={pitchId}>
                {/* Pitch Name Header (Sticky First Column) */}
                <div className="pitch-cell sticky-pitch-name">
                  <Text fw={700} color="#15803d">{PITCH_MAP[pitchId]}</Text>
                </div>
                
                {/* Time Slot Cells */}
                {TIME_SLOTS.map((time) => (
                  <TimeSlotCell
                    key={time}
                    pitchId={pitchId}
                    time={time}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </Paper>
      )}
      
      {/* 🌟 9. CONDITION: แสดงข้อความเมื่อค้นหาแล้วแต่ไม่พบข้อมูล */}
      {!loading && !error && isDataInitialized && pitchesData.length === 0 && (
         <Alert color="yellow" title="ไม่มีข้อมูล" mt="lg" ta="center">
            ไม่พบสนามว่างสำหรับวันที่ {toYYYYMMDD(validDate)}
         </Alert>
      )}

      {/* 🌟 10. NEW: ข้อความเริ่มต้นก่อนการค้นหาครั้งแรก */}
      {!loading && !error && !isDataInitialized && (
          <Center py="xl">
             <Text size="lg" c="dimmed">กรุณาเลือกวันและกด "Search" เพื่อดูตารางเวลา</Text>
          </Center>
      )}


      {/* ----------------------------------------------------- */}
      {/* 🌟 Inline Styles (CSS) for the Grid View (remains the same) */}
      {/* ----------------------------------------------------- */}
      <style>{`
        .schedule-grid {
          display: grid;
          /* 1 column for Pitch Name + N columns for Time Slots */
          grid-template-columns: 100px repeat(${TIME_SLOTS.length}, 60px); 
          border: 1px solid #ccc;
          border-collapse: collapse;
          width: fit-content;
        }

        .header-cell, .pitch-cell, .time-slot {
          border: 1px solid #eee;
          padding: 8px 4px;
          text-align: center;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          white-space: nowrap;
        }

        .header-cell {
          background-color: #e0f2f1; /* Light cyan header */
          font-weight: 600;
          color: #004d40;
        }

        .time-label {
          writing-mode: horizontal-tb; /* Normal writing */
          font-size: 11px;
        }
        
        /* Pitch Name Column */
        .pitch-cell {
            background-color: #c8e6c9; /* Light green for pitch names */
            font-weight: 700;
            color: #1b5e20;
        }

        .time-slot {
          cursor: default;
          transition: background-color 0.1s ease;
          border-left: none;
        }

        /* Available Slot Style (Green/Grass look) */
        .available {
          background-color: #a5d6a7; /* Light grass green */
          cursor: pointer;
        }
        .available:hover {
          background-color: #66bb6a; /* Darker green on hover */
          transform: scale(1.05);
          z-index: 10;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        /* Booked Slot Style (Red/Unavailable) */
        .booked {
          background-color: #ffcdd2; /* Light red/pink */
          color: #d32f2f;
          font-weight: 700;
          cursor: not-allowed;
        }
        
        /* Midnight Slot (Unbookable, for visual queue) */
        .midnight-slot {
            background-color: #e0e0e0; 
            cursor: not-allowed;
            color: #757575;
        }
        
        /* Sticky Header/Column for better UX on scroll */
        .sticky-header {
            position: sticky;
            left: 0;
            z-index: 20;
        }
        .sticky-pitch-name {
            position: sticky;
            left: 0;
            z-index: 10;
        }
      `}</style>
    </Container>
  );
}

export default Dashboard;
