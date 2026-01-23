const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  tripId: {
    type: String,
    required: true   // comes from JSON
  },

  tripName: String,
  source: String,
  destination: String,

  travelDate: {
    type: Date,
    required: true
  },

  seats: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  bookingStatus: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED"],
    default: "CONFIRMED"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
