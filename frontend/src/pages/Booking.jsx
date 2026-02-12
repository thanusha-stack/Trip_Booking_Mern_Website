import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { Container, Row, Col, Form, Card, Toast, ToastContainer, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

import RazorpayPayment from "../components/RazorpayPayment";
import TicketCounter from "../components/TicketCounter";

const Booking = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const receiptIdRef = useRef(`MYT-${Date.now()}`);

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [tripDate, setTripDate] = useState("");

  // For simplicity in this marketplace refactor, we'll assume auth takes care of identity
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  if (!state || !state.tripId) {
    return <div className="text-center mt-5">No booking data found. Please select a trip from the <a href="/places">browse</a> page.</div>;
  }

  const { tripId, tripName, price } = state;
  const adultPrice = typeof price === 'object' ? price.adult : price;
  // If price is object, use price.child, else default to 50% of adult price
  const childPrice = typeof price === 'object' ? price.child : (price * 0.5);

  const totalAmount = (adult * adultPrice) + (child * childPrice);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

  return (
    <>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-lg border-0 overflow-hidden">
              <Row className="g-0">
                {/* INFO SIDE */}
                <Col md={7} className="p-4 bg-white border-end">
                  <h4 className="fw-bold mb-4">Confirm Your Booking</h4>
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase">TRIP PACKAGE</h6>
                    <h5 className="fw-bold">{tripName}</h5>
                  </div>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Select Trip Date</Form.Label>
                    <Form.Control
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={tripDate}
                      onChange={(e) => setTripDate(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Number of Travelers</h6>
                    <Row className="g-3">
                      <Col sm={6}>
                        <TicketCounter
                          label={`Adults (₹${adultPrice})`}
                          price={adultPrice}
                          count={adult}
                          setCount={setAdult}
                          min={1}
                        />
                      </Col>
                      <Col sm={6}>
                        <TicketCounter
                          label={`Children (₹${childPrice})`}
                          price={childPrice}
                          count={child}
                          setCount={setChild}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div className="alert alert-info py-2 small">
                    <i className="bi bi-info-circle me-2"></i>
                    A booking confirmation will be sent to <strong>{user.email}</strong>
                  </div>
                </Col>

                {/* SUMMARY & PAYMENT SIDE */}
                <Col md={5} className="p-4 bg-light">
                  <h5 className="fw-bold mb-4">Payment Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Adults (x{adult})</span>
                    <span>₹{adult * adultPrice}</span>
                  </div>
                  {child > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Children (x{child})</span>
                      <span>₹{child * childPrice}</span>
                    </div>
                  )}
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between fs-4 fw-bold text-dark mb-4">
                    <span>Grand Total</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="mb-4">
                    <small className="text-muted d-block mb-2">Scheduled for:</small>
                    <div className="fw-bold fs-5">{tripDate ? new Date(tripDate).toLocaleDateString() : "Please select a date"}</div>
                  </div>

                  <RazorpayPayment
                    amount={totalAmount}
                    disabled={!tripDate || totalAmount <= 0}
                    bookingData={{
                      tripId,
                      tripName,
                      userName: user.name,
                      userEmail: user.email,
                      adultCount: adult,
                      childCount: child,
                      totalAmount,
                      tripDate,
                      payment: {
                        method: "razorpay",
                        status: "paid"
                      }
                    }}
                    onSuccess={() =>
                      showToast("✅ Payment & Booking Successful!", "success")
                    }
                    onError={(msg) =>
                      showToast("❌ Payment failed: " + msg, "error")
                    }
                  />

                  <p className="text-center text-muted small mt-4 mb-0">
                    <i className="bi bi-lock-fill me-1"></i> Secure 256-bit SSL Encrypted Payment
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.type === "success" ? "success" : "danger"}
          autohide
        >
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Booking;
