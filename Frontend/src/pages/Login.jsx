// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Alert } from '@mantine/core';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', formData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard'); // ไปหน้า "การจองของฉัน"
        } catch (err) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการ Login');
        }
    };

    return (
        <Container size={420} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" order={2}>เข้าสู่ระบบ</Title>
                <form onSubmit={handleSubmit}>
                    <TextInput label="Username" name="username" onChange={handleChange} required />
                    <PasswordInput label="Password" name="password" onChange={handleChange} required mt="md" />
                    <Button type="submit" fullWidth mt="xl">เข้าสู่ระบบ</Button>
                </form>
                {error && (
                    <Alert color="red" title="เกิดข้อผิดพลาด" mt="md">{error}</Alert>
                )}
            </Paper>
        </Container>
    );
}
export default Login;