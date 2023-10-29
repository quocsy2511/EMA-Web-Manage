import React from "react";
import errorImg from "../../assets/images/error_component.jpg";

const AnErrorHasOccured = () => {
  return (
    <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
      <img className="m-auto" src={errorImg} />
    </div>
  );
};

export default AnErrorHasOccured;
