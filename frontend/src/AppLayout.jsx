import React,{useState} from 'react';    
import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import NavbarR from './components/NavbarR';
import Welcome from './components/Welcome';
import About from './pages/About';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Details from './components/Details';
import Places from './pages/Places';
import Booking from './pages/Booking';

const LayoutContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && <NavbarR />}
      {isHome && <Welcome />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/places" element={<Places />} />
        <Route path="/place/:name" element={<Details />} />
        <Route path="/book/:name" element={<Booking />} />
      </Routes>
    </>
  );
};

const AppLayout = () => {
  return (
    <Router>  
      <LayoutContent />
    </Router>
  );
};

export default AppLayout;