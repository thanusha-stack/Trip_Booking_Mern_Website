import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const PaymentDetails = ({ onPaymentChange = () => {}, compact }) => {
  const [upiId, setUpiId] = useState("");
  const [provider, setProvider] = useState("gpay");

  const submitUpi = () => {
    // Only call onPaymentChange if it's a function
    if (typeof onPaymentChange === "function") {
      onPaymentChange({ upiId, provider });
    }
  };

  return (
    <div>
      <Form.Label className="small fw-semibold mb-1">UPI Payment</Form.Label>

      {/* Provider as radio buttons */}
      <div className="mb-2">
        <Form.Check
          inline
          label="Google Pay"
          name="upiProvider"
          type="radio"
          id="gpay"
          value="gpay"
          checked={provider === "gpay"}
          onChange={(e) => setProvider(e.target.value)}
        />
        <Form.Check
          inline
          label="PhonePe"
          name="upiProvider"
          type="radio"
          id="phonepe"
          value="phonepe"
          checked={provider === "phonepe"}
          onChange={(e) => setProvider(e.target.value)}
        />
        <Form.Check
          inline
          label="Paytm"
          name="upiProvider"
          type="radio"
          id="paytm"
          value="paytm"
          checked={provider === "paytm"}
          onChange={(e) => setProvider(e.target.value)}
        />
      </div>

      {/* UPI ID */}
      <Row className="g-1">
        <Col md={8}>
          <Form.Control
            size="sm"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Button
            size="sm"
            variant="dark"
            className="w-100"
            onClick={submitUpi}
          >
            Verify
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentDetails;
