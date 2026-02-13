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
import ProfileUp from "./pages/ProfileUp";

// New Marketplace Pages
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateTrip from "./pages/organizer/CreateTrip";
import EditTrip from "./pages/organizer/EditTrip";
import TouristDashboard from "./pages/tourist/TouristDashboard";
import Wishlist from "./pages/tourist/Wishlist";

// 🔹 Handles navbar switching based on route
const LayoutContent = () => {
  return (
    <>
      <NavbarR className="sticky-top shadow-sm" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/places" element={<Places />} />
        <Route path="/place/:id" element={<Details />} />
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

        {/* Marketplace Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-trip"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/edit-trip/:id"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EditTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tourist/dashboard"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <TouristDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tourist/wishlist"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 🚀 Floating Author Bar */}
      <div className="author-float-bar">
        <span className="dot"></span>
        AUTHOR: THANUSHA A (7376231CS332)
      </div>
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
