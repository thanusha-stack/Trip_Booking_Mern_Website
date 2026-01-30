import { Card, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import emailjs from "emailjs-com";
import QRCode from "qrcode";

const PriceSummary = ({
  placeName,
  totalAmount,
  emailVerified,
  userName,
  userEmail,
  adult,
  child,
  upiProvider,
  upiId,
}) => {

  const handlePayment = async () => {
    if (!emailVerified) {
      alert("Please verify your email first");
      return;
    }

    alert(`Payment of ₹${totalAmount} successful!`);

    const doc = new jsPDF();
    const receiptId = `MYT-${Date.now()}`;
    const date = new Date().toLocaleString();

    /* ================= HEADER ================= */
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("Mysore", 20, 20);

    doc.setTextColor(13, 110, 253); // bootstrap primary
    doc.text("Tourism", 55, 20);

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Official Payment Receipt", 20, 28);

    doc.line(20, 32, 190, 32);

    /* ================= RECEIPT INFO ================= */
    doc.setFontSize(11);
    doc.text(`Receipt ID: ${receiptId}`, 20, 42);
    doc.text(`Date: ${date}`, 20, 50);

    /* ================= CUSTOMER DETAILS ================= */
    doc.setFontSize(13);
    doc.text("Customer Details", 20, 62);
    doc.line(20, 64, 190, 64);

    doc.setFontSize(11);
    doc.text(`Name: ${userName}`, 20, 74);
    doc.text(`Email: ${userEmail}`, 20, 82);

    /* ================= BOOKING DETAILS ================= */
    doc.setFontSize(13);
    doc.text("Booking Details", 20, 96);
    doc.line(20, 98, 190, 98);

    doc.setFontSize(11);
    doc.text(`Place: ${placeName}`, 20, 108);
    doc.text(`Adults: ${adult}`, 20, 116);
    doc.text(`Children: ${child}`, 20, 124);
    doc.text(`Payment Method: ${upiProvider}`, 20, 132);

    /* ================= TOTAL BOX ================= */
    doc.setDrawColor(0);
    doc.rect(20, 140, 170, 18);

    doc.setFontSize(14);
    doc.text(`Total Paid: ₹${totalAmount}`, 25, 152);

    /* ================= QR CODE ================= */
    const qrData = `
Receipt ID: ${receiptId}
Name: ${userName}
Amount: ₹${totalAmount}
Place: ${placeName}
    `;

    const qrImage = await QRCode.toDataURL(qrData);
    doc.addImage(qrImage, "PNG", 145, 40, 35, 35);

    /* ================= FOOTER ================= */
    doc.setFontSize(10);
    doc.text(
      "Thank you for booking with Mysore Tourism.",
      20,
      170
    );
    doc.text(
      "This is a system-generated receipt. No signature required.",
      20,
      178
    );

    /* ================= SEND EMAIL ================= */
    const pdfBase64 = doc.output("datauristring");

    try {
  await emailjs.send(
    process.env.REACT_APP_EMAILJS_SERVICE_ID,
    process.env.REACT_APP_EMAILJS_RECEIPT_TEMPLATE_ID,
    {
      to_email: userEmail,
      user_name: userName,
      receipt_id: receiptId,
      amount: totalAmount,
      place_name: placeName,
      message: "You can view your receipt anytime from your profile page."
    },
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  );

  alert("📧 Receipt confirmation sent to your email!");
} catch (err) {
  console.error(err);
  alert("Email sending failed");
}

    doc.save(`MysoreTourism_Receipt_${receiptId}.pdf`);
  };

  return (
    <Card className="p-4 shadow">
      <h4>Mysore <span className="text-primary">Tourism</span></h4>
      <hr />
      <h5>Total: ₹{totalAmount}</h5>

      <Button
        className="mt-3 w-100"
        size="lg"
        variant="dark"
        disabled={!emailVerified}
        onClick={handlePayment}
      >
        Pay ₹{totalAmount}
      </Button>
    </Card>
  );
};

export default PriceSummary;
