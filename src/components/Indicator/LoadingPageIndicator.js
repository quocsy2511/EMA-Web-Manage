import React from "react";
import { PuffLoader } from "react-spinners";

const LoadingPageIndicator = ({ title }) => {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <PuffLoader color="#1677ff" size={60} speedMultiplier={2} />
      <br />
      <p className="text-lg font-normal">
        Đang tải {title ? `${title} ...` : "..."}
      </p>
    </div>
  );
};

export default LoadingPageIndicator;
