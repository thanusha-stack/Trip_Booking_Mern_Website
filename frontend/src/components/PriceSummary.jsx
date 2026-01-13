import { Card, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";

const PriceSummary = ({ placeName, totalAmount, emailVerified, userName, adult, child, upiProvider, upiId }) => {

  const handlePayment = () => {
    if (!emailVerified) return;

    // Simulate payment success
    alert(`Payment of ₹${totalAmount} successful!`);

    // Generate PDF receipt
    const doc = new jsPDF();
    const date = new Date();
    const badge = Math.floor(100000 + Math.random() * 900000); // random 6-digit badge

    doc.setFontSize(18);
    doc.text("Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 20, 40);
    doc.text(`Place: ${placeName}`, 20, 50);
    doc.text(`Adults: ${adult}  |  Children: ${child}`, 20, 60);
    doc.text(`Total Amount: ₹${totalAmount}`, 20, 70);
    doc.text(`Payment Method: ${upiProvider} (${upiId})`, 20, 80);
    doc.text(`Badge ID: ${badge}`, 20, 90);
    doc.text(`Date & Time: ${date.toLocaleString()}`, 20, 100);

    doc.save(`Receipt_${badge}.pdf`);
  };

  return (
    <Card className="p-4">
      <h4>{placeName}</h4>
      <hr />

      <h5>Total: ₹{totalAmount}</h5>

      <Button
        variant="dark"
        size="lg"
        className="mt-3 w-100"
        disabled={!emailVerified || !upiId}
        onClick={handlePayment}
      >
        Pay ₹{totalAmount}
      </Button>

      {!emailVerified && (
        <small className="text-danger">
          Verify email and phone to continue
        </small>
      )}

      {!upiId && (
        <small className="text-danger d-block mt-1">
          Enter UPI details to continue
        </small>
      )}
    </Card>
  );
};

export default PriceSummary;
