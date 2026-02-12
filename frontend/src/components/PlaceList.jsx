import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function PlaceList({ _id, title, images, description, category, price, destination }) {
  const imageUrl = images && images.length > 0 ? images[0] : "https://via.placeholder.com/200";

  return (
    <Card className="h-100 position-relative shadow-sm border-0">
      <span className="badge bg-primary position-absolute top-0 start-0 m-2">
        {category}
      </span>

      <Card.Img
        variant="top"
        src={imageUrl}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted small mb-2">{destination}</Card.Text>
        <Card.Text className="text-truncate" style={{ maxHeight: "3.6em" }}>{description}</Card.Text>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold text-success">
            {typeof price === 'object' ? `From ₹${price.adult}` : `₹${price}`}
          </span>
          <Link to={`/place/${_id}`}>
            <Button variant="dark" size="sm">Explore</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PlaceList;
