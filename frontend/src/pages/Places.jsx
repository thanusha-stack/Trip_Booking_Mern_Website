import { useState, useEffect } from "react";
import axios from "axios";
import PlaceList from "../components/PlaceList";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL || "";

function Places() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destination: "",
    category: "All",
  });

  const categories = ["All", "Combo", "Adventure", "Heritage", "Pilgrimage"];

  useEffect(() => {
    fetchTrips();
  }, [filters]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/trips`;
      const params = new URLSearchParams();
      if (filters.destination) params.append("destination", filters.destination);
      if (filters.category !== "All") params.append("category", filters.category);

      const res = await axios.get(`${url}?${params.toString()}`);
      setTrips(res.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to connect to the server.";
      setError(`${msg}. Please make sure the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 fw-bold text-dark">Explore Our Trip Collections</h2>

      {error && (
        <div className="alert alert-danger text-center animate__animated animate__fadeIn">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* 🔍 Dynamic Filters */}
      <Row className="mb-4 gx-3">
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Control
              name="destination"
              type="text"
              placeholder="Search by destination (e.g. Mysore, Coorg)..."
              value={filters.destination}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* 🏞️ Trip Listings */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading available trips...</p>
        </div>
      ) : (
        <Row>
          {trips.length > 0 ? (
            trips.map(trip => (
              <Col md={4} key={trip._id} className="mb-4">
                <PlaceList {...trip} />
              </Col>
            ))
          ) : (
            <div className="text-center w-100 my-5 py-5">
              <i className="bi bi-search text-muted display-1"></i>
              <p className="mt-3 text-muted lead">No trips match your current filters. Try searching for something else!</p>
            </div>
          )}
        </Row>
      )}
    </Container>
  );
}

export default Places;
