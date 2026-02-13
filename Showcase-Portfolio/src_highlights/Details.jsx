import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Button,
  Carousel,
  Spinner,
  Alert
} from "react-bootstrap";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripAndWishlist = async () => {
      try {
        const [tripRes, userRes] = await Promise.all([
          axios.get(`/api/trips/${id}`),
          axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }).catch(() => null) // Ignore error if not logged in
        ]);

        setTrip(tripRes.data);
        if (userRes && userRes.data && userRes.data.wishlist) {
          setIsInWishlist(userRes.data.wishlist.includes(id));
        }
      } catch (err) {
        setError("Failed to load trip details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTripAndWishlist();
  }, [id]);

  const handleWishlist = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to add trips to your wishlist.");
      return;
    }

    setWishlistLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (isInWishlist) {
        await axios.delete(`/api/auth/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(false);
      } else {
        await axios.post(`/api/auth/wishlist/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return (
    <Container className="text-center my-5 py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">Loading trip details...</p>
    </Container>
  );

  if (error) return (
    <Container className="my-5">
      <Alert variant="danger">{error}</Alert>
      <Button variant="link" onClick={() => navigate("/places")}>Back to Places</Button>
    </Container>
  );

  if (!trip) return null;

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Multimedia and Info */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 overflow-hidden">
            {trip.images && trip.images.length > 0 ? (
              <Carousel interval={3000}>
                {trip.images.map((img, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={img}
                      alt={`Slide ${index}`}
                      style={{ height: "450px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img
                className="d-block w-100"
                src="https://via.placeholder.com/800x450"
                alt="Placeholder"
                style={{ height: "450px", objectFit: "cover" }}
              />
            )}

            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg="primary" className="px-3 py-2">{trip.category}</Badge>
                <div className="text-muted">
                  <i className="bi bi-clock me-1"></i>{trip.duration}
                  {trip.pickUpTime && <span className="ms-3"><i className="bi bi-geo-alt me-1"></i>Pick: {trip.pickUpTime}</span>}
                  {trip.dropTime && <span className="ms-3"><i className="bi bi-arrow-return-left me-1"></i>Drop: {trip.dropTime}</span>}
                </div>
              </div>
              <h1 className="fw-bold mb-3">{trip.title}</h1>
              <p className="text-muted lead mb-4">{trip.description}</p>

              <h4 className="fw-bold mb-3 border-bottom pb-2">Itinerary</h4>
              {trip.itinerary && trip.itinerary.length > 0 ? (
                <ListGroup variant="flush">
                  {trip.itinerary.map((item, index) => (
                    <ListGroup.Item key={index} className="border-0 px-0 py-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <Badge pill bg="dark">Day {item.day}</Badge>
                        </div>
                        <div>
                          <ul className="mb-0">
                            {item.activities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted italic">Itinerary details coming soon...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Booking and Organizer Side */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: "100px" }}>
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-4">Book This Trip</h3>
              <div className="d-flex justify-content-between mb-3 fs-5">
                <span>Price per head:</span>
                <span className="fw-bold text-success">
                  {typeof trip.price === 'object'
                    ? `₹${trip.price.adult} (Adult) / ₹${trip.price.child} (Child)`
                    : `₹${trip.price}`}
                </span>
              </div>

              <div className="card bg-light p-3 mb-4">
                <small className="text-muted mb-1 d-block font-monospace">ORGANIZED BY</small>
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle p-2 shadow-sm me-3">
                    <i className="bi bi-person-badge fs-4 text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{trip.organizerId?.name}</h6>
                    <small className="text-muted">{trip.organizerId?.email}</small>
                  </div>
                </div>
              </div>

              <Button
                variant="dark"
                size="lg"
                className="w-100 py-3 mb-3 fw-bold"
                onClick={() =>
                  navigate("/booking", {
                    state: {
                      tripId: trip._id,
                      tripName: trip.title,
                      price: trip.price
                    }
                  })
                }
              >
                Continue to Booking
              </Button>
              <Button
                variant={isInWishlist ? "outline-danger" : "outline-primary"}
                className="w-100 py-2"
                onClick={handleWishlist}
                disabled={wishlistLoading}
              >
                <i className={`bi ${isInWishlist ? "bi-heart-fill" : "bi-heart"} me-2`}></i>
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>

              <p className="text-center text-muted small mt-4 mb-0">
                <i className="bi bi-shield-check me-1"></i>Secure Booking and Instant Confirmation
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Details;
