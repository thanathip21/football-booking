// src/pages/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Title, Paper, Text, Loader, Alert } from '@mantine/core';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                // 1. ยิง API (ที่มี Token) ไปเอาการจองของเรา
                const response = await api.get('/my-bookings');
                setBookings(response.data); // Backend คืนค่า Array
            } catch (err) {
                setError('ไม่สามารถโหลดข้อมูลการจองได้: ' + (err.response?.data?.message || err.message));
            }
            setLoading(false);
        };

        fetchMyBookings();
    }, []); // ทำงานแค่ครั้งเดียวตอนเปิดหน้า

    return (
        <Container>
            <Title order={2} ta="center" my="lg">การจองของฉัน</Title>

            {loading && <Loader />}
            {error && <Alert color="red">{error}</Alert>}
            
            {!loading && !error && (
                <div>
                    {bookings.length === 0 ? (
                        <Text ta="center">คุณยังไม่มีรายการจอง</Text>
                    ) : (
                        // 2. วนลูปแสดงผลการจอง
                        bookings.map((booking) => (
                            <Paper key={booking.booking_id} shadow="md" p="md" withBorder mt="md">
                                <Text fw={500}>สนาม ID: {booking.pitch_id}</Text>
                                <Text>วันที่: {new Date(booking.booking_date).toLocaleDateString('th-TH')}</Text>
                                <Text>เวลา: {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}</Text>
                                <Text>สถานะ: {booking.status}</Text>
                            </Paper>
                        ))
                    )}
                </div>
            )}
        </Container>
    );
}

export default MyBookings;