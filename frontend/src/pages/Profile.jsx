import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, Button } from "react-bootstrap";
import jsPDF from "jspdf";

const Profile = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings?userEmail=${user.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching bookings: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Function to generate PDF receipt
  const downloadReceipt = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Trip Booking Receipt", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);
    doc.text(`Place: ${booking.placeName}`, 20, 60);
    doc.text(
      `Trip Date: ${new Date(booking.tripDate).toLocaleDateString()}`,
      20,
      70
    );
    doc.text(`Adults: ${booking.adultCount}`, 20, 80);
    doc.text(`Children: ${booking.childCount}`, 20, 90);
    doc.text(`Total Amount: ₹${booking.totalAmount}`, 20, 100);
    doc.text(
      `Payment Status: ${booking.payment?.status || "Pending"}`,
      20,
      110
    );
    doc.text(`Email Verified: ${booking.emailVerified ? "Yes" : "No"}`, 20, 120);
    doc.text(`Phone Verified: ${booking.phoneVerified ? "Yes" : "No"}`, 20, 130);

    doc.save(`Receipt_${booking.placeName}_${booking._id}.pdf`);
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        <Button variant="dark" onClick={logout}>
          Logout
        </Button>
      </div>

      <h5 className="mb-3">Booking History</h5>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <Card key={b._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{b.placeName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Trip Date: {new Date(b.tripDate).toLocaleDateString()}
              </Card.Subtitle>

              <div className="d-flex justify-content-between mb-1">
                <span>Adults:</span>
                <span>{b.adultCount}</span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Children:</span>
                <span>{b.childCount}</span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Total Amount:</span>
                <span>₹{b.totalAmount}</span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Payment Status:</span>
                <span
                  className={
                    b.payment?.status === "succeeded" ? "text-success" : "text-danger"
                  }
                >
                  {b.payment?.status || "Pending"}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Email Verified:</span>
                <span>{b.emailVerified ? "Yes" : "No"}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Phone Verified:</span>
                <span>{b.phoneVerified ? "Yes" : "No"}</span>
              </div>

              <Button
                variant="primary"
                onClick={() => downloadReceipt(b)}
              >
                Download Receipt
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default Profile;
