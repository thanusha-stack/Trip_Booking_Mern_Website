const express = require("express");
const router = express.Router();
const { register, login, googleLogin, getMe, addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/me", authMiddleware, getMe);
router.post("/wishlist/:tripId", authMiddleware, addToWishlist);
router.delete("/wishlist/:tripId", authMiddleware, removeFromWishlist);
router.get("/wishlist", authMiddleware, getWishlist);

module.exports = router;
