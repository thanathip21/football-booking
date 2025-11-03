// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   // 1. ตรวจสอบว่ามี token ใน localStorage หรือไม่
//   const token = localStorage.getItem("token");

//   // 2. ถ้ามี token ให้แสดง "หน้าที่อยู่ข้างใน" (Outlet)
//   //    ถ้าไม่มี ให้ "ส่งกลับ" (Navigate) ไปหน้า /login
//   return token ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;


import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../untils/AuthContext'; // 🌟 ดึงสถานะการล็อกอิน

const PrivateRoute = () => {
  // 🌟 ดึงสถานะ user จาก Context
  const { user } = useAuth(); 

  // ถ้ามี user (ล็อกอินแล้ว) ให้แสดง "หน้าที่อยู่ข้างใน" (Outlet)
  // ถ้าไม่มี ให้ "ส่งกลับ" (Navigate) ไปหน้า /login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
