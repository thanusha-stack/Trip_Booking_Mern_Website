const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    tripDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    payment: {
        paymentIntentId: String, // Stripe
        razorpayOrderId: String, // Razorpay
        method: { type: String, enum: ["stripe", "razorpay"] },
        status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
