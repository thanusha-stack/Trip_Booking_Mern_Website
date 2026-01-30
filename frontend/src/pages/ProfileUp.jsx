import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, Button, Badge, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";

const ProfileUp = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/bookings?userEmail=${user.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const downloadReceipt = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
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

    doc.save(`Receipt_${booking.placeName}.pdf`);
  };

  return (
    <div className="container my-5">
      {/* Profile Card */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h4 className="mb-1">{user.name}</h4>
            <p className="text-muted mb-0">{user.email}</p>
          </div>
          <Button variant="outline-danger" onClick={logout}>
            Logout
          </Button>
        </Card.Body>
      </Card>

      {/* Booking Section */}
      <h5 className="mb-3">Your Bookings</h5>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-muted">No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <Card key={b._id} className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{b.placeName}</h5>
                <Badge
                  bg={
                    b.payment?.status === "succeeded"
                      ? "success"
                      : "warning"
                  }
                >
                  {b.payment?.status || "Pending"}
                </Badge>
              </div>

              <p className="text-muted mb-2">
                Trip Date: {new Date(b.tripDate).toLocaleDateString()}
              </p>

              <div className="row mb-2">
                <div className="col-md-4">
                  <strong>Adults:</strong> {b.adultCount}
                </div>
                <div className="col-md-4">
                  <strong>Children:</strong> {b.childCount}
                </div>
                <div className="col-md-4">
                  <strong>Total:</strong> ₹{b.totalAmount}
                </div>
              </div>

              <div className="mb-3">
                <Badge bg={b.emailVerified ? "success" : "secondary"} className="me-2">
                  Email {b.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
                <Badge bg={b.phoneVerified ? "success" : "secondary"}>
                  Phone {b.phoneVerified ? "Verified" : "Not Verified"}
                </Badge>
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

export default ProfileUp;
