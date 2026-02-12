const express = require("express");
const router = express.Router();
const {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getAllTrips);
router.get("/:id", getTripById);

// Protected routes (Organizers and Admins)
router.post("/", authMiddleware, roleMiddleware(["organizer", "admin"]), createTrip);
router.put("/:id", authMiddleware, roleMiddleware(["organizer", "admin"]), updateTrip);
router.delete("/:id", authMiddleware, roleMiddleware(["organizer", "admin"]), deleteTrip);

module.exports = router;
