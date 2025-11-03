import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// 1. สร้าง Context
const AuthContext = createContext(null);

// 2. Custom Hook สำหรับเรียกใช้ Context
export const useAuth = () => {
  // Hook ที่ใช้เพื่อเข้าถึง user, login, logout ได้ง่ายๆ
  return useContext(AuthContext);
};

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  // เริ่มต้นสถานะโดยพยายามอ่านจาก localStorage
  const initialUser = JSON.parse(localStorage.getItem("user")) || null;
  const [user, setUser] = useState(initialUser);

  // ฟังก์ชัน Login: บันทึกข้อมูลผู้ใช้และ Token
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ฟังก์ชัน Logout: ล้างข้อมูลและสถานะ
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // NOTE: ควรล้าง token จาก interceptor ใน api.js ด้วย (ถ้าทำได้)
    setUser(null);
  };

  // รวมค่าทั้งหมดที่จะส่งผ่าน Context
  const value = useMemo(() => ({
    user,
    login,
    logout,
    isLoggedIn: !!user
  }), [user]);

  // useEffect เพื่อความมั่นใจ: หาก user เป็น null ต้องล้าง localStorage
  useEffect(() => {
    if (!user) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
