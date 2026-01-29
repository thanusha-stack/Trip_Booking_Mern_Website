import { useState } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";

const EmailVerification = ({ onVerify, setEmail: setParentEmail }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      alert("OTP sent to email");
    } catch (err) {
      alert("Error sending OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        throw new Error("Invalid OTP");
      }

      setVerified(true);
      onVerify(true);
      setParentEmail(email);
      alert("Email verified successfully");
    } catch (err) {
      alert("Invalid OTP");
      console.error(err);
    } finally {
      setLoading(false);
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
              <Button
                size="sm"
                className="w-100"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
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
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default EmailVerification;
