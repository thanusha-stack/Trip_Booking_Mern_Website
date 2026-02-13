const mongoose = require("mongoose");
require("dotenv").config();
const Trip = require("../models/Trip");
const User = require("../models/User");

const seedTrips = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected for seeding");

        // Find an organizer
        const organizer = await User.findOne({ role: "organizer" });
        if (!organizer) {
            console.error("❌ No organizer found in database. Please create one first.");
            process.exit(1);
        }

        const organizerId = organizer._id;
        console.log(`Using Organizer ID: ${organizerId} (${organizer.name})`);

        const trips = [
            {
                title: "Mysore Palace & Chamundi Hills Heritage Tour",
                description: "Experience the royal grandeur of Mysore! Visit the magnificent Mysore Palace, known for its Indo-Saracenic architecture, and climb the Chamundi Hills for a panoramic view of the city. Includes a visit to the St. Philomena's Church and the bustling Devaraja Market.",
                destination: "Mysore",
                price: { adult: 1500, child: 800 },
                pickUpTime: "08:00 AM",
                dropTime: "06:00 PM",
                duration: "1 day",
                category: "Heritage",
                images: ["https://images.unsplash.com/photo-1621535740625-83e9365c0ae5?auto=format&fit=crop&q=80&w=800"],
                organizerId: organizerId,
                availableDates: [new Date("2025-03-01"), new Date("2025-03-08"), new Date("2025-03-15")],
                itinerary: [
                    { day: 1, activities: ["Morning visit to Chamundi Hills", "Explore Mysore Palace", "Saint Philomena's Church", "Evening walk through Devaraja Market"] }
                ]
            },
            {
                title: "Coorg Adventure: Coffee Estates & Waterfalls",
                description: "Escape to the 'Scotland of India'. Hike through lush coffee plantations, witness the breathtaking Abbey Falls, and visit the Tibetan Golden Temple in Bylakuppe. Perfect for nature lovers and adventure seekers.",
                destination: "Coorg",
                price: { adult: 4500, child: 2500 },
                pickUpTime: "06:00 AM",
                dropTime: "08:00 PM",
                duration: "2 days",
                category: "Adventure",
                images: ["https://images.unsplash.com/photo-1624640166649-1662fb165e31?auto=format&fit=crop&q=80&w=800"],
                organizerId: organizerId,
                availableDates: [new Date("2025-04-10"), new Date("2025-04-20")],
                itinerary: [
                    { day: 1, activities: ["Golden Temple visit", "Nisargadhama Island", "Check-in and bonfire night"] },
                    { day: 2, activities: ["Abbey Falls", "Raja's Seat sunrise", "Coffee estate plantation walk"] }
                ]
            },
            {
                title: "Bandipur Wild Safari Experience",
                description: "Get up close with the wild! Embark on an exciting jeep safari in Bandipur National Park, home to tigers, elephants, and diverse wildlife. Stay in a rustic forest resort and enjoy nature trails.",
                destination: "Bandipur",
                price: { adult: 3500, child: 2000 },
                pickUpTime: "05:00 AM",
                dropTime: "04:00 PM",
                duration: "1 day",
                category: "Adventure",
                images: ["https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=800"],
                organizerId: organizerId,
                availableDates: [new Date("2025-03-10"), new Date("2025-03-24")],
                itinerary: [
                    { day: 1, activities: ["Early morning Jungle Safari", "Bird watching trail", "Local tribal museum visit"] }
                ]
            },
            {
                title: "Talakadu & Somnathpur Heritage Circuit",
                description: "Discover the forgotten history of Karnataka. Visit the sand-dunes of Talakadu on the banks of River Kaveri and the intricately carved Chennakesava Temple at Somanathapura, a UNESCO World Heritage nominee.",
                destination: "Talakadu",
                price: { adult: 2000, child: 1000 },
                pickUpTime: "07:30 AM",
                dropTime: "07:00 PM",
                duration: "1 day",
                category: "Heritage",
                images: ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=800"],
                organizerId: organizerId,
                availableDates: [new Date("2025-03-05"), new Date("2025-03-19")],
                itinerary: [
                    { day: 1, activities: ["Somnathpur Carvings Explorer", "Talakadu Sand-buried Temples visit", "Coracle ride in Kaveri river"] }
                ]
            },
            {
                title: "Pilgrimage to Nanjanagud & Himavad Gopalaswamy Betta",
                description: "A spiritual and scenic journey. Visit the ancient Srikanteshwara Temple in Nanjanagud, followed by a trip to the misty hills of Himavad Gopalaswamy Betta, known for its frequent elephant sightings.",
                destination: "Nanjanagud",
                price: { adult: 1200, child: 600 },
                pickUpTime: "09:00 AM",
                dropTime: "05:00 PM",
                duration: "1 day",
                category: "Pilgrimage",
                images: ["https://images.unsplash.com/photo-1600100397561-433ff485039e?auto=format&fit=crop&q=80&w=800"],
                organizerId: organizerId,
                availableDates: [new Date("2025-03-12"), new Date("2025-03-26")],
                itinerary: [
                    { day: 1, activities: ["Nanjanagud Temple Darshan", "Scenic drive to Gopalaswamy Hills", "Mist-view at the hilltop"] }
                ]
            }
        ];

        // Clear existing trips (Optional, but good for a clean seed)
        // await Trip.deleteMany({});
        // console.log("🗑️ Cleared existing trips");

        await Trip.insertMany(trips);
        console.log("🚀 Successfully seeded trip packages!");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding trips:", err);
        process.exit(1);
    }
};

seedTrips();
