import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
} from "@mantine/core";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      setError("กรุณากรอก username, password และ email");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
      setMessage("");
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title ta="center" order={2}>
          สมัครสมาชิก
        </Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            name="username"
            onChange={handleChange}
            required
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
          <Button type="submit" fullWidth mt="xl">
            สมัครสมาชิก
          </Button>
        </form>
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
  );
}
export default Register;
