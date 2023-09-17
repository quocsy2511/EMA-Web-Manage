import React from "react";
import img from "../../assets/images/error.png";
import { Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  console.log(error)

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex md:flex-row flex-col w-1/2 md:h-2/5 h-[55%] items-center">
        <div className="w-1/3">
          <div className="flex justify-center items-center w-full h-full">
            <img src={img} />
          </div>
        </div>
        <div className="h-full flex-1 flex flex-col justify-between">
          <h1 className="text-[#f44336] font-black text-6xl md:text-left text-center">
            {/* 404 */}{error.status || "404"}
          </h1>
          <div>
            <h4 className="text-[#313435] font-semibold text-2xl mb-2">
              Oops Page Not Found
            </h4>
            <p className="text-[#72777a]">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back !
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
