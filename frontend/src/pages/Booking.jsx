import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";

import EmailVerification from "../components/EmailVerification";
import PhoneVerification from "../components/PhoneVerification";
import RazorpayPayment from "../components/RazorpayPayment";
import TicketCounter from "../components/TicketCounter";

const Booking = () => {
  const { state } = useLocation();
  const [members, setMembers] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [tripDate, setTripDate] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  if (!state)
    return <div className="text-center mt-5">No booking data</div>;

  /* 🔹 Detect combo booking */
  const isCombo = !!state.combo;

  const name = isCombo ? state.combo.title : state.name;
  const comboAmount = isCombo
    ? parseInt(state.combo.amount.replace("₹", "").replace(",", ""))
    : 0;

  const adultFee = isCombo ? 0 : state.adultFee;
  const childFee = isCombo ? 0 : state.childFee;

  const totalAmount = isCombo
    ? comboAmount * members
    : adult * adultFee + child * childFee;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

  return (
    <>
      <Container
        fluid
        className="min-vh-90 d-flex align-items-center justify-content-center bg-light"
      >
        <div
          className="shadow-lg rounded overflow-hidden"
          style={{ width: "1100px", maxWidth: "95%" }}
        >
          <Row className="g-0">

            {/* LEFT SECTION */}
            <Col md={7} className="p-4 bg-white">
              <h5 className="fw-bold">Checkout</h5>
              <p className="text-muted small">
                Booking for <strong>{name}</strong>
              </p>

              <Form.Group className="mb-3">
                <Form.Label className="small">Trip Date</Form.Label>
                <Form.Control
                  size="sm"
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                />
              </Form.Group>

              {/* Ticket selection only for normal trips */}
              {!isCombo && (
                <Row className="mb-3">
                  <Col>
                    <TicketCounter
                      label="Adults"
                      price={adultFee}
                      count={adult}
                      setCount={setAdult}
                      min={1}
                    />
                  </Col>
                  <Col>
                    <TicketCounter
                      label="Children"
                      price={childFee}
                      count={child}
                      setCount={setChild}
                    />
                  </Col>
                </Row>
              )}

              <PhoneVerification
                compact
                onVerify={setPhoneVerified}
                setPhone={setUserPhone}
              />
              <div className="mt-2">
                <EmailVerification
                  compact
                  onVerify={setEmailVerified}
                  setEmail={setUserEmail}
                />
              </div>
            </Col>

            {/* RIGHT SECTION */}
            <Col
              md={5}
              className="p-4 text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb, #1e40af)",
              }}
            >
              <h6 className="fw-bold mb-3">Payment Summary</h6>

              {isCombo && (
                  <TicketCounter
                    label="Members"
                    price={comboAmount}
                    count={members}
                    setCount={setMembers}
                    min={1}
                  />
                ) }

              <hr className="opacity-25 my-2" />

              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <p className="small opacity-75 mt-2">
                Date: {tripDate || "—"}
              </p>

              <RazorpayPayment
                amount={totalAmount}
                disabled={!tripDate || !emailVerified || !phoneVerified}
                bookingData={{
                  bookingType: isCombo ? "combo" : "normal",
                  placeName: name,
                  comboDetails: isCombo ? state.combo : null,
                  userEmail,
                  userPhone,
                  adultCount: isCombo ? null : adult,
                  childCount: isCombo ? null : child,
                  tripDate,
                }}
                onSuccess={() =>
                  showToast("✅ Payment & Booking Successful!", "success")
                }
                onError={(msg) =>
                  showToast("❌ Payment failed: " + msg, "error")
                }
              />

            </Col>

          </Row>
        </div>
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.type === "success" ? "success" : "danger"}
          onClose={() => setToast({ ...toast, show: false })}
          delay={4000}
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
