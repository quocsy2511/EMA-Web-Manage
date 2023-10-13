import React from "react";
import emptyItem from "../../assets/images/empty_item.jpg";

const EmptyList = ({ title }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center">
      <img className="m-auto" src={emptyItem} />
      <p className="text-base text-slate-500">{title}</p>
    </div>
  );
};

export default EmptyList;
