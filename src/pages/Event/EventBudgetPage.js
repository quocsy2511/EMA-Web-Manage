import React, { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Card, Progress, Statistic, Tabs } from "antd";
import ConfirmedBudget from "../../components/Budget/ConfirmedBudget";
import ConfirmingBudget from "../../components/Budget/ConfirmingBudget";
import { FcMoneyTransfer } from "react-icons/fc";
import { useQuery } from "@tanstack/react-query";
import { getDetailEvent } from "../../apis/events";
import { getBudget } from "../../apis/budget";

const EventBudgetPage = () => {
  const eventId = useParams().eventId;
  console.log("eventId: ", eventId);

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery(["event-detail", eventId], () => getDetailEvent(eventId));
  console.log("DATA : ", event);

  const {
    data: confirmedBudgets,
    isLoading: confirmedBudgetsIsLoading,
    isError: confirmedBudgetsIsError,
  } = useQuery(
    ["confirmed-budgets", eventId],
    () =>
      getBudget({
        eventID: eventId,
        pageSize: 500,
        currentPage: 1,
        mode: 2,
      }),
    { select: (data) => data.data.filter((item) => item.status === "ACCEPT") }
  );
  console.log("confirmedBudgets: ", confirmedBudgets);

  let totalEstimateExpense = confirmedBudgets?.reduce((current, item) => {
    return (current += item.estExpense);
  }, 0);
  console.log("totalEstimateExpense: ", totalEstimateExpense);

  let totalRealExpense = confirmedBudgets?.reduce((current, item) => {
    return (current += item.realExpense);
  }, 0);
  console.log("totalRealExpense: ", totalRealExpense);

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Đã duyệt",
      children: <ConfirmedBudget eventId={eventId} />,
    },
    {
      key: "2",
      label: "Chờ duyệt",
      children: <ConfirmingBudget eventId={eventId} />,
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
        {/* <Square title="Ngân sách" cash="500.000.000" /> */}

        <div className="inline-block">
          <Card bordered={false} loading={isLoading}>
            <Statistic
              title="Ngân sách"
              value={event?.estBudget.toLocaleString() ?? "--"}
              // precision={10}
              valueStyle={{
                color: "#3f8600",
                margin: 10,
              }}
              prefix={<FcMoneyTransfer className="mr-2" />}
              suffix="VNĐ"
            />
          </Card>
        </div>

        <div>
          <Card bordered={false}>
            <p className="text-sm text-slate-400 text-center">
              Kế hoạch chi tiêu
            </p>
            <div className="h-5" />
            <Progress
              type="circle"
              percent={(totalEstimateExpense / event?.estBudget) * 100}
              strokeColor={100 >= 100 ? "rgb(255 79 98)" : "#52c41a"}
              format={(percent) => (
                <span
                  className={`text-sm font-medium ${
                    percent >= 100 && "text-red-500"
                  } text-[#3f8600]`}
                >
                  {totalEstimateExpense?.toLocaleString()}
                  <br />
                  VNĐ
                </span>
              )}
            />
          </Card>
        </div>

        <div>
          <Card bordered={false}>
            <p className="text-sm text-slate-400 text-center">Thực chi</p>
            <div className="h-5" />
            <Progress
              type="circle"
              percent={(totalRealExpense / totalEstimateExpense) * 100}
              strokeColor={100 >= 100 ? "rgb(255 79 98)" : "#52c41a"}
              format={(percent) => (
                <span
                  className={`text-sm font-medium ${
                    percent >= 100 && "text-red-500"
                  }`}
                >
                  {totalRealExpense?.toLocaleString()}
                  <br />
                  VNĐ
                </span>
              )}
            />
          </Card>
        </div>
      </div>

      <div className="min-h-[calc(100vh-300px)] bg-white mt-8 mb-20 pl-3 pr-8 py-8 rounded-2xl">
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
