import React from "react";
import { useNavigate } from "react-router-dom";
import "./NightSky.css";

const Welcome = () => {
  const navigate = useNavigate();
  // ... (keep auth logic if needed, but Welcome is currently visual)

  // Generate random stars
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 4}px`,
    duration: `${2 + Math.random() * 3}s`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="night-sky">
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              "--duration": star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "10px" }}>
          Welcome to Travora Trip
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
          Discover your next adventure under the stars.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
