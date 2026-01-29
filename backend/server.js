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
console.log("🗄️ MongoDB URI exists:", !!process.env.MONGO_URI);

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mysore-tourism.onrender.com",
      "https://trip-booking-mern-website.onrender.com",
      "http://localhost:5173", // Added for Vite/React dev server
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

// ===== MONGODB CONNECTION (FIXED) =====
const connectDB = async () => {
  try {
    console.log("🔗 Attempting MongoDB connection...");
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    // Remove deprecated options for newer Mongoose
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ MongoDB connected successfully");
    
    // Monitor connection state
    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });
    
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("❌ Please check:");
    console.error("   1. MONGO_URI in Render environment variables");
    console.error("   2. MongoDB Atlas IP whitelist includes 0.0.0.0/0");
    console.error("   3. MongoDB Atlas cluster is running");
    
    // Don't crash the server, but log the error
    setTimeout(connectDB, 5000); // Try again in 5 seconds
  }
};

// Start DB connection
connectDB();

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

// ===== EMAIL CONFIG (PRODUCTION READY - BREVO) =====
let transporter;

const createTransporter = () => {
  console.log("📧 Configuring Brevo email transporter...");
  
  // Check credentials
  const hasBrevoLogin = !!process.env.BREVO_SMTP_LOGIN;
  const hasBrevoKey = !!process.env.BREVO_SMTP_KEY;
  
  console.log("🔍 Brevo Credentials Check:");
  console.log("   - SMTP Login:", hasBrevoLogin ? "✓ Set" : "✗ Missing");
  console.log("   - SMTP Key:", hasBrevoKey ? "✓ Set" : "✗ Missing");
  
  if (!hasBrevoLogin || !hasBrevoKey) {
    console.error("❌ Missing Brevo credentials. Emails will not work.");
    console.error("   Add to Render: BREVO_SMTP_LOGIN and BREVO_SMTP_KEY");
    return null;
  }
  
  console.log("📧 Using Brevo SMTP with login:", process.env.BREVO_SMTP_LOGIN);
  
  const config = {
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_KEY,
    },
    tls: {
      // Important for Render's network
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
  };
  
  return nodemailer.createTransport(config);
};

// Initialize transporter
transporter = createTransporter();

// Verify transporter with retry logic
const verifyTransporter = () => {
  if (!transporter) {
    console.error("❌ Transporter not created. Check Brevo credentials.");
    return;
  }
  
  transporter.verify()
    .then(() => {
      console.log("✅ Brevo email transporter ready");
      console.log("   Host: smtp-relay.brevo.com");
      console.log("   Port: 587");
      console.log("   Auth: Using provided credentials");
    })
    .catch((err) => {
      console.error("❌ Brevo verification failed:", err.message);
      console.error("❌ Error code:", err.code);
      console.error("❌ Common solutions:");
      console.error("   1. Check BREVO_SMTP_KEY in Render (get from Brevo → SMTP & API)");
      console.error("   2. Try port 465 with secure: true");
      console.error("   3. Check IP whitelist in Brevo");
      
      // Try alternative configuration
      console.log("🔄 Trying alternative Brevo configuration...");
      setTimeout(() => {
        transporter = nodemailer.createTransport({
          host: "smtp.brevo.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.BREVO_SMTP_LOGIN,
            pass: process.env.BREVO_SMTP_KEY,
          }
        });
        verifyTransporter();
      }, 2000);
    });
};

// Wait a bit then verify
setTimeout(verifyTransporter, 1000);

// ===== HEALTH CHECK ENDPOINTS =====
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({ 
    message: "🚀 Server is running!",
    environment: process.env.NODE_ENV || "development",
    database: dbStates[dbStatus] || "unknown",
    email: transporter ? "configured" : "not configured",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  
  res.json({
    status: dbStatus === 1 ? "healthy" : "degraded",
    database: dbStatus === 1 ? "connected" : "disconnected",
    databaseCode: dbStatus,
    email: transporter ? "configured" : "not configured",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/env-check", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    hasBrevoLogin: !!process.env.BREVO_SMTP_LOGIN,
    hasBrevoKey: !!process.env.BREVO_SMTP_KEY,
    hasMongoUri: !!process.env.MONGO_URI,
    mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
    port: process.env.PORT || 5000,
    databaseState: mongoose.connection.readyState
  });
});

// ===== DATABASE MIDDLEWARE =====
const checkDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database temporarily unavailable. Please try again.",
      error: "Database not connected",
      databaseState: mongoose.connection.readyState
    });
  }
  next();
};

// ===== AUTH =====
app.post("/register", checkDatabase, async (req, res) => {
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

app.post("/login", checkDatabase, async (req, res) => {
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
app.post("/google-login", checkDatabase, async (req, res) => {
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
app.get("/api/bookings", checkDatabase, async (req, res) => {
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

app.post("/api/bookings", checkDatabase, async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== EMAIL OTP (WITH DATABASE CHECK) =====
app.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log("📧 OTP request for:", email);
    console.log("📊 Database state:", mongoose.connection.readyState);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email required" 
      });
    }

    if (!transporter) {
      console.error("❌ Email transporter not configured");
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Check server logs.",
        debug: "Transporter not initialized"
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpStore.set(email, {
      otp: hashedOtp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    console.log("📤 Sending OTP email...");

    // USE YOUR VERIFIED SENDER
    const mailOptions = {
      from: '"Mysoe Tourism" <thanusha13062006@gmail.com>',
      to: email,
      subject: "Your OTP Verification Code - Mysoe Tourism",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Mysoe Tourism OTP Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password for verification is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Best regards,<br>
            Mysoe Tourism Team<br>
            thanusha13062006@gmail.com
          </p>
        </div>
      `
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
    console.error("- Command:", err.command);
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

// ===== DATABASE DIAGNOSTICS =====
app.get("/db-status", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    state: state,
    stateName: states[state] || "unknown",
    mongoUriExists: !!process.env.MONGO_URI,
    mongoUriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + "..." : "none",
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ MongoDB State: ${mongoose.connection.readyState}`);
  console.log(`📧 Brevo Configured: ${!!transporter}`);
});