# 🧳 Travora Trip – Advanced MERN Travel Marketplace (v3.0)

**Travora Trip** is a comprehensive full-stack **MERN (MongoDB, Express, React, Node.js)** platform designed for travel organizers and tourists. It facilitates seamless trip planning, dynamic itinerary management, and secure bookings with **Razorpay integration**.

---

## 🚀 Version 3.0 New Features

### 🏢 Organizer Dashboard
- **Dynamic Itinerary Management**: Create day-by-day plans that automatically scale based on the selected trip duration.
- **Advanced Pricing**: Separate pricing for Adults and Children.
- **Logistics**: Specify Pick-up and Drop-off times for better trip coordination.
- **Integrated Control**: Access the Organizer Dashboard directly from the Profile page.

### 👥 Role-Based Access Control
- **Dual Personas**: Choose between **Tourist** and **Organizer** during registration.
- **Customized UI**: Navigation links and features adapt based on your selected role.

### 🎨 Refined UX/UI
- **Branding**: Complete transition to the "Travora Trip" identity.
- **Streamlined Navigation**: Redesigned Navbar with a prioritize "Dashboard" link and cleaner layout.
- **Dynamic Forms**: Intelligent input fields that react to user data (like trip duration).

---

## 🛠️ Features (Base)

### 🔐 Authentication
- JWT-based secure login and registration.
- Google OAuth 2.0 integration for one-click access.

### 🗺️ Trip Booking & Management
- Browse detailed combo tour packages.
- Interactive booking counter for adults/children.
- Automated total amount calculation.
- Wishlist functionality for tourists.

### 💳 Payments
- **Razorpay Payment Gateway**: Seamless and secure transaction flow.
- Real-time payment verification.
- **Stripe Support**: Legacy or alternative payment support built-in.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Hooks, Context API)
- **React Bootstrap** for premium responsiveness.
- **Axios** (API communication).
- **React Router DOM** (Client-side routing).

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (NoSQL Database).
- **JWT Authentication** & **Bcrypt.js** (Security).
- **Razorpay SDK** (Payment processing).

---

## 🔑 Setup & Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
GOOGLE_CLIENT_ID=your_google_id
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=your_key_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_id
```

---

## 👩‍💻 Author
- **Thanusha**
- Full-Stack Developer (MERN)
- 📍 India

---
