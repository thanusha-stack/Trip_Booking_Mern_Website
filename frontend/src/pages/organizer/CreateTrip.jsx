import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
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
        itinerary: [""], // Initial 1 day
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDurationChange = (e) => {
        const daysMap = { "1 day": 1, "2 days": 2, "3 days": 3, "4 days": 4, "5+ days": 5 };
        const days = daysMap[e.target.value] || 1;

        // Resize itinerary array while preserving existing data
        const newItinerary = [...formData.itinerary];
        if (newItinerary.length < days) {
            while (newItinerary.length < days) newItinerary.push("");
        } else if (newItinerary.length > days) {
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
                images: formData.images.split(",").map(img => img.trim()),
                itinerary: formData.itinerary.map((dayPlan, index) => ({
                    day: index + 1,
                    activities: [dayPlan] // Backend expects array of strings
                }))
            };

            await axios.post("/api/trips", tripData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create trip");
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Card className="p-4 shadow">
                <h3>Post a New Trip Combo</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Trip Title</Form.Label>
                        <Form.Control type="text" name="title" required onChange={handleChange} placeholder="e.g. 3-Day Mysore & Coorg Adventure" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Trip Summary (Short Description)</Form.Label>
                        <Form.Control as="textarea" rows={2} name="description" required onChange={handleChange} placeholder="Brief summary for the trip card..." />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration</Form.Label>
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
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="text" name="category" onChange={handleChange} placeholder="e.g. Combo, Adventure, Heritage" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5 className="mt-3">Day-wise Itinerary</h5>
                    {formData.itinerary.map((dayPlan, index) => (
                        <Form.Group key={index} className="mb-3">
                            <Form.Label>Day {index + 1} Plan</Form.Label>
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
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Destination</Form.Label>
                                <Form.Control type="text" name="destination" required onChange={handleChange} placeholder="e.g. Mysore" />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Adult Price (₹)</Form.Label>
                                <Form.Control type="number" name="adultPrice" required onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Child Price (₹)</Form.Label>
                                <Form.Control type="number" name="childPrice" required onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Pick Up Time</Form.Label>
                                <Form.Control type="time" name="pickUpTime" required onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Drop Time</Form.Label>
                                <Form.Control type="time" name="dropTime" required onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URLs (comma separated)</Form.Label>
                        <Form.Control type="text" name="images" onChange={handleChange} placeholder="https://link1.com, https://link2.com" />
                    </Form.Group>

                    <Button type="submit" variant="success" className="w-100">Create Trip</Button>
                </Form>
            </Card>
        </Container>
    );
};

// Simple Card wrapper for CreateTrip
const Card = ({ children, className }) => (
    <div className={`card ${className}`}>{children}</div>
);

export default CreateTrip;
