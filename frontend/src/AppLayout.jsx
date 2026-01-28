import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import NavbarR from "./components/NavbarR";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Places from "./pages/Places";
import Details from "./components/Details";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import MarqueeBar from "./components/MarqueeBar";
import ProfileUp from "./pages/ProfileUp";

// 🔹 Handles navbar switching based on route
const LayoutContent = () => {
  return (
    <>
      <NavbarR className="sticky-top shadow-sm"/>
      <MarqueeBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/places" element={<Places />} />
        <Route path="/place/:name" element={<Details />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileUp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

// 🔹 Root App Layout
const AppLayout = () => {
  return (
    <AuthProvider>
      <Router>
        <LayoutContent />
      </Router>
    </AuthProvider>
  );
};

export default AppLayout;
