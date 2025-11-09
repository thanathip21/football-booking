import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Text,
  Group,
} from "@mantine/core";
import Logo from "../assets/Logo.png";
import BackgroundVideo from "../assets/background2.mp4";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🌟 เพิ่ม Loading State
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 1);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 🌟 2. เพิ่มแท็ก <video> เป็นพื้นหลัง */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", // ทำให้วิดีโอครอบคลุมพื้นที่ทั้งหมด
          zIndex: -1, // ให้อยู่เบื้องหลังเนื้อหาอื่นๆ
        }}
      >
        <source src={BackgroundVideo} type="video/mp4" />
      </video>
      <Container size={420}>
        <Paper shadow="lg" p={50} radius="lg" withBorder>
          <Group justify="center" mb="md" style={{ width: "100%" }}>
            <img
              src={Logo}
              alt="Your Company Logo"
              style={{ width: "100px", height: "auto", display: "block" }} // 👈 เพิ่ม display: 'block' เพื่อความมั่นใจ
            />
          </Group>
          <Title order={2} ta="center" color="green.7">
            สมัครสมาชิก
          </Title>

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username"
              name="username"
              onChange={handleChange}
              required
              mt="sm"
            />
            <PasswordInput
              label="Password"
              name="password"
              onChange={handleChange}
              required
              mt="md"
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              required
              mt="md"
            />
            <TextInput
              label="Full Name"
              name="full_name"
              onChange={handleChange}
              mt="md"
            />
            <TextInput
              label="Phone"
              name="phone"
              onChange={handleChange}
              mt="md"
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={loading} // 🌟 ใช้ Loading State
              style={{
                backgroundColor: "#59c2ffff",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#45b8fbff")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#59c2ffff")
              }
            >
              สมัครสมาชิก
            </Button>
          </form>

          <Text ta="center" mt="md">
            มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
          </Text>

          {error && (
            <Alert color="red" title="ผิดพลาด" mt="md">
              {error}
            </Alert>
          )}
          {message && (
            <Alert color="green" title="สำเร็จ" mt="md">
              {message}
            </Alert>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Register;
