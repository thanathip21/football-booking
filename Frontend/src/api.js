// src/api.js
import axios from 'axios';

// 1. สร้าง "instance" ของ axios
const api = axios.create({
    baseURL: 'http://localhost:3000', // ⭐️ URL หลักของ Backend
});

// 2. ⭐️ นี่คือหัวใจหลัก ⭐️
// "ก่อน" ที่ axios จะยิง request ทุกครั้ง
api.interceptors.request.use(
    (config) => {
        // 3. ดึง token มาจาก localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // 4. ถ้ามี token, ใส่ใน Header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;