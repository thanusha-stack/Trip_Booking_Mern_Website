import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {Navbar} from 'react-bootstrap';

function NavbarR() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  return (
     <Navbar bg='dark' variant="dark" expand="lg" className="sticky-top shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-light" to="/">
          Mysore <span className="text-primary">Tourism</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {["about", "places", "contact"].map((path) => (
              <li className="nav-item" key={path}>
                <NavLink
                  to={`/${path}`}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  {path.charAt(0).toUpperCase() + path.slice(1)}
                </NavLink>
              </li>
            ))}

            <li className="nav-item">
              {user ? (
                <>
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="btn btn-primary">
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </Navbar>
  );
}

export default NavbarR;
