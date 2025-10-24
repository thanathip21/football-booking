-- ตารางผู้ใช้
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- ตารางสนาม
CREATE TABLE pitches (
  pitch_id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  location VARCHAR(100)
);

-- ตารางจอง
CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  pitch_id INT REFERENCES pitches(pitch_id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed'
);
