import { sendReceiptEmail } from "../utils/sendReceiptEmail";

const RazorpayPayment = ({
  amount,
  disabled,
  bookingData,
  onSuccess,
  onError,
}) => {
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Trip Marketplace",
        description: bookingData.tripName || "Trip Booking",
        order_id: order.id,

        handler: async function (response) {
          try {
            const bookingResponse = await fetch("/api/bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                ...bookingData,
                payment: {
                  ...bookingData.payment,
                  razorpayOrderId: response.razorpay_order_id,
                  paymentIntentId: response.razorpay_payment_id,
                }
              }),
            });

            if (!bookingResponse.ok) throw new Error("Failed to save booking");

            // Send receipt email using EmailJS
            try {
              await sendReceiptEmail({
                email: bookingData.userEmail,
                name: bookingData.userName,
                receiptId: response.razorpay_payment_id,
                placeName: bookingData.tripName,
                totalAmount: amount,
                tripDate: bookingData.tripDate,
              });
            } catch (emailErr) {
              console.warn("Receipt email failed but booking was saved:", emailErr);
            }

            onSuccess();
          } catch (err) {
            console.error("Post-payment error:", err);
            onError("Payment succeeded, but failed to save booking record");
          }
        },

        prefill: {
          email: "", // User will fill if not provided
          contact: "",
        },

        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      onError(err.message || "Payment initialization failed");
    }
  };

  return (
    <button
      className="btn btn-primary w-100 py-3 fw-bold fs-5 shadow-sm"
      style={{ borderRadius: "10px" }}
      disabled={disabled}
      onClick={handlePayment}
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;
