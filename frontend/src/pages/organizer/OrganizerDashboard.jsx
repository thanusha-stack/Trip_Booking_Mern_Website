import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchTrips();
        fetchBookings();
    }, [user.id]);

    const fetchTrips = () => {
        axios.get(`/api/trips?organizerId=${user.id}`)
            .then(res => setTrips(res.data))
            .catch(err => console.error(err));
    };

    const fetchBookings = () => {
        const token = localStorage.getItem("token");
        axios.get("/api/bookings/organizer-bookings", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trip?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrips(); // Refresh the list
        } catch (err) {
            alert("Failed to delete trip: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <Container className="mt-5">
            <h2>Welcome, {user.name} (Organizer)</h2>
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Trips</Card.Title>
                            <h3>{trips.length}</h3>
                            <Button as={Link} to="/organizer/create-trip" variant="primary">Post New Trip</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Bookings</Card.Title>
                            <h3>{bookings.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h3 className="mt-5">Your Trips</h3>
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Trip Title</th>
                        <th>Destination</th>
                        <th>Price (Adult)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map(trip => (
                        <tr key={trip._id}>
                            <td>{trip.title}</td>
                            <td>{trip.destination}</td>
                            <td>
                                {typeof trip.price === 'object'
                                    ? `₹${trip.price.adult}`
                                    : `₹${trip.price}`}
                            </td>
                            <td>
                                <Button as={Link} to={`/organizer/edit-trip/${trip._id}`} variant="info" size="sm" className="me-2">Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(trip._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h3 className="mt-5">Recent Bookings</h3>
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Tourist</th>
                        <th>Trip</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking.touristId?.name}</td>
                            <td>{booking.tripId?.title}</td>
                            <td>₹{booking.totalAmount}</td>
                            <td>{booking.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default OrganizerDashboard;
