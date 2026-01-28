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
        "https://mysore-tourism.onrender.com/api/razorpay/create-order",
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
        name: "TripBooking",
        description: bookingData.placeName,
        order_id: order.id,

        handler: async function (response) {
          // save booking
          await fetch(
            "https://mysore-tourism.onrender.com/api/bookings",
            {
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
            }
          );

          onSuccess();
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
      onError(err.message);
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
