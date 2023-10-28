import { Tabs } from "antd";
import React from "react";
import ConfirmedBudgetStaff from "./ConfirmedBudgetStaff";
import ComfirmingBudgetStaff from "./ComfirmingBudgetStaff";
import NewBudget from "./ModalBudget/NewBudget";
import DescriptionEvent from "../DescriptionEvent/DescriptionEvent";

const BudgetStaff = ({
  selectEvent,
  listBudget,
  listBudgetConfirmed,
  listBudgetConfirming,
}) => {
  const labelTable = [
    {
      key: "1",
      label: "Đã duyệt",
      children: (
        <ConfirmedBudgetStaff
          selectEvent={selectEvent}
          listBudgetConfirmed={listBudgetConfirmed}
        />
      ),
    },
    {
      key: "2",
      label: "Chờ duyệt",
      children: (
        <ComfirmingBudgetStaff
          selectEvent={selectEvent}
          listBudgetConfirming={listBudgetConfirming}
        />
      ),
    },
    {
      key: "3",
      label: "Thêm chi phí",
      children: <NewBudget selectEvent={selectEvent} />,
    },
  ];
  const onChangeTable = (key) => {
    // console.log(key);
  };

  return (
    <>
      <div className="bg-bgG h-screen overflow-scroll">
        <DescriptionEvent selectEvent={selectEvent} />
        <div className="py-2 pl-3 pr-8 mt-6">
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
