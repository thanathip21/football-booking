import React, { useState, useEffect } from "react";
import api from "../api";
import {
  Container,
  Title,
  Paper,
  Text,
  Loader,
  Alert,
  Button,
  Modal,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/my-bookings");
      setBookings(response.data);
    } catch (err) {
      setError(
        "ไม่สามารถโหลดข้อมูลการจองได้: " +
          (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setCancelError("");
    open();
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setCancelLoading(true);
    setCancelError("");

    try {
      await api.delete(`/bookings/${selectedBooking.booking_id}`);
      setCancelLoading(false);
      close();
      setBookings((currentBookings) =>
        currentBookings.filter(
          (b) => b.booking_id !== selectedBooking.booking_id
        )
      );
    } catch (err) {
      setCancelError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการยกเลิก"
      );
      setCancelLoading(false);
    }
  };

  return (
    <Container>
      <Title order={2} ta="center" my="lg">
        การจองของฉัน
      </Title>
      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}
      {!loading && !error && (
        <div>
          {bookings.length === 0 ? (
            <Text ta="center">คุณยังไม่มีรายการจอง</Text>
          ) : (
            bookings.map((booking) => (
              <Paper
                key={booking.booking_id}
                shadow="md"
                p="md"
                withBorder
                mt="md"
                onClick={() => handleOpenModal(booking)}
                style={{ cursor: "pointer" }}
              >
                <Text fw={500}>{booking.pitch_name}</Text>
                <Text>
                  วันที่ :{" "}
                  {new Date(booking.booking_date).toLocaleDateString("th-TH")} 
                </Text>
                <Text>
                  {" "}
                  เวลา : {booking.start_time.substring(0, 5)} -{" "}
                  {booking.end_time.substring(0, 5)}
                </Text>
              </Paper>
            ))
          )}
        </div>
      )}
      {/* Modal ที่จะเด้งขึ้นมา */}
      <Modal opened={opened} onClose={close} title="รายละเอียดการจอง">
        {selectedBooking && (
          <div>
            <Text fw={500} size="lg">
              {selectedBooking.pitch_name}
            </Text>

            <Text mt="sm">
              วันที่ :{" "}
              {new Date(selectedBooking.booking_date).toLocaleDateString(
                "th-TH"
              )}
            </Text>

            <Text>
              เวลา: {selectedBooking.start_time.substring(0, 5)} -{" "}
              {selectedBooking.end_time.substring(0, 5)}
            </Text>

            {cancelError && (
              <Alert color="red" title="เกิดข้อผิดพลาด" mt="md">
                {cancelError}
              </Alert>
            )}

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={close}>
                ปิด
              </Button>
              <Button
                color="red"
                onClick={handleCancelBooking}
                loading={cancelLoading}
                S
              >
                ยืนยันการยกเลิก
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </Container>
  );
}

export default MyBookings;
