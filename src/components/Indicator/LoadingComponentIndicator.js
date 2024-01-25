import React from "react";
import { ScaleLoader } from "react-spinners";

const LoadingComponentIndicator = ({ title }) => {
  return (
    <div className="w-full h-full my-auto flex flex-col items-center justify-center">
      <ScaleLoader color="#1677ff" size={40} speedMultiplier={2}/>
      <br />
      <p className="text-lg font-normal">
        Đang tải {title}...
      </p>
    </div>
  );
};

export default LoadingComponentIndicator;
