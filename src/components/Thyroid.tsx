import React from "react";

interface ThyroidProps {
  width?: number;
  height?: number;
  fill?: string;
}

const Thyroid: React.FC<ThyroidProps> = ({
  width = 75,
  height = 75,
  fill = "#FDA4AF",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
      M 50,30
      C 40,20  25,25  20,40
      C 15,55  25,80  35,85
      C 45,90  50,85  50,75

      C 50,85  55,90  65,85
      C 75,80  85,55  80,40
      C 75,25  60,20  50,30
      Z
    "
        fill={fill}
        stroke="none"
      />
    </svg>
  );
};

export default Thyroid;
