import React from "react";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ManagerLayout;
