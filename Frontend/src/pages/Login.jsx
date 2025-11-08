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
import { useAuth } from "../untils/AuthContext";
import Logo from "../assets/Logo.png";
import BackgroundVideo from "../assets/background2.mp4";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่ม Loading State
  const navigate = useNavigate();
  const { login } = useAuth(); // 🌟 2. ดึงฟังก์ชัน login จาก Context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // เริ่ม Loading
    try {
      // 🚨 ควรใช้ api.post แทน axios.post ตรง ๆ เพื่อให้ interceptor ทำงาน
      const response = await axios.post(
        "http://localhost:3000/login",
        formData
      );
      const { token, user } = response.data;

      // 🌟 3. ใช้ Context.login() แทน localStorage.setItem()
      login(user, token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการ Login");
    } finally {
      setLoading(false); // หยุด Loading
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
        {/* คุณสามารถเพิ่ม source อื่นๆ เช่น WebM ได้ที่นี่เพื่อความเข้ากันได้กับ Browser ต่างๆ */}
        Your browser does not support the video tag.
      </video>
      <Container size={420}>
        <Paper shadow="lg" p={80} radius="lg" withBorder>
          <Group justify="center" mb="md" style={{ width: "100%" }}>
            <img
              src={Logo}
              alt="Your Company Logo"
              style={{ width: "100px", height: "auto", display: "block" }} // 👈 เพิ่ม display: 'block' เพื่อความมั่นใจ
            />
          </Group>
          <Title ta="center" order={2}>
            เข้าสู่ระบบ
          </Title>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username"
              name="username"
              onChange={handleChange}
              required
              mt="md"
            />
            <PasswordInput
              label="Password"
              name="password"
              onChange={handleChange}
              required
              mt="md"
            />
            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={loading} // ใช้ Loading State
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
              เข้าสู่ระบบ
            </Button>
          </form>
          <Text ta="center" mt="md">
            ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
          </Text>
          {error && (
            <Alert color="red" title="ผิดพลาด" mt="md">
              {error}
            </Alert>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
