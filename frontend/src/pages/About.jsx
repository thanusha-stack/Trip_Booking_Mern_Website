import React from 'react';

const About = () => {
  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3 className="fw-bold mb-3">Welcome to Travora</h3>

              <p>
                Travora is a digital platform designed to simplify travel
                planning through organized tour packages, secure advance booking,
                and transparent payment management.
              </p>

              <p>
                We provide well-structured 1-day, 2-day, and 3-day tour combos that
                include sightseeing, pickup and drop facilities from Mysore Bus
                Stand, and food arrangements, ensuring a hassle-free experience for
                travelers.
              </p>

              <p>
                Our fintech-enabled booking system helps tourists pre-book their
                trips using advance or full payments, while also assisting local
                tour organizers in managing bookings, cancellations, and refunds
                efficiently.
              </p>
            </div>

            <div className="col-md-6">
              <img
                src="/assets/images/kukLake.png"
                className="img-fluid rounded shadow"
                alt="Travora"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row text-center">

            <div className="col-md-3 mb-4">
              <h5 className="fw-bold">Secure Payments</h5>
              <p className="small">
                Payment options with clear transaction records.
              </p>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="fw-bold">Pickup & Drop</h5>
              <p className="small">
                Convenient transportation from Mysore Bus Stand.
              </p>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="fw-bold">Food Included</h5>
              <p className="small">
                Enjoy delicious meals during your tour.
              </p>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="fw-bold">Easy Refunds</h5>
              <p className="small">
                Transparent cancellation and refund policies.
              </p>
            </div>

          </div>
        </div>
      </section>


      <section className="py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Our Mission</h3>
          <p className="text-muted">
            To modernize local tourism by offering a fintech-based booking and
            refund management system that enhances travel experiences and supports
            tour organizers.
          </p>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          © 2025 Travora. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default About;