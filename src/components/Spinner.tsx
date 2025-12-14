import React from "react";

interface SpinnerProps {
  size?: string; // e.g., "h-4 w-4"
}

const Spinner: React.FC<SpinnerProps> = ({ size = "h-8 w-8" }) => {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-b-2 border-white ${size}`}></div>
    </div>
  );
};

export default Spinner;
