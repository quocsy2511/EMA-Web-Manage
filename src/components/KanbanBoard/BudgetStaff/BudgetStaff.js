import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import ConfirmedBudgetStaff from "./ConfirmedBudgetStaff";
import ComfirmingBudgetStaff from "./ComfirmingBudgetStaff";
import NewBudget from "./ModalBudget/NewBudget";
import DescriptionEvent from "../DescriptionEvent/DescriptionEvent";

const BudgetStaff = ({ selectEvent, listBudget }) => {
  const [listBudgetConfirming, setListBudgetConfirming] = useState([]);
  const [listBudgetConfirmed, setListBudgetConfirmed] = useState([]);

  useEffect(() => {
    if (listBudget && Array.isArray(listBudget)) {
      const filterBudgetConfirming = listBudget.filter(
        (item) => item.status === "PROCESSING"
      );
      const filterBudgetConfirmed = listBudget.filter(
        (item) => item.status === "ACCEPT"
      );
      setListBudgetConfirmed(filterBudgetConfirmed);
      setListBudgetConfirming(filterBudgetConfirming);
    }
  }, [listBudget]);

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
    console.log(key);
  };

  return (
    <>
      <div className="bg-bgG h-screen overflow-scroll">
        <DescriptionEvent />
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
