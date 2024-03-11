import React, { Fragment, memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, Progress, Statistic, Tabs, Tooltip } from "antd";
import ConfirmedBudget from "../../components/Budget/ConfirmedBudget";
import ConfirmingBudget from "../../components/Budget/ConfirmingBudget";
import { FcMoneyTransfer } from "react-icons/fc";
import { useQuery } from "@tanstack/react-query";
import { getDetailEvent } from "../../apis/events";
import { getBudget } from "../../apis/budgets";

const BudgetTableItem = memo(({}) => {
  return (
    <div className=" flex space-x-3 py-5 border-t">
      <p className="w-[30%] text-base font-normal truncate">
        Đi mua nướccccccccccccc c
      </p>
      <p className="w-[12%] text-base font-normal truncate">21-01-2024</p>
      <p className="w-[20%] text-base font-normal truncate">1,000,000</p>
      <div className="w-[20%] px-5">
        <p className="text-base text-center font-normal truncate border py-1 rounded-md">
          Chờ duyệt
        </p>
      </div>
      <p className="flex-1 text-base font-normal truncate text-right">
        Chức năng
      </p>
    </div>
  );
});

const BudgetItem = memo(({}) => {
  return (
    <div className="flex items-center bg-white p-5 space-x-5 hover:scale-105 transition-transform cursor-pointer rounded-lg shadow-md">
      <div className="min-w-[20%] flex justify-center items-center">
        <Progress size="small" type="dashboard" percent={105} gapDegree={30} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Tooltip title="Ten hang muc" placement="topLeft">
          <p className="w-full text-xl font-semibold truncate">Tên hạng mục</p>
        </Tooltip>
        <p className="text-base">tiền</p>
      </div>
    </div>
  );
});

const EventBudgetPage = () => {
  const eventId = useParams().eventId;
  console.log("eventId: ", eventId);

  const location = useLocation();
  const { eventName } = location.state ?? {};

  const [selectedBudget, setSelectedBudget] = useState();

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
            {eventName ?? "Tên sự kiện"}
          </Link>{" "}
          / Ngân sách
        </p>
      </motion.div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex justify-between space-x-10 mt-10"
      >
        <div className="w-1/4 space-y-5">
          <BudgetItem />
          <BudgetItem />
          <BudgetItem />
        </div>

        <div className="flex-1 overflow-hidden space-y-8">
          <p className="w-full text-xl font-semibold truncate bg-white p-5  rounded-md">
            Tên hạng mụcTên hạng mụcTên hạng mụcTên hạng mụcTên hạng mụcTên hạng
            mụcTên hạng mụcTên hạng mụcTên hạng mụcTên hạng mục
          </p>

          <div className="bg-white p-5 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-base text-slate-400 font-normal">Đã sử dụng</p>
              <p className="text-base text-slate-400 font-normal">Hạn mức</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-2xl text-black font-semibold">10000000 VNĐ</p>
              <p className="text-2xl text-black font-semibold">50000000 VNĐ</p>
            </div>

            <Progress percent={90} type="line" />
          </div>

          <div className="p-5 pb-16 bg-white">
            <p className="text-xl font-semibold">Khoản chi</p>

            <div className="mt-5 flex space-x-3 py-3">
              <p className="w-[30%] text-base font-bold truncate">Công việc</p>
              <p className="w-[12%] text-base font-bold truncate">Ngày tạo</p>
              <p className="w-[20%] text-base font-bold truncate">
                Thành tiền (VNĐ)
              </p>
              <p className="w-[20%] text-base text-center bg-red-200 font-bold truncate">
                Trạng thái
              </p>
              <p className="flex-1 text-base font-bold truncate text-right">
                Chức năng
              </p>
            </div>

            <div>
              <BudgetTableItem />
              <BudgetTableItem />
              <BudgetTableItem />
            </div>
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default memo(EventBudgetPage);
