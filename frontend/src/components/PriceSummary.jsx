import { Card, Button } from "react-bootstrap";

const PriceSummary = ({
  placeName,
  totalAmount,
  emailVerified,
  onPay,          // 🔑 payment trigger from parent
}) => {
  const handleClick = () => {
    if (!emailVerified) {
      alert("Please verify your email first");
      return;
    }

    onPay(); // 🔥 Razorpay / payment handled outside
  };

  return (
    <Card className="p-4 shadow">
      <h4 className="fw-bold">
        Mysore <span className="text-primary">Tourism</span>
      </h4>

      <hr />

      <div className="d-flex justify-content-between mb-2">
        <span>Booking</span>
        <strong>{placeName}</strong>
      </div>

      <div className="d-flex justify-content-between fs-5 fw-bold">
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>

      <Button
        className="mt-4 w-100"
        size="lg"
        variant="dark"
        disabled={!emailVerified}
        onClick={handleClick}
      >
        Pay ₹{totalAmount}
      </Button>

      {!emailVerified && (
        <p className="text-danger small mt-2 text-center">
          Verify email to proceed with payment
        </p>
      )}
    </Card>
  );
};

export default PriceSummary;
