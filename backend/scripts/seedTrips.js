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
                images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop"],
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
                images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"],
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
                images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop"],
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
                images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop"],
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
                images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop"],
                organizerId: organizerId,
                availableDates: [new Date("2025-03-12"), new Date("2025-03-26")],
                itinerary: [
                    { day: 1, activities: ["Nanjanagud Temple Darshan", "Scenic drive to Gopalaswamy Hills", "Mist-view at the hilltop"] }
                ]
            },
            {
                title: "Gokarna Beach Trek & Sunset Camping",
                description: "Experience the pristine beaches of Gokarna with a guided trek covering Kudle, Om, Half Moon, and Paradise beaches. End your day with a beachside campfire and stargazing.",
                destination: "Gokarna",
                price: { adult: 3000, child: 1800 },
                pickUpTime: "06:00 PM (Previous Day)",
                dropTime: "08:00 AM (Next Day)",
                duration: "2 days",
                category: "Adventure",
                images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"],
                organizerId: organizerId,
                availableDates: [new Date("2025-05-01"), new Date("2025-05-15")],
                itinerary: [
                    { day: 1, activities: ["Arrival and breakfast", "Trek start from Kudle Beach", "Om Beach lunch break", "Sunset at Paradise Beach"] },
                    { day: 2, activities: ["Morning yoga by the beach", "Visit Mahabaleshwar Temple", "Departure"] }
                ]
            },
            {
                title: "Hampi Ruins & Hippie Island Exploration",
                description: "Walk through history in the UNESCO World Heritage site of Hampi. Explore the Virupaksha Temple, Stone Chariot, and the Royal Enclosure. Cross the river to explore the vibrant Hippie Island.",
                destination: "Hampi",
                price: { adult: 3800, child: 2200 },
                pickUpTime: "09:00 PM (Previous Day)",
                dropTime: "06:00 AM (Next Day)",
                duration: "2 days",
                category: "Heritage",
                images: ["https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop"],
                organizerId: organizerId,
                availableDates: [new Date("2025-06-10"), new Date("2025-06-25")],
                itinerary: [
                    { day: 1, activities: ["Virupaksha Temple", "Vittala Temple & Stone Chariot", "Sunset at Hemakuta Hill"] },
                    { day: 2, activities: ["Coracle ride across Tungabhadra", "Explore Hippie Island cafes", "Sanapur Lake swim"] }
                ]
            },
            {
                title: "Chikmagalur Coffee Estate & Mullayanagiri Peak",
                description: "Breathe in the fresh aroma of coffee in Chikmagalur. Stay in a luxury homestay, trek to Karnataka's highest peak - Mullayanagiri, and visit the serene Jhari Waterfalls.",
                destination: "Chikmagalur",
                price: { adult: 4200, child: 2400 },
                pickUpTime: "05:00 AM",
                dropTime: "09:00 PM",
                duration: "2 days",
                category: "Adventure",
                images: ["https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&h=600&fit=crop"],
                organizerId: organizerId,
                availableDates: [new Date("2025-07-05"), new Date("2025-07-20")],
                itinerary: [
                    { day: 1, activities: ["Mullayanagiri Peak Trek", "Baba Budangiri Shrine", "Jhari Waterfalls jeep ride"] },
                    { day: 2, activities: ["Coffee Museum tour", "Estate walk & tasting", "Shopping for spices"] }
                ]
            },
            {
                title: "Bangalore City Culture & Gardens Tour",
                description: "Explore the Garden City of India! Visit the botanical wonder of Lalbagh, the majestic Bangalore Palace, and the legislative seat Vidhana Soudha. End with a shopping spree at MG Road.",
                destination: "Bangalore",
                price: { adult: 1000, child: 500 },
                pickUpTime: "09:00 AM",
                dropTime: "06:00 PM",
                duration: "1 day",
                category: "Combo",
                images: ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop"],
                organizerId: organizerId,
                availableDates: [new Date("2025-04-05"), new Date("2025-04-12"), new Date("2025-04-19")],
                itinerary: [
                    { day: 1, activities: ["Lalbagh Botanical Garden", "Tipu Sultan's Summer Palace", "Bangalore Palace", "Commercial Street shopping"] }
                ]
            },
            {
                title: "Ooty & Coonoor Hill Station Retreat",
                description: "Relax in the Queen of Hill Stations. Enjoy the heritage toy train ride, visit the Government Botanical Garden, and take a boat ride in Ooty Lake. Includes a day trip to the scenic tea gardens of Coonoor.",
                destination: "Ooty",
                price: { adult: 5500, child: 3000 },
                pickUpTime: "06:00 AM",
                dropTime: "10:00 PM",
                duration: "3 days",
                category: "Combo",
                images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"],
                organizerId: organizerId,
                availableDates: [new Date("2025-05-10"), new Date("2025-05-25")],
                itinerary: [
                    { day: 1, activities: ["Ooty Lake Boating", "Botanical Garden", "Rose Garden"] },
                    { day: 2, activities: ["Toy Train Ride", "Doddabetta Peak", "Tea Factory Visit"] },
                    { day: 3, activities: ["Sim's Park Coonoor", "Dolphin's Nose Viewpoint", "Return journey"] }
                ]
            }
        ];

        // Clear existing trips (Optional, but good for a clean seed)
        await Trip.deleteMany({});
        console.log("🗑️ Cleared existing trips");

        await Trip.insertMany(trips);
        console.log("🚀 Successfully seeded trip packages!");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding trips:", err);
        process.exit(1);
    }
};

seedTrips();
