import React from "react";
import { NavLink } from "react-router-dom";

const Welcome = () => {
  return (
    <div
      style={{
        backgroundImage: `url("/assets/images/mysorewelcome.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "300px",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-transparent navbar-expand-lg">
        <div className="container">
          <NavLink className="navbar-brand" to="#">
            Mysore Tourism
          </NavLink >

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
              </li>

              <li className="nav-item">
                
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              About
            </NavLink>

              </li>
              <li>
              <NavLink
              to="/places"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Places
            </NavLink>

              </li>

              <li className="nav-item">
                <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Contact
            </NavLink>

              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid my-4">
        <h1 className="text-center text-light">
          Mysore <span className="text-primary">Tourism</span>
        </h1>
      </div>
    </div>
  );
};

export default Welcome;
