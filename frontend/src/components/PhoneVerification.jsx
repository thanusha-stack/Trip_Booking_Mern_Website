import { useState } from "react";
import { Form, Badge } from "react-bootstrap";

const PhoneVerification = ({ setPhone, onVerify }) => {
  const [phone, setLocalPhone] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setLocalPhone(value);
    setPhone("+91" + value);   // ✅ send to parent
    onVerify(true);            // ✅ mark as verified
  };

  return (
    <div className="mt-2">
      <Form.Label className="small fw-semibold mb-1">
        Phone Number <Badge bg="success">Saved</Badge>
      </Form.Label>

      <Form.Control
        size="sm"
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={handleChange}
      />
    </div>
  );
};

export default PhoneVerification;
