//import express framework to create server and API
const express = require("express");
//import mongoose to connect the node js to MongoDB
const mongoose = require("mongoose");
//import bcryptjs to encrypt the password
const bcrypt=require("bcryptjs");
//import jsonwebtoken - jwt to create token
const jwt=require("jsonwebtoken");
//import cors for accept frontend request
const cors=require("cors");
//import googleOAuth
const { OAuth2Client } = require("google-auth-library");

//ADD Google client (below imports)
const client = new OAuth2Client(
  "878263761108-nnait908lmtn1v4copu10sqv75g9cb85.apps.googleusercontent.com"
);

//create express server - application
const app=express();
//allow server to read the JSON request
app.use(express.json());
//allow request from client
app.use(cors());

//mongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/tripBookingDb")
.then (()=>console.log("MongoDB connected"))

//create a model to interact with the connection
const User=mongoose.model("User",{
  name:String,
  email:String,
  password:{ type:String, default:null },
  googleId:{ type:String, default:null }
},"users");

// ====== NEW: Booking MODEL ======
const Booking = mongoose.model("Booking", {
  placeName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  adultCount: { type: Number, required: true, min: 1 },
  childCount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  payment: {
    upiId: { type: String },
    provider: { type: String }
  },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  bookingDate: { type: Date, default: Date.now }
});

//register API-POST Method
app.post("/register",async(req,res)=>{
    const {name,email,password}= req.body;

    const existing = await User.findOne({email});
    if(existing){
        return res.status(400).json({message:"Lavanya gopal, you already registered"});
    }

    const HashedPassword=await bcrypt.hash(password,10);

    await User.create({name, email, password:HashedPassword});
    res.json({message:"User added Successfully"});
});

//login API
app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const existing = await User.findOne({email});

    if(!existing){
        return res.status(404).json({message:"Email not found!"});
    }

    if(!existing.password){
        return res.status(400).json({message:"Use Google Login"});
    }

    const isMatch=await bcrypt.compare(password,existing.password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid Password! Try Again"});
    }
    
    const token = jwt.sign(
      { id: existing._id },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ token });
});

// ✅ GOOGLE LOGIN ROUTE
app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "878263761108-nnait908lmtn1v4copu10sqv75g9cb85.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ token: jwtToken });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google login failed" });
  }
});

// ====== NEW: CREATE BOOKING ======
app.post("/api/bookings", async (req,res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ message: "Booking successful", booking });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== NEW: GET BOOKINGS BY USER ======
app.get("/api/bookings/:email", async (req,res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email });
    res.json(bookings);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
