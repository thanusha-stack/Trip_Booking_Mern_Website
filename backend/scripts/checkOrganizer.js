const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");

const checkOrganizer = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const organizer = await User.findOne({ role: "organizer" });
        if (organizer) {
            console.log(`✅ Organizer found: ${organizer.name} (${organizer.email})`);
        } else {
            console.log("❌ No organizer found.");
        }
        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

checkOrganizer();
