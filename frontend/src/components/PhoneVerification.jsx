import { useState } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";

const PhoneVerification = ({ onVerify, setPhone: setParentPhone }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const sendOtp = () => {
    if (!phone) return alert("Enter phone");
    const gen = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(gen);
    alert(`OTP: ${gen}`);
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setVerified(true);
      onVerify(true);           // sets phoneVerified in parent
      setParentPhone(phone);    // sets userPhone in parent Booking page
    } else {
      alert("Wrong OTP");
    }
  };

  return (
    <div className="mt-2">
      <Form.Label className="small fw-semibold mb-1">
        Phone Verification{" "}
        {verified && <Badge bg="success">Verified</Badge>}
      </Form.Label>

      {!verified && (
        <>
          <Row className="g-1 mb-1">
            <Col md={8}>
              <Form.Control
                size="sm"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button size="sm" className="w-100" onClick={sendOtp}>
                Send OTP
              </Button>
            </Col>
          </Row>

          <Row className="g-1">
            <Col md={8}>
              <Form.Control
                size="sm"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button
                size="sm"
                variant="success"
                className="w-100"
                onClick={verifyOtp}
              >
                Verify
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default PhoneVerification;
