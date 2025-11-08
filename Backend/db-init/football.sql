-- ตารางผู้ใช้
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO pitches (name, location) VALUES
('สนาม A','นนทบุรี'),
('สนาม B','นนทบุรี'),
('สนาม C','นนทบุรี');
