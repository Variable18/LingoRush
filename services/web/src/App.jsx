import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import ServicesPage from "./pages/ServicesPage";
import SignupPage from "./pages/SignupPage";
import SpanishLearning from "./pages/SpanishLearning";
import TranslatePage from "./pages/TranslatePage";
import Learn from "./pages/Learn";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";

import GermanLevelPlay from "./pages/GermanLevelPlay";
import GermanLevels from "./pages/GermanLevels";
// Removed legacy Product/Pricing pages per new site scope

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Split out to access useLocation inside Router
function AnimatedRoutes() {
  const isLoggedIn = !!localStorage.getItem("lingorush_token");
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/translate" element={<TranslatePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* sidebar pages */}
      <Route path="/learn" element={<Learn />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<Logout />} />

      {/* language routes */}
      <Route path="/learn/spanish" element={<SpanishLearning />} />

      {/* 🇩🇪 German learning system */}
      <Route path="/learn/german" element={<GermanLevels />} />
      <Route path="/learn/german/level/:level" element={<GermanLevelPlay />} />

      {/* protected home route */}
      <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
