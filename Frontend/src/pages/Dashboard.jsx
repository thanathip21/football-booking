import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { DatePicker } from '@mantine/dates';
import { Container, Title, Paper, Group, Button, Loader, Alert, Text } from '@mantine/core';
import 'dayjs/locale/th';

// 1. ⭐️ ฟังก์ชันแปลงวันที่ให้เป็น 'YYYY-MM-DD' โดยไม่สน Timezone
//    (แก้ปัญหาเลือกวันที่ 23 แล้วกลายเป็น 22)
const toYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(null); 
    const [pitchesData, setPitchesData] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            // 2. ⭐️ Logic การแปลงค่าวันที่ให้รองรับได้ทั้ง String และ Date Object
            let dateObj = null;
            if (selectedDate instanceof Date && !isNaN(selectedDate)) {
                dateObj = selectedDate;
            } else if (typeof selectedDate === 'string' && selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const parts = selectedDate.split('-');
                dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
            } else if (selectedDate && typeof selectedDate.toISOString === 'function') {
                dateObj = selectedDate;
            }

            // ถ้ามี Date Object ที่ถูกต้อง ถึงจะยิง API
            if (dateObj) {
                setLoading(true);
                setError('');
                setPitchesData([]); 
                
                const dateString = toYYYYMMDD(dateObj); 
                console.log("Fetching for date:", dateString);

                try {
                    // 3. ⭐️ URL ที่ถูกต้องสำหรับยิง API
                    const response = await api.get(`/pitches/available-slots?date=${dateString}`);
                    
                    console.log("API Response Data:", response.data);
                    setPitchesData(response.data); 
                } catch (err) {
                    console.error("--- DEBUG: API ERROR ---", err); 
                    setError('ไม่สามารถโหลดข้อมูลช่องว่างได้: ' + (err.response?.data?.message || err.message));
                }
                setLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [selectedDate]);

    // 4. ⭐️ ฟังก์ชันเมื่อกดปุ่มเลือกเวลา จะส่งข้อมูลไปหน้า /create-booking
    const handleBookingClick = (pitch, slot) => {
        let dateObj = null;
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            dateObj = selectedDate;
        } else if (typeof selectedDate === 'string' && selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const parts = selectedDate.split('-');
            dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        }

        if (dateObj) {
            navigate('/create-booking', { 
                state: {
                    pitch_id: pitch.pitch_id,
                    pitch_name: pitch.name,
                    date: toYYYYMMDD(dateObj),
                    start_time: slot.start_time
                } 
            });
        } else {
            console.error("Cannot book, selectedDate is not valid.");
        }
    };
    
    return (
        <Container>
            <Title order={2} ta="center" my="lg">เลือกสนามและวันที่ต้องการจอง</Title>
            
            <Paper shadow="md" p="md" withBorder>
                <Title order={4}>1. เลือกวันที่</Title>
                <DatePicker 
                    locale="th"
                    value={selectedDate} 
                    onChange={setSelectedDate}
                    minDate={new Date()}
                />
            </Paper>

            {loading && <Loader my="lg" />}
            {error && <Alert color="red" my="lg">{error}</Alert>}
            
            {/* 5. ⭐️ ส่วนแสดงผลข้อมูลสนามและเวลาที่ว่าง */}
            {selectedDate && !loading && pitchesData.length > 0 && (
                <Paper shadow="md" p="md" withBorder mt="xl">
                    <Title order={4}>2. เลือกช่องเวลาที่ว่าง</Title>
                    {pitchesData.map((pitch) => (
                        <div key={pitch.pitch_id} style={{ marginTop: '20px' }}>
                            <Title order={5}>{pitch.name}</Title>
                            {pitch.slots.length === 0 ? (
                                <Text c="dimmed">-- ไม่มีช่องว่างสำหรับสนามนี้ --</Text>
                            ) : (
                                <Group mt="sm">
                                    {pitch.slots.map((slot) => (
                                        <Button 
                                            key={slot.start_time}
                                            variant="outline"
                                            onClick={() => handleBookingClick(pitch, slot)}
                                        >
                                            {slot.start_time.substring(0, 5)}
                                        </Button>
                                    ))}
                                </Group>
                            )}
                        </div>
                    ))}
                </Paper>
            )}
        </Container>
    );
}

export default Dashboard;