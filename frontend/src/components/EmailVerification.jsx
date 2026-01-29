import { useState } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";

const EmailVerification = ({ onVerify, setEmail: setParentEmail }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const sendOtp = async () => {
  if (!email) return alert("Enter email");

  await fetch(`${process.env.REACT_API_URI}/send-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  alert("OTP sent to email");
};


  const verifyOtp = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/verify-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });

  if (res.ok) {
    setVerified(true);
    onVerify(true);
    setParentEmail(email);
  } else {
    alert("Invalid OTP");
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
