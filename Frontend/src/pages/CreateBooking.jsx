// src/pages/CreateBooking.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Paper, Title, Text, NumberInput, Button, Alert } from '@mantine/core';

function CreateBooking() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. ⭐️ ดึงข้อมูลที่ส่งมาจากหน้า Dashboard
    const { pitch_id, pitch_name, date, start_time } = location.state || {};

    // 2. ⭐️ สร้าง state สำหรับเก็บ 'จำนวนชั่วโมง'
    const [duration, setDuration] = useState(1); // ค่าเริ่มต้นคือ 1 ชั่วโมง
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 3. ⭐️ ถ้าเข้าหน้านี้โดยตรง (ไม่มีข้อมูล) ให้เด้งกลับ
    if (!location.state) {
        return <Navigate to="/dashboard" replace />;
    }

    // 4. ⭐️ ฟังก์ชันเมื่อกดยืนยันการจอง
    const handleSubmitBooking = async () => {
        setLoading(true);
        setError('');

        try {
            // 5. ⭐️ สร้าง object ที่จะส่งไปหา Backend
            const bookingData = {
                pitch_id: pitch_id,
                booking_date: date,
                start_time: start_time,
                duration_hours: duration
            };

            // 6. ⭐️ ยิง API 'POST /bookings' (ต้องมี Route นี้ใน Backend)
            await api.post('/bookings', bookingData);
            
            // 7. ⭐️ ถ้าสำเร็จ, พาไปหน้า "การจองของฉัน"
            navigate('/my-bookings');

        } catch (err) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการจอง');
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title order={2} ta="center">ยืนยันการจอง</Title>

                <Text mt="md">สนาม:</Text>
                <Text fw={700} size="lg">{pitch_name} (ID: {pitch_id})</Text>

                <Text mt="md">วันที่:</Text>
                <Text fw={700} size="lg">{new Date(date).toLocaleDateString('th-TH')}</Text>

                <Text mt="md">เวลาเริ่มต้น:</Text>
                <Text fw={700} size="lg">{start_time.substring(0, 5)} น.</Text>

                <hr style={{ margin: '20px 0' }} />

                {/* 8. ⭐️ ช่องสำหรับเลือก 'จำนวนชั่วโมง' */}
                <NumberInput
                    label="เลือกจำนวนชั่วโมง"
                    value={duration}
                    onChange={setDuration}
                    min={1} // อย่างน้อย 1 ชั่วโมง
                    max={5} // สูงสุด 5 ชั่วโมง (ปรับได้ตามใจชอบ)
                    required
                />

                <Button 
                    fullWidth 
                    mt="xl" 
                    onClick={handleSubmitBooking}
                    loading={loading} // แสดง loading spinner
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