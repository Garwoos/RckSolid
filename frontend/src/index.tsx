import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Routes et Route
import { Box } from "./screens/Box";
import Login from "./pages/Login"; // Import de la page Login
import Register from "./pages/Register"; // Import de la page Register
import Profile from "./pages/Profile"; // Import de la page Profile

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Box />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add this line */}
        <Route path="/profile" element={<Profile />} /> {/* Add this line */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
