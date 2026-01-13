 import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
return (
<footer className="bg-dark text-light mt-5">
  <div className="container py-4">
    <div className="row">

      <div className="col-md-4 mb-3">
        <h5>Mysore Tourism</h5>
        <p className="small">
          Advance booking and secure payment platform for Mysore tourism.
          Plan your trips with confidence and easy refunds.
        </p>
      </div>

      <div className="col-md-4 mb-3">
        <h5>Quick Links</h5>
        <ul className="list-unstyled">
          <li><Link href="#" className="text-light text-decoration-none">Home</Link></li>
          <li><Link href="#" className="text-light text-decoration-none">Places</Link></li>
          <li><Link href="#" className="text-light text-decoration-none">Book Now</Link></li>
          <li><Link href="#" className="text-light text-decoration-none">Refund Policy</Link></li>
        </ul>
      </div>

      <div className="col-md-4 mb-3">
        <h5>Contact</h5>
        <p className="small mb-1">📍 Mysore, Karnataka</p>
        <p className="small mb-1">📞 +91 98765 43210</p>
        <p className="small">✉️ support@mysoretourism.com</p>
      </div>

    </div>
  </div>

  <div className="bg-secondary text-center py-2">
    <small>© 2025 Mysore Tourism | All Rights Reserved</small>
  </div>
</footer>
);
};

export default Footer;
   
   