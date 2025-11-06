import React from 'react';
import { Link } from 'react-router-dom';
import { Group, Anchor, Text } from '@mantine/core';
import { useAuth } from '../untils/AuthContext'; // 🌟 ดึงสถานะการล็อกอิน

const Header = () => {
  const { user, logout } = useAuth(); // ดึง user และ logout function

  if (user) {
    // ผู้ใช้ล็อกอินแล้ว: แสดงเมนูสำหรับผู้ใช้
    return (
      <Group justify="space-between" mt="lg">
        {/* เมนูหลัก */}
        <Group>
          <Anchor component={Link} to="/dashboard">
            หน้าหลัก (จองสนาม)
          </Anchor>
          <Anchor component={Link} to="/my-bookings">
            การจองของฉัน
          </Anchor>
          
        </Group>

        {/* เมนูผู้ใช้/ออกจากระบบ */}
        <Group>
            <Text size="sm" c="gray">เข้าสู่ระบบในชื่อ: {user.username || 'ผู้ใช้'}</Text>
            <Anchor 
              onClick={logout} 
              style={{ cursor: 'pointer', color: 'red' }} // กำหนด cursor เพื่อให้รู้ว่าคลิกได้
            >
              ออกจากระบบ
            </Anchor>
        </Group>
      </Group>
    );
  }

  // ผู้ใช้ยังไม่ได้ล็อกอิน: แสดงเมนูสมัคร/เข้าสู่ระบบ
  return (
    <Group justify="flex-end" mt="lg"> 
      <Anchor component={Link} to="/login">
        เข้าสู่ระบบ
      </Anchor>
      <Anchor component={Link} to="/register">
        สมัครสมาชิก
      </Anchor>
    </Group>
  );
};

export default Header;
