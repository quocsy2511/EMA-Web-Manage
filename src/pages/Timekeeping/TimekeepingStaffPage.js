import React from "react";
import ListTimekeepingStaff from "./TimekeepingStaff/ListTimekeepingStaff";
import ConfirmTimekeepingStaff from "./TimekeepingStaff/ConfirmTimekeepingStaff";
import { Tabs } from "antd";

const TimekeepingStaffPage = () => {
  const labelTable = [
    {
      key: "1",
      label: "Chấm công",
      children: <ListTimekeepingStaff />,
    },
    {
      key: "2",
      label: "Xác nhận",
      children: <ConfirmTimekeepingStaff />,
    },
  ];

  const onChangeTable = (key) => {};

  return (
    <>
      <div className="bg-[#F0F6FF] h-screen overflow-scroll scrollbar-hide w-full">
        <div className="my-2 pl-3 pr-8 mt-6">
          <Tabs
            tabPosition="top"
            defaultActiveKey="1"
            items={labelTable}
            onChange={onChangeTable}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default TimekeepingStaffPage;
