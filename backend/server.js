// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const PORT= process.env.PORT || 5000;
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

// ===== APP CONFIG =====
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
    "http://localhost:3000",
    "https://mysore-tourism.onrender.com"
  ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ===== CONSTANTS =====
const SECRET = process.env.SECRET || "mysore-trip-booking-secret";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ===== OTP STORE (TEMP) =====
const otpStore = new Map(); // email → { otp, expires }
const twilio = require("twilio"); //phone verification
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const phoneOtpStore = new Map(); // phone → { otp, expires }

// ===== MONGODB =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error", err));

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

// ===== EMAIL CONFIG =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ===== AUTH =====
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Registered successfully", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    /*
      0 = disconnected
      1 = connected
      2 = connecting
      3 = disconnecting
    */

    res.json({
      backend: "RUNNING",
      mongodb:
        state === 1
          ? "CONNECTED"
          : state === 2
          ? "CONNECTING"
          : "NOT CONNECTED",
    });
  } catch (err) {
    res.status(500).json({ mongodb: "ERROR" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GOOGLE LOGIN =====
app.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, email_verified } = ticket.getPayload();
    if (!email_verified)
      return res.status(400).json({ message: "Google email not verified" });

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Google login failed" });
  }
});

// ===== STRIPE =====
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

// ===== BOOKINGS =====
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

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ message: "Booking saved", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== EMAIL OTP =====
app.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpStore.set(email, {
      otp: hashedOtp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    await transporter.sendMail({
      from: `"Booking App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP send failed" });
  }
});

app.post("/verify-email-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ success: false });

  if (Date.now() > record.expires)
    return res.status(400).json({ success: false, message: "OTP expired" });

  const isMatch = await bcrypt.compare(otp, record.otp);
  if (!isMatch)
    return res.status(400).json({ success: false, message: "Wrong OTP" });

  otpStore.delete(email);
  res.json({ success: true });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
