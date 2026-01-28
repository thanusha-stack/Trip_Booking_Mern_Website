import React from "react";

const MarqueeBar = () => {
  return (
    <div className="marquee-container">
      <marquee behavior="scroll" direction="left">
        This website is a project with a real-time payment flow integrated for demonstration purposes only. 
        Users are strictly advised not to make actual bookings or payments.
        </marquee>
    </div>
  );
};

export default MarqueeBar;
