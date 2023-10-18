import React, { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Progress, Tabs } from "antd";
import ConfirmedBudget from "../../components/Budget/ConfirmedBudget";
import ConfirmingBudget from "../../components/Budget/ConfirmingBudget";

const Square = ({ title, cash }) => (
  <div className="bg-white p-5 rounded-lg">
    <p className="text-sm font-medium">{title}</p>
    <p className="text-xl font-bold">{cash} VNĐ</p>
  </div>
);

const EventBudgetPage = () => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Đã duyệt",
      children: <ConfirmedBudget />,
    },
    {
      key: "2",
      label: "Chờ duyệt",
      children: <ConfirmingBudget />,
    },
  ];

  return (
    <Fragment>
      <motion.div
        initial={{ y: -75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to="../.." relative="path">
            Sự kiện
          </Link>{" "}
          /{" "}
          <Link to=".." relative="path">
            Khai giảng
          </Link>{" "}
          / Ngân sách
        </p>
      </motion.div>

      <div className="flex gap-x-5 mt-8">
        <Square title="Ngân sách" cash="500.000.000" />
        {/* <Square title="Kế hoạch chi tiêu" cash="20.000.000" />
        <Square title="Thực chi" cash="22.000.000" /> */}
        <div className="bg-white p-5 rounded-lg space-y-5">
          <p className="text-base font-semibold text-center">
            Kế hoạch chi tiêu
          </p>
          <Progress
            type="circle"
            percent={90}
            strokeColor={100 >= 100 ? 'rgb(255 79 98)' : "#52c41a"}
            format={(percent) => (
              <span
                className={`text-sm font-medium ${
                  percent >= 100 && "text-red-500"
                }`}
              >
                501.000.000
                <br />
                VNĐ
              </span>
            )}
          />
        </div>
        <div className="bg-white p-5 rounded-lg space-y-5">
          <p className="text-base font-semibold text-center">Thực chi</p>
          <Progress
            type="circle"
            percent={0}
            format={(percent) => (
              <span className="text-sm font-medium">
                0<br />
                VNĐ
              </span>
            )}
          />
        </div>
      </div>

      <div className="bg-white mt-8 pl-3 pr-8 py-8 rounded-2xl">
        <Tabs
          tabPosition="left"
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          style={{ height: "100%" }}
            // centered
        />
      </div>
    </Fragment>
  );
};

export default EventBudgetPage;
