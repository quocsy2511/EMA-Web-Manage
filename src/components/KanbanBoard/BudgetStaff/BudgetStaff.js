import { Tabs } from "antd";
import React from "react";
import ConfirmedBudgetStaff from "./ConfirmedBudgetStaff";
import ComfirmingBudgetStaff from "./ComfirmingBudgetStaff";
import NewBudget from "./ModalBudget/NewBudget";
import { BookOutlined, CalendarOutlined } from "@ant-design/icons";

const BudgetStaff = ({ selectEvent }) => {
  const labelTable = [
    {
      key: "1",
      label: "Đã duyệt",
      children: <ConfirmedBudgetStaff selectEvent={selectEvent} />,
    },
    {
      key: "2",
      label: "Chờ duyệt",
      children: <ComfirmingBudgetStaff selectEvent={selectEvent} />,
    },
    {
      key: "3",
      label: "Thêm chi phí",
      children: <NewBudget selectEvent={selectEvent} />,
    },
  ];
  const onChangeTable = (key) => {
    console.log(key);
  };

  return (
    <>
      <div className="bg-white h-screen overflow-scroll">
        {/* <div
          className={`min-h-[200px] relative group md:w-[100%] w-[45%] bg-white cursor-pointer bg-auto bg-center px-16 mt-3`}
        >
          <h2 className="text-4xl font-semibold  mb-3">
            {selectEvent.eventName}
          </h2>
          <span className="flex flex-row justify-start items-center gap-x-2 ">
            <CalendarOutlined className="text-lg text-orange-500" />
            <p className="mt-1 px-4 font-medium  text-black  underline underline-offset-2">
              {selectEvent.startDate} - {selectEvent.endDate}
            </p>
          </span>
          <span className="relative z-20  flex flex-row justify-start items-start gap-x-2 mt-3 mb-6">
            <BookOutlined className="text-lg text-orange-500" />
            <p className="text-base w-2/3  px-4 italic text-black ">
              {selectEvent.description}
            </p>
          </span>
        </div> */}
        <div className="mt-1 pl-3 pr-8 ">
          <Tabs
            tabPosition="left"
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

export default BudgetStaff;
