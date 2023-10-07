import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

const EventLayout = () => {
  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-8">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default EventLayout;
