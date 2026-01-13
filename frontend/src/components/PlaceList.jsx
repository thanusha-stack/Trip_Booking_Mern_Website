import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function PlaceList({ name, image, description, category }) {
  return (
    <Card className="h-100 position-relative">
      <span className="badge bg-primary position-absolute top-0 start-0 m-2">
        {category}
      </span>

      <Card.Img
        variant="top"
        src={image}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>

        {/* 👇 Navigation */}
        <Link to={`/place/${encodeURIComponent(name)}`}>
          <Button variant="dark">Explore</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default PlaceList;
