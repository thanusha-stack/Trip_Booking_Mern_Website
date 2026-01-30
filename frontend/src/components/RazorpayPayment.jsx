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
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      const order = await res.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Mysore Tourism",
        description: bookingData.placeName,
        order_id: order.id,

        handler: async function (response) {
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/bookings`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...bookingData,
                totalAmount: amount,
                payment: {
                  paymentIntentId: response.razorpay_payment_id,
                  method: "razorpay",
                  status: "success",
                },
                emailVerified: true,
                phoneVerified: true,
              }),
            });

            await sendReceiptEmail({
              email: bookingData.userEmail,    
              name: bookingData.placeName,       
              receiptId: bookingData.receiptId,
              placeName: bookingData.placeName,
              totalAmount: amount,
              tripDate: bookingData.tripDate,
            });

            onSuccess();
          } catch (err) {
            console.error("Post-payment error:", err);
            onError("Payment succeeded, but email failed");
          }
        },

        prefill: {
          email: bookingData.userEmail,
          contact: bookingData.userPhone,
        },

        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      onError(err.message || "Payment failed");
    }
  };

  return (
    <button
      className="btn btn-light w-100 mt-3 fw-bold"
      disabled={disabled}
      onClick={handlePayment}
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;
