// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Stripe = require("stripe");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

// ===== CONFIG =====
const SECRET = process.env.SECRET || "mysore-trip-booking-secret";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());

// ===== CORS & COOP HEADERS =====
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ===== MONGODB =====
mongoose
  .connect("mongodb://127.0.0.1:27017/tripBookingDb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ===== MODELS =====
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: { type: String, default: null },
});

const Booking = mongoose.model("Booking", {
  placeName: String,
  userEmail: String,
  userPhone: String,
  adultCount: Number,
  childCount: Number,
  totalAmount: Number,
  tripDate: Date,
  payment: {
    paymentIntentId: String,
    method: String,
    status: String,
  },
  emailVerified: Boolean,
  phoneVerified: Boolean,
  createdAt: { type: Date, default: Date.now },
});

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ----- AUTH: REGISTER -----
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
  res.json({ message: "Registered successfully", token, user });
});

// ----- AUTH: LOGIN -----
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
  res.json({ token, user });
});

// ----- GOOGLE LOGIN / REGISTER -----
app.post("/google-login", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, email_verified } = payload;

    if (!email_verified)
      return res.status(400).json({ message: "Email not verified by Google" });

    let user = await User.findOne({ email });
    if (!user) {
      // Register new Google user
      user = await User.create({ name, email, password: null });
    }

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
});

// ----- STRIPE PAYMENT -----
app.post("/api/payment/create-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const intent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- BOOKINGS -----
// GET bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST booking
app.post("/api/bookings", async (req, res) => {
  try {
    const bookingData = req.body;
    const booking = await Booking.create(bookingData);
    res.status(200).json({ message: "Booking saved successfully!", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== START SERVER =====
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
