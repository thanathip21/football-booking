// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "@mantine/core/styles.css";
// import { MantineProvider } from "@mantine/core";
// import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     {/* 3. หุ้ม App ด้วย Provider ทั้งสอง */}
//     <MantineProvider withGlobalStyles withNormalizeCSS>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </MantineProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
// 🌟 1. Import AuthProvider
import { AuthProvider } from "../src/untils/AuthContext.jsx"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        {/* 🌟 2. นำ AuthProvider มาครอบ App */}
        <AuthProvider> 
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
