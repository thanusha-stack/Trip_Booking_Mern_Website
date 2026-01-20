import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC13v-fMshbxk1ucA0rYy53L9xkwGUZ9ZU",
  authDomain: "mysore-trip-booking-website.firebaseapp.com",
  projectId: "mysore-trip-booking-website",
  storageBucket: "mysore-trip-booking-website.firebasestorage.app",
  messagingSenderId: "561918067427",
  appId: "1:561918067427:web:4fca79130fc7a95a5f7bd6",
  measurementId: "G-6EG5ZRCK7S"
};

const app = initializeApp(firebaseConfig);

// ✅ NAMED EXPORTS
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
