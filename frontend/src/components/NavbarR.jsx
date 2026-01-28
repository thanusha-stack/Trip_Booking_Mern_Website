import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Container } from "react-bootstrap";

function NavbarR() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
     
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
         <i className="bi bi-twitter me-2"></i>
          Mysore <span className="text-primary">Tourism</span>
        </Navbar.Brand>

        {/* ✅ Hamburger */}
        <Navbar.Toggle aria-controls="navMenu" />

        {/* ✅ Collapsible Menu */}
        <Navbar.Collapse id="navMenu">
          <Nav className="ms-auto align-items-lg-center gap-2">
            {["about", "places", "contact"].map((path) => (
              <Nav.Link
                key={path}
                as={NavLink}
                to={`/${path}`}
                className="text-capitalize"
              >
                {path}
              </Nav.Link>
            ))}

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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarR;
