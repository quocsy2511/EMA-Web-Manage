import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] py-12 px-20">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default CustomerLayout;
