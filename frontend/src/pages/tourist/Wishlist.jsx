import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import PlaceList from "../../components/PlaceList";

const API_URL = process.env.REACT_APP_API_URL || "";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/auth/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data);
        } catch (err) {
            setError("Failed to fetch wishlist");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Container className="text-center my-5 py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading your favorites...</p>
        </Container>
    );

    return (
        <Container className="my-5">
            <h2 className="fw-bold mb-4">My Wishlist</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {wishlist.length > 0 ? (
                <Row>
                    {wishlist.map(trip => (
                        <Col md={4} key={trip._id} className="mb-4">
                            <PlaceList {...trip} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5 my-5">
                    <i className="bi bi-heart text-muted display-1"></i>
                    <h4 className="mt-3 text-muted">Your wishlist is empty</h4>
                    <p className="text-muted">Start exploring and save trips you like!</p>
                    <a href="/places" className="btn btn-primary mt-3">Browse Trips</a>
                </div>
            )}
        </Container>
    );
};

export default Wishlist;
