import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Container } from "react-bootstrap";

function NavbarR() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          <i className="bi bi-twitter me-2"></i>
          Travora Trip
        </Navbar.Brand>

        {/* ✅ Hamburger */}
        <Navbar.Toggle aria-controls="navMenu" />

        {/* ✅ Collapsible Menu */}
        <Navbar.Collapse id="navMenu">
          <Nav className="ms-auto align-items-lg-center gap-2">
            {/* Role-based links */}
            {user && (
              <>
                {user.role === "organizer" && (
                  <>
                    <Nav.Link as={NavLink} to="/profile">Dashboard</Nav.Link>
                    <Nav.Link as={NavLink} to="/organizer/create-trip">Post Trip</Nav.Link>
                  </>
                )}
                {user.role === "tourist" && (
                  <>
                    <Nav.Link as={NavLink} to="/tourist/dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={NavLink} to="/tourist/wishlist">Wishlist</Nav.Link>
                  </>
                )}
              </>
            )}

            {/* Public Links */}
            <Nav.Link as={NavLink} to="/places" className="text-capitalize">Browse Trip</Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="text-capitalize">About</Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className="text-capitalize">Contact</Nav.Link>

            {/* Auth Button */}
            {user ? (
              <button
                className="btn btn-outline-danger ms-lg-2"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="btn btn-primary ms-lg-2">
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
