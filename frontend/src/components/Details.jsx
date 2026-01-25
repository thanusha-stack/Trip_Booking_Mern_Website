import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Button,
  Image
} from "react-bootstrap";
import places from "../dataset/placeList";

const Details = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const place = places.find(
    p => p.name === decodeURIComponent(name)
  );

  return (
    <Container className="my-5">
      <Card className="shadow-lg p-3">
        <Row className="g-4">

          {/* Image */}
          <Col md={6}>
            <Image src={place.image} fluid rounded alt={place.name} />
          </Col>

          {/* Details */}
          <Col md={6}>
            <Badge bg="warning" text="dark" className="mb-2">
              {place.categoryTag}
            </Badge>

            <h2>{place.name}</h2>
            <p>{place.description}</p>

            <ListGroup variant="flush" className="mb-3">
              <ListGroup.Item>
                Adult Fee: <strong>₹{place.adultFee}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Child Fee: <strong>₹{place.childFee}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Opening Time: <strong>{place.openingTime}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Closing Time: <strong>{place.closingTime}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Refund Policy: <strong>{place.refundPolicy}</strong>
              </ListGroup.Item>
            </ListGroup>

            {place.bookingAvailable ? (
              <Button
                variant="success"
                size="lg"
                onClick={() =>
                  navigate("/booking", {
                    state: {
                      name: place.name,
                      adultFee: place.adultFee,
                      childFee: place.childFee
                    }
                  })
                }
              >
                Book Now
              </Button>
            ) : (
              <Button variant="secondary" size="lg" disabled>
                Booking Not Available
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Details;
