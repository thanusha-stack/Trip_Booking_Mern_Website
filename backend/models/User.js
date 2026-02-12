const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  role: { 
    type: String, 
    enum: ["tourist", "organizer", "admin"], 
    default: "tourist" 
  },
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Trip" 
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
