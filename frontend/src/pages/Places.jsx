import { useState, useEffect } from "react";
import axios from "axios";
import PlaceList from "../components/PlaceList";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";

function Places() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
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
      let url = "/api/trips";
      const params = new URLSearchParams();
      if (filters.destination) params.append("destination", filters.destination);
      if (filters.category !== "All") params.append("category", filters.category);

      const res = await axios.get(`${url}?${params.toString()}`);
      setTrips(res.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 fw-bold">Explore Our Trip Collections</h2>

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
