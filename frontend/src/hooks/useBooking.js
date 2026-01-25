import { useState, useMemo } from "react";

const useBooking = (place) => {
  // ✅ safe defaults
  const adultFee = place?.adultFee || 0;
  const childFee = place?.childFee || 0;

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);

  const totalAmount = useMemo(() => {
    return adult * adultFee + child * childFee;
  }, [adult, child, adultFee, childFee]);

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
