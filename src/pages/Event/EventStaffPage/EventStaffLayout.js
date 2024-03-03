import React, { Fragment, memo } from "react";
import { Outlet } from "react-router";

const EventStaffLayout = () => {
  return (
    <Fragment>
      <div className="">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default memo(EventStaffLayout);
