import React from "react";
import { MoonLoader } from "react-spinners";

const LoadingItemIndicator = ({ title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <MoonLoader color="#1677ff" size={60} />
      <br />
      <p className="text-lg font-normal">{title}</p>
    </div>
  );
};

export default LoadingItemIndicator;
