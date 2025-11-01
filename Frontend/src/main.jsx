// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ไฟล์ App.jsx (เดี๋ยวเราจะแก้)

// 1. Import CSS ของ Mantine
import '@mantine/core/styles.css';

// 2. Import Provider ของ Mantine และ Router
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. หุ้ม App ด้วย Provider ทั้งสอง */}
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);