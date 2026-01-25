import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { useState } from "react";

const StripePayment = ({
  amount,
  disabled,
  bookingData, // new prop: { placeName, userEmail, userPhone, adultCount, childCount, tripDate, emailVerified, phoneVerified }
  onSuccess,   // optional callback
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (!amount || amount <= 0) return alert("Invalid amount");

    setLoading(true);

    try {
      // 1️⃣ Create Payment Intent
      const res = await fetch("http://localhost:5000/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");
      const { clientSecret } = await res.json();

      // 2️⃣ Confirm Payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setLoading(false);
        return alert("❌ Payment failed: " + result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        // 3️⃣ Save booking to backend
        const bookingRes = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...bookingData, // <-- make sure all fields are here
            totalAmount: amount,
            payment: {
            paymentIntentId: result.paymentIntent.id,
            method: "card",
            status: "succeeded",
            },
        }),
        });


        if (!bookingRes.ok) {
          const errText = await bookingRes.text();
          throw new Error(errText || "Failed to save booking");
        }

        setLoading(false);
        alert("✅ Payment & Booking Successful!");

        if (onSuccess) onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <>
      <div className="bg-white p-3 rounded mt-3">
        <CardElement />
      </div>
      <Button
        className="w-100 mt-3"
        size="lg"
        disabled={disabled || loading}
        onClick={handlePay}
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </Button>
    </>
  );
};

export default StripePayment;
