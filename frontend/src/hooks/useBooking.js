import { useState, useMemo } from "react";

const useBooking = (place) => {
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);

  const totalAmount = useMemo(() => {
    return adult * place.adultFee + child * place.childFee;
  }, [adult, child, place]);

  return {
    adult,
    child,
    setAdult,
    setChild,
    totalAmount,
    emailVerified,
    setEmailVerified
  };
};

export default useBooking;
