import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

const PhoneVerification = ({ onVerify }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const sendOtp = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(generatedOtp);
    alert(`OTP sent: ${generatedOtp}`); // Demo only
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setVerified(true);
      onVerify(true);
      alert("Phone verified successfully!");
    } else {
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="p-3 rounded mb-3">
      {!verified ? (
        <>
          <Form.Group className="mb-2">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Button className="mb-2" onClick={sendOtp}>
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

          <Button variant="success" onClick={verifyOtp}>
            Verify OTP
          </Button>
        </>
      ) : (
        <p className="text-success fw-bold">Phone Verified ✅</p>
      )}
    </div>
  );
};

export default PhoneVerification;
