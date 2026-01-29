import { useState } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";

const EmailVerification = ({ onVerify, setEmail: setParentEmail }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      setOtpSent(true);
      alert("OTP sent to email");
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error();

      setVerified(true);
      onVerify(true);
      setParentEmail(email);
      alert("Email verified");
    } catch {
      alert("Invalid OTP");
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
                disabled={otpSent}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button
                size="sm"
                onClick={sendOtp}
                disabled={loading || otpSent}
              >
                {otpSent ? "Sent" : "Send OTP"}
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
                onClick={verifyOtp}
                disabled={loading}
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
