import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const TouristDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("/api/bookings/my-bookings", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Container className="mt-5">
            <h2>Welcome, {user.name}</h2>
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>My Bookings</Card.Title>
                            <h3>{bookings.length}</h3>
                            <Link to="/places" className="btn btn-primary">Find More Trips</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-light p-2">
                        <Card.Body>
                            <Card.Title className="text-muted small text-uppercase fw-bold">Wishlist Items</Card.Title>
                            <h2 className="fw-bold">{user.wishlist?.length || 0}</h2>
                            <Link to="/tourist/wishlist" className="btn btn-sm btn-outline-primary mt-2">Manage Favorites</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h3 className="mt-5">Booking History</h3>
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Trip</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking.tripId?.title}</td>
                            <td>{new Date(booking.tripDate).toLocaleDateString()}</td>
                            <td>₹{booking.totalAmount}</td>
                            <td>
                                <Badge bg={booking.status === "confirmed" ? "success" : "warning"}>
                                    {booking.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">No bookings found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default TouristDashboard;
