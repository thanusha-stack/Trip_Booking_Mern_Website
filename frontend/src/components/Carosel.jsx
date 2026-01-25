import Carousel from "react-bootstrap/Carousel";
import carouselData from "../dataset/carouselData";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

function Carosel() {
  const navigate=useNavigate();
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Combos in Mysore Tourism</h2>
    <Carousel fade>
      {carouselData.map(item => (
        <Carousel.Item key={item.id}>
          <img
            className="d-block w-100"
            src={item.image}
            alt={item.title}
            style={{ height: "450px", objectFit: "cover" }}
          />

          <Carousel.Caption className="bg-dark bg-opacity-50 rounded">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Total Amount: {item.amount}</p>
            <p>Pick Up: {item.pick_up}</p>
            <p>Drop: {item.drop}</p>
            <Button
                variant="dark"
                size="lg"
                onClick={() =>
                  navigate("/booking", { state: { combo: item } })
                }
              >
                Book Now
              </Button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
    </div>
  );
}

export default Carosel;
