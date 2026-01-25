import { useState } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";

const EmailVerification = ({ onVerify, setEmail: setParentEmail }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const sendOtp = () => {
    if (!email) return alert("Enter email");
    const gen = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(gen);
    alert(`OTP: ${gen}`);
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setVerified(true);
      onVerify(true);           // sets emailVerified in parent
      setParentEmail(email);    // sets userEmail in parent Booking page
    } else {
      alert("Wrong OTP");
    }
  };

  return (
    <div>
      <Form.Label className="small fw-semibold mb-1">
        Email Verification{" "}
        {verified && <Badge bg="success">Verified</Badge>}
      </Form.Label>

      {!verified && (
        <>
          <Row className="g-1 mb-1">
            <Col md={8}>
              <Form.Control
                size="sm"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

export default EmailVerification;
