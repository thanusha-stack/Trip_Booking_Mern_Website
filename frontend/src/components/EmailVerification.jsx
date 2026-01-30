import { useState } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";
import emailjs from "emailjs-com";

const EmailVerification = ({ onVerify, setEmail: setParentEmail }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);

    setLoading(true);
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { email, otp: otpCode },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setOtpSent(true);
      alert("OTP sent to email");
    } catch (err) {
      alert("Failed to send OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setVerified(true);
      onVerify(true);
      setParentEmail(email);
      alert("Email verified");
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
                disabled={otpSent}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button size="sm" onClick={sendOtp} disabled={loading || otpSent}>
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
              <Button size="sm" variant="success" onClick={verifyOtp}>
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
