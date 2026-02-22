const Trip = require("../models/Trip");

exports.createTrip = async (req, res) => {
    try {
        const tripData = {
            ...req.body,
            organizerId: req.user.id
        };
        const trip = await Trip.create(tripData);
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const { destination, duration, minPrice, maxPrice, category, organizerId } = req.query;
        let query = {};

        if (destination) query.destination = new RegExp(destination, "i");
        if (duration) query.duration = duration;
        if (category) query.category = category;
        if (organizerId) query.organizerId = organizerId;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const trips = await Trip.find(query).populate("organizerId", "name email");
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate("organizerId", "name email");
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        if (trip.organizerId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update this trip" });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTrip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        if (trip.organizerId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this trip" });
        }

        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
