const express = require("express");
const router = express.Router();
const {
    createBooking,
    getTouristBookings,
    getOrganizerBookings,
    updateBookingStatus
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Tourist specific routes
router.post("/", authMiddleware, roleMiddleware(["tourist"]), createBooking);
router.get("/my-bookings", authMiddleware, roleMiddleware(["tourist"]), getTouristBookings);

// Organizer specific routes
router.get("/organizer-bookings", authMiddleware, roleMiddleware(["organizer", "admin"]), getOrganizerBookings);
router.patch("/:id/status", authMiddleware, roleMiddleware(["organizer", "admin"]), updateBookingStatus);

module.exports = router;
