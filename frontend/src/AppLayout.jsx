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
import Welcome from "./components/Welcome";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Places from "./pages/Places";
import Details from "./components/Details";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Profile from "./pages/Profile";


// 🔹 Handles navbar switching based on route
const LayoutContent = () => {
  return (
    <>
      <NavbarR />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/places" element={<Places />} />
        <Route path="/place/:name" element={<Details />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/book/:name"
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
              <Profile />
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
