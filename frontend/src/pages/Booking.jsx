import PhoneVerification from "../components/PhoneVerification";
import PaymentDetails from "../components/PaymentDetails";
import useBooking from "../hooks/useBooking";
import { useState } from "react";
import { useParams } from "react-router-dom";
import EmailVerification from "../components/EmailVerification";
import TicketCounter from "../components/TicketCounter";
import places from "../dataset/placeList";
import { Container, Row, Col } from "react-bootstrap";
import PriceSummary from "../components/PriceSummary";

const Booking = () => {
  const { name } = useParams();
  const place = places.find(p => p.name === decodeURIComponent(name));

  const {
    adult,
    child,
    setAdult,
    setChild,
    totalAmount,
    emailVerified,
    setEmailVerified
  } = useBooking(place);

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [payment, setPayment] = useState({ upiId: "", provider: "" });

  if (!place) return <p>Place not found</p>;

  return (
    <Container className="mt-3">
      <Row className="g-4">
        <Col md={6}>
          <EmailVerification onVerify={setEmailVerified} />
          <PhoneVerification onVerify={setPhoneVerified} />
        </Col>

        <Col md={6}>
        
          <PaymentDetails onPaymentChange={setPayment} />
          <TicketCounter
            label="Adults"
            price={place.adultFee}
            count={adult}
            setCount={setAdult}
            min={1}
          />
          <TicketCounter
            label="Children"
            price={place.childFee}
            count={child}
            setCount={setChild}
          />
          
          <PriceSummary
            placeName={place.name}
            totalAmount={totalAmount}
            emailVerified={emailVerified && phoneVerified}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Booking