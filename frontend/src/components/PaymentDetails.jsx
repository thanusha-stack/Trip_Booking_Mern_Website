import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

import EmailVerification from "../components/EmailVerification";
import PhoneVerification from "../components/PhoneVerification";
import TicketCounter from "../components/TicketCounter";
import PaymentDetails from "../components/PaymentDetails";
import PriceSummary from "../components/PriceSummary";
import places from "../dataset/placeList";

import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Booking = () => {
  const { user } = useAuth(); // Google login user
  const { name } = useParams();
  const place = places.find((p) => p.name === decodeURIComponent(name));

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [payment, setPayment] = useState({ upiId: "", provider: "" });

  // ✅ New: Date selection
  const [bookingDate, setBookingDate] = useState("");

  // calculate total
  useEffect(() => {
    if (place) {
      setTotalAmount(adult * place.adultFee + child * place.childFee);
    }
  }, [adult, child, place]);

  if (!place) return <p>Place not found</p>;

  // ✅ Submit booking to backend
  const handleBooking = async () => {
    if (!emailVerified) return alert("Please verify your email");
    if (!phoneVerified) return alert("Please verify your phone");
    if (!payment.upiId || !payment.provider)
      return alert("Please enter UPI details");
    if (!bookingDate) return alert("Please select a booking date");

    try {
      const payload = {
        placeName: place.name,
        userEmail: user.email,
        userPhone: user.phone || "N/A",
        adultCount: adult,
        childCount: child,
        totalAmount,
        payment,
        emailVerified,
        phoneVerified,
        bookingDate, // added
      };

      const res = await axios.post("http://localhost:5000/api/bookings", payload);
      alert("Booking Successful! Booking ID: " + res.data.booking._id);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Try again.");
    }
  };

  return (
    <Container className="mt-3">
      <Row className="g-4">
        <Col md={6}>
          <EmailVerification onVerify={setEmailVerified} />
          <PhoneVerification onVerify={setPhoneVerified} />

          {/* ✅ Booking Date Picker */}
          <Form.Group className="mt-3">
            <Form.Label className="fw-medium">Select Date</Form.Label>
            <Form.Control
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <PaymentDetails onPaymentChange={setPayment} />

          <TicketCounter
            label="Adults"
            price={place.adultFee}
            count={adult}
            setCount={setAdult}
            min={1}
          />

          <TicketCounter
            label="Children"
            price={place.childFee}
            count={child}
            setCount={setChild}
          />

          <PriceSummary
            placeName={place.name}
            totalAmount={totalAmount}
            emailVerified={emailVerified && phoneVerified}
          />

          <Button
            variant="primary"
            className="mt-3"
            onClick={handleBooking}
            disabled={
              !emailVerified ||
              !phoneVerified ||
              !payment.upiId ||
              !payment.provider ||
              !bookingDate
            }
          >
            Confirm Booking
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Booking;
