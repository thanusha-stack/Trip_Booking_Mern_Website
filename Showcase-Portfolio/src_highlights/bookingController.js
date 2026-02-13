const Booking = require("../models/Booking");
const Trip = require("../models/Trip");

exports.createBooking = async (req, res) => {
    try {
        const { tripId, adultCount, childCount, totalAmount, tripDate, payment } = req.body;

        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        const booking = await Booking.create({
            tripId,
            touristId: req.user.id,
            organizerId: trip.organizerId,
            adultCount,
            childCount,
            totalAmount,
            tripDate,
            payment,
            status: payment.status === "paid" ? "confirmed" : "pending"
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTouristBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ touristId: req.user.id })
            .populate("tripId")
            .populate("organizerId", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrganizerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ organizerId: req.user.id })
            .populate("tripId")
            .populate("touristId", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Only organizer of this trip or admin can update status
        if (booking.organizerId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
