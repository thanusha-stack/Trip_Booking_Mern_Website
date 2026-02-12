import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Alert, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditTrip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        destination: "",
        adultPrice: "",
        childPrice: "",
        pickUpTime: "",
        dropTime: "",
        duration: "1 day",
        category: "Combo",

        images: "",
        itinerary: [""],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await axios.get(`/api/trips/${id}`);
                const trip = res.data;
                setFormData({
                    title: trip.title,
                    description: trip.description,
                    destination: trip.destination,
                    adultPrice: trip.price.adult ? trip.price.adult.toString() : trip.price.toString(),
                    childPrice: trip.price.child ? trip.price.child.toString() : (trip.price * 0.7).toString(),
                    pickUpTime: trip.pickUpTime || "",
                    dropTime: trip.dropTime || "",
                    duration: trip.duration,
                    category: trip.category || "Combo",
                    images: trip.images ? trip.images.join(", ") : "",
                    itinerary: trip.itinerary && trip.itinerary.length > 0
                        ? trip.itinerary.map(item => item.activities[0] || "")
                        : new Array(Number(trip.duration.split(" ")[0]) || 1).fill(""),
                });
            } catch (err) {
                setError("Failed to load trip data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDurationChange = (e) => {
        const daysMap = { "1 day": 1, "2 days": 2, "3 days": 3, "4 days": 4, "5+ days": 5 };
        const days = daysMap[e.target.value] || 1;

        const newItinerary = [...formData.itinerary];
        if (newItinerary.length < days) {
            while (newItinerary.length < days) newItinerary.push("");
        } else if (newItinerary.length > days) {
            // Validate if we should warn user about losing data, but for now just truncate
            newItinerary.length = days;
        }

        setFormData({ ...formData, duration: e.target.value, itinerary: newItinerary });
    };

    const handleItineraryChange = (index, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = value;
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const token = localStorage.getItem("token");

        try {
            const tripData = {
                ...formData,
                price: {
                    adult: Number(formData.adultPrice),
                    child: Number(formData.childPrice)
                },
                pickUpTime: formData.pickUpTime,
                dropTime: formData.dropTime,
                images: formData.images.split(",").map(img => img.trim()).filter(img => img !== ""),
            };

            await axios.put(`/api/trips/${id}`, tripData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("Trip updated successfully!");
            setTimeout(() => navigate("/profile"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update trip");
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    return (
        <Container className="mt-5 mb-5">
            <Card className="p-4 shadow border-0">
                <h3>Edit Trip Package</h3>
                <p className="text-muted small">Update details for your travel combo.</p>
                <hr />
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Trip Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. 3-Day Mysore & Coorg Adventure"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Trip Summary (Short Description)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Destination</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="destination"
                                    required
                                    value={formData.destination}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Adult Price (INR)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="adultPrice"
                                    required
                                    value={formData.adultPrice}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Child Price (INR)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="childPrice"
                                    required
                                    value={formData.childPrice}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Pick Up Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="pickUpTime"
                                    required
                                    value={formData.pickUpTime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Drop Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="dropTime"
                                    required
                                    value={formData.dropTime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Duration</Form.Label>
                                <Form.Select name="duration" value={formData.duration} onChange={handleDurationChange}>
                                    <option value="1 day">1 day</option>
                                    <option value="2 days">2 days</option>
                                    <option value="3 days">3 days</option>
                                    <option value="4 days">4 days</option>
                                    <option value="5+ days">5+ days</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5 className="mt-3">Day-wise Itinerary</h5>
                    {formData.itinerary.map((dayPlan, index) => (
                        <Form.Group key={index} className="mb-3">
                            <Form.Label className="fw-bold">Day {index + 1} Plan</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={dayPlan}
                                onChange={(e) => handleItineraryChange(index, e.target.value)}
                                required
                                placeholder={`Enter activities for Day ${index + 1}...`}
                            />
                        </Form.Group>
                    ))}

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Image URLs (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="images"
                            value={formData.images}
                            onChange={handleChange}
                            placeholder="https://link1.com, https://link2.com"
                        />
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button type="submit" variant="success" className="flex-grow-1 py-2 fw-bold">Update Trip</Button>
                        <Button variant="outline-secondary" onClick={() => navigate("/profile")}>Cancel</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default EditTrip;
