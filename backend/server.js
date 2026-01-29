// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const { OAuth2Client } = require("google-auth-library");

// Load environment variables FIRST
require("dotenv").config();

// ===== APP CONFIG =====
const app = express();
const PORT = process.env.PORT || 5000;

// Log environment for debugging
console.log("🚀 Environment:", process.env.NODE_ENV || "development");
console.log("📧 Email configured:", !!(process.env.BREVO_SMTP_LOGIN && process.env.BREVO_SMTP_KEY));

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

// ===== HEADERS (Google Login Fix) =====
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

// ===== OTP STORE =====
const otpStore = new Map();

// ===== MONGODB =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

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

// ===== EMAIL CONFIG (PRODUCTION READY) =====
let transporter;

// Function to create transporter with fallback
const createTransporter = () => {
  console.log("📧 Configuring email transporter...");
  
  // Check if we have Brevo credentials
  if (process.env.BREVO_SMTP_LOGIN && process.env.BREVO_SMTP_KEY) {
    console.log("📧 Using Brevo SMTP");
    return nodemailer.createTransport({
      host: "smtp.brevo.com",  // Changed from smtp-relay.brevo.com
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
      },
      tls: {
        rejectUnauthorized: false  // Allow self-signed certificates
      }
    });
  } else {
    console.log("⚠️ Brevo credentials missing, email will not work");
    return null;
  }
};

// Initialize transporter
transporter = createTransporter();

// Verify transporter
if (transporter) {
  transporter.verify()
    .then(() => console.log("✅ Email transporter ready"))
    .catch((err) => {
      console.error("❌ Email transporter error:", err.message);
      console.error("Check BREVO_SMTP_LOGIN and BREVO_SMTP_KEY in Render environment variables");
    });
}

// ===== HEALTH CHECK ENDPOINTS =====
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Server is running!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    email: transporter ? "configured" : "not configured",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

app.get("/env-check", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    hasBrevoLogin: !!process.env.BREVO_SMTP_LOGIN,
    hasBrevoKey: !!process.env.BREVO_SMTP_KEY,
    hasMongoUri: !!process.env.MONGO_URI,
    port: process.env.PORT || 5000
  });
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
    console.error("Register error:", err);
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
    console.error("Login error:", err);
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
    console.error("Google login error:", err);
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
    console.error("Razorpay error:", err);
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
    console.error("Bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== EMAIL OTP (FIXED VERSION) =====
app.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log("📧 OTP request for:", email);
    console.log("Environment:", process.env.NODE_ENV);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email required" 
      });
    }

    // Check if email transporter is configured
    if (!transporter) {
      console.error("❌ Email transporter not configured");
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Check server logs.",
        debug: "Transporter not initialized. Check BREVO credentials."
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpStore.set(email, {
      otp: hashedOtp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    console.log("📤 Sending OTP email...");

    // IMPORTANT: Use a verified sender email
    const mailOptions = {
      from: '"Trip Booking" <noreply@tripbooking.com>', // CHANGE THIS to your verified Brevo sender
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully:", info.messageId);
    
    res.json({ 
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.error("❌ OTP Error Details:");
    console.error("- Message:", err.message);
    console.error("- Code:", err.code);
    console.error("- Response:", err.response);
    
    res.status(500).json({ 
      success: false, 
      message: "OTP send failed",
      error: err.message,
      code: err.code
    });
  }
});

app.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record)
      return res.status(400).json({ success: false, message: "OTP not found or expired" });

    if (Date.now() > record.expires)
      return res.status(400).json({ success: false, message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Wrong OTP" });

    otpStore.delete(email);
    res.json({ success: true });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});