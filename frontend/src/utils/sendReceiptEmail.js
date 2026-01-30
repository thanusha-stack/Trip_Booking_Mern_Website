import emailjs from "emailjs-com";

export const sendReceiptEmail = async (receiptData) => {
  return emailjs.send(
    process.env.REACT_APP_EMAILJS_SERVICE_AUTO_ID,
    process.env.REACT_APP_EMAILJS_RECEIPT_TEMPLATE_AUTO_ID,
    {
      to_email: receiptData.email,
      user_name: receiptData.name,
      receipt_id: receiptData.receiptId,
      place_name: receiptData.placeName,
      total_amount: receiptData.totalAmount,
      trip_date: receiptData.tripDate,
    },
    process.env.REACT_APP_EMAILJS_AUTO_PUBLIC_KEY
  );
};
