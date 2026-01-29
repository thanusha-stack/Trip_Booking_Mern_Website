// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

// ===== APP CONFIG =====
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mysore-tourism.onrender.com",
      "https://trip-booking-mern-website.onrender.com",
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
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// ===== RAZORPAY =====
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===== OTP STORES =====
const otpStore = new Map(); // email → { otp, expires }

// ===== MONGODB =====
mongoose
  .connect(process.env.MONGO_URI)
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

// ===== EMAIL CONFIG (FIXED + DEBUG) =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-char Gmail App Password
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Email transporter error:", err);
  } else {
    console.log("✅ Email transporter ready");
  }
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
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  } catch {
    res.status(500).json({ message: "Google login failed" });
  }
});

// ===== RAZORPAY ORDER =====
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== BOOKINGS =====
app.get("/api/bookings", async (req, res) => {
  const { userEmail } = req.query;
  const filter = userEmail ? { userEmail } : {};
  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  res.json({ bookings });
});

app.post("/api/bookings", async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json({ booking });
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
    console.error("OTP error:", err);
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
  console.log(`🚀 Server running on port ${PORT}`);
});
