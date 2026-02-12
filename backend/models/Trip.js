const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    destination: { type: String, required: true },
    price: {
        adult: { type: Number, required: true },
        child: { type: Number, required: true }
    },
    pickUpTime: { type: String, required: true },
    dropTime: { type: String, required: true },
    duration: {
        type: String,
        required: true,
        enum: ["1 day", "2 days", "3 days", "4 days", "5+ days"]
    },
    itinerary: [{
        day: Number,
        activities: [String]
    }],
    images: [String],
    availableDates: [Date],
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: { type: String, default: "Combo" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trip", tripSchema);
