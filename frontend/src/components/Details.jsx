import React from "react";
import { useParams, Link } from "react-router-dom";
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
  const { name } = useParams(); // 👈 get name from URL

  const place = places.find(
    p => p.name === decodeURIComponent(name)
  );

  if (!place) {
    return <p className="text-center mt-5">Place not found</p>;
  }

  return (
    <Container className="my-5">
      <Card className="shadow-lg p-3">
        <Row className="g-4">

          {/* Image */}
          <Col md={6}>
            <Image
              src={place.image}
              fluid
              rounded
              alt={place.name}
            />
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
                Child Fee: <strong>₹{place.childFee}</strong> (Age {place.childAgeLimit})
              </ListGroup.Item>

              <ListGroup.Item>
                Opening Time: <strong>{place.openingTime}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Closing Time: <strong>{place.closingTime}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Recommended Duration: <strong>{place.recommendedDuration}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Closed On: <strong>{place.closedOn}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                Refund Policy: <strong>{place.refundPolicy}</strong>
              </ListGroup.Item>
            </ListGroup>

            {place.bookingAvailable ? (
                <Button
                variant="success"
                size="lg"
                as={Link}
                to={`/book/${encodeURIComponent(place.name)}`}
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
