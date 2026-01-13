import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const EmailVerification = ({ onVerify }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const sendOtp = () => {
    if (!email) return alert("Please enter an email first!");
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(generatedOtp);
    alert(`OTP sent to ${email}: ${generatedOtp}`); // For demo only
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setVerified(true);
      onVerify(true);
      alert("Email verified successfully!");
    } else {
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="p-3 mb-1">
      <h5>Account Verification</h5>

      {!verified ? (
        <>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button className="mb-2 me-2" onClick={sendOtp} variant="primary">
            Send OTP
          </Button>

          <Form.Group className="mb-2">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>

          <Button onClick={verifyOtp} variant="success">
            Verify OTP
          </Button>
        </>
      ) : (
        <p className="text-success fw-bold">Email Verified ✅</p>
      )}
    </div>
  );
};

export default EmailVerification;
