// import { Routes, Route, Link } from "react-router-dom";
// import { Container, Group, Anchor } from "@mantine/core";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import MyBookings from "./pages/MyBookings";
// import CreateBooking from "./pages/CreateBooking";
// import PrivateRoute from "./components/PrivateRoute";

// function App() {
//   return (
//     // ⭐️ 2. ตอนนี้ React รู้จัก <Container> แล้ว
//     <Container>
//       <Group justify="center" mt="lg">
//         {/* <Anchor component={Link} to="/dashboard">
//           หน้าหลัก (จองสนาม)
//         </Anchor>
//         <Anchor component={Link} to="/my-bookings">
//           การจองของฉัน
//         </Anchor> */}
//         <Anchor component={Link} to="/login">
//           เข้าสู่ระบบ
//         </Anchor>
//         <Anchor component={Link} to="/register">
//           สมัครสมาชิก
//         </Anchor>
//       </Group>

//       <hr />

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route element={<PrivateRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/my-bookings" element={<MyBookings />} />
//           <Route path="/create-booking" element={<CreateBooking />} />
//           <Route path="/" element={<Dashboard />} />
//         </Route>
//       </Routes>
//     </Container>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import { Container } from "@mantine/core";

// 🌟 Import Header Component
import Header from "./components/Header"; 

// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import CreateBooking from "./pages/CreateBooking";

// Import PrivateRoute
import PrivateRoute from "./components/PrivateRoute"; 

function App() {
  return (
    <Container>
      {/* 🌟 1. ใช้ Header Component ที่ถูกออกแบบให้แสดงเมนูตามสถานะการล็อกอิน */}
      <Header /> 

      <hr />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes: ใช้ PrivateRoute เป็น Layout Guard */}
        <Route element={<PrivateRoute />}>
          {/* ใช้ index route: กำหนดให้ "/" แสดง Dashboard หลังล็อกอิน */}
          <Route index element={<Dashboard />} /> 
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/create-booking" element={<CreateBooking />} />
          
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
