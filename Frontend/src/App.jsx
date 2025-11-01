// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Group, Anchor } from '@mantine/core'; // Import UI สำหรับเมนู

// Import หน้าที่เราสร้าง
import Login from './pages/Login';
import Register from './pages/Register';
// import MyBookings from './pages/MyBookings'; // เดี๋ยวเราค่อยสร้าง

function App() {
  return (
    <Container>
      {/* สร้างเมนูง่ายๆ ด้วย Mantine */}
      <Group justify="center" mt="lg">
        <Anchor component={Link} to="/login">
          เข้าสู่ระบบ
        </Anchor>
        <Anchor component={Link} to="/register">
          สมัครสมาชิก
        </Anchor>
      </Group>
      
      <hr />

      {/* ส่วนที่สลับหน้าไปมา */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/my-bookings" element={<MyBookings />} /> */}
      </Routes>
    </Container>
  );
}

export default App;