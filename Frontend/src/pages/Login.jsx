// // import React, { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   Container,
// //   Paper,
// //   Title,
// //   TextInput,
// //   PasswordInput,
// //   Button,
// //   Alert,
// // } from "@mantine/core";

// // function Login() {
// //   const [formData, setFormData] = useState({ username: "", password: "" });
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await axios.post(
// //         "http://localhost:3000/login",
// //         formData
// //       );
// //       const { token, user } = response.data;

// //       localStorage.setItem("token", token);
// //       localStorage.setItem("user", JSON.stringify(user));

// //       navigate("/dashboard"); // ไปหน้า "การจองของฉัน"
// //     } catch (err) {
// //       setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการ Login");
// //     }
// //   };

// //   return (
// //     <Container size={420} my={40}>
// //       <Paper withBorder shadow="md" p={30} mt={30} radius="md">
// //         <Title ta="center" order={2}>
// //           เข้าสู่ระบบ
// //         </Title>
// //         <form onSubmit={handleSubmit}>
// //           <TextInput
// //             label="Username"
// //             name="username"
// //             onChange={handleChange}
// //             required
// //           />
// //           <PasswordInput
// //             label="Password"
// //             name="password"
// //             onChange={handleChange}
// //             required
// //             mt="md"
// //           />
// //           <Button type="submit" fullWidth mt="xl">
// //             เข้าสู่ระบบ
// //           </Button>
// //         </form>
// //         {error && (
// //           <Alert color="red" title="เกิดข้อผิดพลาด" mt="md">
// //             {error}
// //           </Alert>
// //         )}
// //       </Paper>
// //     </Container>
// //   );
// // }
// // export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Title,
//   TextInput,
//   PasswordInput,
//   Button,
//   Alert,
//   Text,
//   Group,
// } from "@mantine/core";
// import { IconBallFootball } from "@tabler/icons-react";

// function Login() {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/login", formData);
//       const { token, user } = response.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการ Login");
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #16a34a, #15803d)",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Container size={420}>
//         <Paper shadow="lg" p={30} radius="lg" withBorder>
//           <Group position="center" mb="md">
//             <IconBallFootball size={45} color="#16a34a" />
//           </Group>
//           <Title ta="center" order={2}>
//             เข้าสู่ระบบ
//           </Title>
//           <form onSubmit={handleSubmit}>
//             <TextInput label="Username" name="username" onChange={handleChange} required mt="md" />
//             <PasswordInput label="Password" name="password" onChange={handleChange} required mt="md" />
//             <Button
//               type="submit"
//               fullWidth
//               mt="xl"
//               size="md"
//               style={{
//                 backgroundColor: "#16a34a",
//                 transition: "0.3s",
//               }}
//               onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
//               onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
//             >
//               เข้าสู่ระบบ
//             </Button>
//           </form>
//           <Text ta="center" mt="md">
//             ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
//           </Text>
//           {error && (
//             <Alert color="red" title="ผิดพลาด" mt="md">
//               {error}
//             </Alert>
//           )}
//         </Paper>
//       </Container>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
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
import { IconBallFootball } from "@tabler/icons-react";
import { useAuth } from '../untils/AuthContext'; // 🌟 1. Import useAuth

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
      const response = await axios.post("http://localhost:3000/login", formData);
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #398998ff, #81cdd1ff)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container size={420}>
        <Paper shadow="lg" p={30} radius="lg" withBorder>
          <Group position="center" mb="md">
            <IconBallFootball size={45} color="#16a34a" />
          </Group>
          <Title ta="center" order={2}>
            เข้าสู่ระบบ
          </Title>
          <form onSubmit={handleSubmit}>
            <TextInput label="Username" name="username" onChange={handleChange} required mt="md" />
            <PasswordInput label="Password" name="password" onChange={handleChange} required mt="md" />
            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={loading} // ใช้ Loading State
              style={{
                backgroundColor: "#16a34a",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
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
