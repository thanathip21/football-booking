import { useState, useEffect } from "react";
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
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}
.glass-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.6);
}

.section-title {
  color: #00fff7;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0,255,255,0.6);
}

.booking-card {
  margin-top: 15px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.booking-card:hover {
  background: rgba(255,255,255,0.1);
  transform: translateX(10px);
  box-shadow: 0 0 25px rgba(0,255,255,0.4);
  border-color: rgba(0,255,255,0.5);
}

.booking-card-text {
  color: #ffffff;
  font-size: 1rem;
  margin: 5px 0;
}

.booking-card-title {
  color: #00fff7;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.bookings-scroll {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 5px;
}
.bookings-scroll::-webkit-scrollbar {
  width: 8px;
}
.bookings-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,255,255,0.5);
  border-radius: 4px;
}

.cancel-button {
  background: linear-gradient(135deg,#ff0066,#ff4d4d);
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  padding: 10px 22px;
  transition: all 0.25s ease;
}
.cancel-button:hover {
  background: linear-gradient(135deg,#ff4d4d,#ff0066);
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255,0,100,0.8);
}

.close-button {
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 10px 22px;
  transition: all 0.25s ease;
}
.close-button:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.05);
}

.no-bookings-text {
  color: #00fff7;
  font-size: 1.2rem;
  text-align: center;
  padding: 40px;
  text-shadow: 0 0 10px rgba(0,255,255,0.6);
}

.modal-content {
  background: linear-gradient(135deg,#0f2027,#203a43);
  border-radius: 20px;
  padding: 20px;
}

.modal-text {
  color: #ffffff;
  font-size: 1rem;
  margin: 10px 0;
}

.modal-title {
  color: #00fff7;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0,255,255,0.6);
}
`}</style>

      <div className="dashboard-container">
        <Title order={1} className="dashboard-title">
          📋 การจองของฉัน 📋
        </Title>

        <Paper shadow="xl" p="xl" withBorder className="glass-card">
          {loading && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Loader size="xl" variant="dots" color="cyan" />
            </div>
          )}

          {error && (
            <Alert color="red" radius="md" style={{ marginTop: "20px" }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <div>
              <Title order={3} className="section-title">
                🎫 รายการจองทั้งหมด
              </Title>

              {bookings.length === 0 ? (
                <Text className="no-bookings-text">
                  ⚠️ คุณยังไม่มีรายการจอง
                </Text>
              ) : (
                <div className="bookings-scroll">
                  {bookings.map((booking) => (
                    <div
                      key={booking.booking_id}
                      className="booking-card"
                      onClick={() => handleOpenModal(booking)}
                    >
                      <Text className="booking-card-title">
                        ⚽ {booking.pitch_name}
                      </Text>
                      <Text className="booking-card-text">
                        📅 วันที่:{" "}
                        {new Date(booking.booking_date).toLocaleDateString(
                          "th-TH"
                        )}
                      </Text>
                      <Text className="booking-card-text">
                        🕒 เวลา: {booking.start_time.substring(0, 5)} -{" "}
                        {booking.end_time.substring(0, 5)}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Paper>
      </div>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={<span className="modal-title">รายละเอียดการจอง</span>}
        size="lg"
        styles={{
          content: {
            background: "linear-gradient(135deg,#0f2027,#203a43)",
          },
          header: {
            background: "linear-gradient(135deg,#0f2027,#203a43)",
            borderBottom: "1px solid rgba(0,255,255,0.3)",
          },
          close: {
            color: "#00fff7",
            "&:hover": {
              background: "rgba(0,255,255,0.2)",
            },
          },
        }}
      >
        {selectedBooking && (
          <div style={{ padding: "10px" }}>
            <Text className="modal-title" style={{ marginBottom: "20px" }}>
              ⚽ {selectedBooking.pitch_name}
            </Text>

            <Text className="modal-text">
              📅 วันที่:{" "}
              {new Date(selectedBooking.booking_date).toLocaleDateString(
                "th-TH"
              )}
            </Text>

            <Text className="modal-text">
              🕒 เวลา: {selectedBooking.start_time.substring(0, 5)} -{" "}
              {selectedBooking.end_time.substring(0, 5)}
            </Text>

            {cancelError && (
              <Alert color="red" title="เกิดข้อผิดพลาด" mt="md" radius="md">
                {cancelError}
              </Alert>
            )}

            <Group justify="flex-end" mt="xl" gap="md">
              <Button className="close-button" onClick={close}>
                ปิด
              </Button>
              <Button
                className="cancel-button"
                onClick={handleCancelBooking}
                loading={cancelLoading}
              >
                ยืนยันการยกเลิก
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MyBookings;
