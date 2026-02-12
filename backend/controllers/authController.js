const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const SECRET = process.env.SECRET || "mysore-trip-booking-secret";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Register Request Body:", req.body);

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = password ? await bcrypt.hash(password, 10) : null;
        const user = await User.create({
            name,
            email,
            password: hashed,
            role: role || "tourist"
        });

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "Please login with Google" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, email_verified } = ticket.getPayload();
        if (!email_verified) {
            return res.status(400).json({ message: "Google email not verified" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, role: "tourist" });
        }

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ message: "Google login failed" });
    }
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};

// @desc    Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.wishlist.includes(req.params.tripId)) {
            user.wishlist.push(req.params.tripId);
            await user.save();
        }
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.tripId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
