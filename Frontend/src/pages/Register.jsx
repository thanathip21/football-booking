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

// // function Register() {
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     password: "",
// //     email: "",
// //     full_name: "",
// //     phone: "",
// //   });
// //   const [error, setError] = useState("");
// //   const [message, setMessage] = useState("");
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!formData.username || !formData.password || !formData.email) {
// //       setError("กรุณากรอก username, password และ email");
// //       return;
// //     }
// //     try {
// //       const response = await axios.post(
// //         "http://localhost:3000/register",
// //         formData
// //       );
// //       setMessage(response.data.message);
// //       setError("");
// //       setTimeout(() => navigate("/login"), 2000);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
// //       setMessage("");
// //     }
// //   };

// //   return (
// //     <Container size={420} my={40}>
// //       <Paper withBorder shadow="md" p={30} mt={30} radius="md">
// //         <Title ta="center" order={2}>
// //           สมัครสมาชิก
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
// //           <TextInput
// //             label="Email"
// //             name="email"
// //             type="email"
// //             onChange={handleChange}
// //             required
// //             mt="md"
// //           />
// //           <TextInput
// //             label="Full Name"
// //             name="full_name"
// //             onChange={handleChange}
// //             mt="md"
// //           />
// //           <TextInput
// //             label="Phone"
// //             name="phone"
// //             onChange={handleChange}
// //             mt="md"
// //           />
// //           <Button type="submit" fullWidth mt="xl">
// //             สมัครสมาชิก
// //           </Button>
// //         </form>
// //         {error && (
// //           <Alert color="red" title="ผิดพลาด" mt="md">
// //             {error}
// //           </Alert>
// //         )}
// //         {message && (
// //           <Alert color="green" title="สำเร็จ" mt="md">
// //             {message}
// //           </Alert>
// //         )}
// //       </Paper>
// //     </Container>
// //   );
// // }
// // export default Register;

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
// import { IconUserPlus } from "@tabler/icons-react";

// function Register() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: "",
//     full_name: "",
//     phone: "",
//   });
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/register", formData);
//       setMessage(response.data.message);
//       setError("");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
//       setMessage("");
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #16a34a, #22c55e)",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Container size={420}>
//         <Paper shadow="lg" p={30} radius="lg" withBorder>
//           <Group position="center" mb="md">
//             <IconUserPlus size={40} color="#16a34a" />
//           </Group>
//           <Title order={2} ta="center" color="green.7">
//             สมัครสมาชิก
//           </Title>

//           <form onSubmit={handleSubmit}>
//             <TextInput label="Username" name="username" onChange={handleChange} required mt="sm" />
//             <PasswordInput label="Password" name="password" onChange={handleChange} required mt="md" />
//             <TextInput label="Email" name="email" type="email" onChange={handleChange} required mt="md" />
//             <TextInput label="Full Name" name="full_name" onChange={handleChange} mt="md" />
//             <TextInput label="Phone" name="phone" onChange={handleChange} mt="md" />

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
//               สมัครสมาชิก
//             </Button>
//           </form>

//           <Text ta="center" mt="md">
//             มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
//           </Text>

//           {error && (
//             <Alert color="red" title="ผิดพลาด" mt="md">
//               {error}
//             </Alert>
//           )}
//           {message && (
//             <Alert color="green" title="สำเร็จ" mt="md">
//               {message}
//             </Alert>
//           )}
//         </Paper>
//       </Container>
//     </div>
//   );
// }

// export default Register;


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
import { IconUserPlus } from "@tabler/icons-react";

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
    setLoading(true); // 🌟 เริ่ม Loading
    try {
      const response = await axios.post("http://localhost:3000/register", formData);
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
      setMessage("");
    } finally {
      setLoading(false); // 🌟 หยุด Loading
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container size={420}>
        <Paper shadow="lg" p={30} radius="lg" withBorder>
          <Group position="center" mb="md">
            <IconUserPlus size={40} color="#16a34a" />
          </Group>
          <Title order={2} ta="center" color="green.7">
            สมัครสมาชิก
          </Title>

          <form onSubmit={handleSubmit}>
            <TextInput label="Username" name="username" onChange={handleChange} required mt="sm" />
            <PasswordInput label="Password" name="password" onChange={handleChange} required mt="md" />
            <TextInput label="Email" name="email" type="email" onChange={handleChange} required mt="md" />
            <TextInput label="Full Name" name="full_name" onChange={handleChange} mt="md" />
            <TextInput label="Phone" name="phone" onChange={handleChange} mt="md" />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={loading} // 🌟 ใช้ Loading State
              style={{
                backgroundColor: "#16a34a",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
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
