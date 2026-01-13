import { Button } from "react-bootstrap";

const TicketCounter = ({ label, price, count, setCount, min = 0 }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span>{label} (₹{price})</span>

      <div>
        <Button
          size="sm"
          onClick={() => setCount(Math.max(min, count - 1))}
        >
          −
        </Button>

        <span className="mx-3">{count}</span>

        <Button size="sm" onClick={() => setCount(count + 1)}>
          +
        </Button>
      </div>
    </div>
  );
};

export default TicketCounter;
