import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavbarR() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-bg-dark navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="#">
            Mysore Tourism
          </a>

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
<li>
                  {user ? (
                  <button onClick={logout} className="btn btn-outline-light">
                    Profile
                  </button>
                ) : (
                  <NavLink to="/login" className="btn btn-light">
                    Login
                  </NavLink>
                )}
              </li>           
               </ul>
          </div>
        </div>
      </nav>
  );
}

export default NavbarR;