import { useState } from "react";
import { Form } from "react-bootstrap";

const PaymentDetails = ({ onPaymentChange }) => {
  const [upiId, setUpiId] = useState("");
  const [provider, setProvider] = useState("");

  const handleChange = () => {
    onPaymentChange({ upiId, provider });
  };

  return (
    <div className="p-3 rounded">
      <h5>Payment Details</h5>
      <Form.Group className="mb-3">
        <Form.Label>UPI ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="example@upi"
          value={upiId}
          onChange={(e) => {
            setUpiId(e.target.value);
            handleChange();
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>UPI Provider</Form.Label>
        <Form.Select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            handleChange();
          }}
        >
          <option value="">Select Provider</option>
          <option value="GPay">GPay</option>
          <option value="Paytm">Paytm</option>
          <option value="PhonePe">PhonePe</option>
        </Form.Select>
      </Form.Group>
    </div>
  );
};

export default PaymentDetails;
