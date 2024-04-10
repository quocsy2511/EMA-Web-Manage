import React, { Fragment, memo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tabs, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getBudgetTransactionRequest } from "../../../apis/budgets";
import AllBudgetTab from "./AllBudgetTab";
import OwnBudgetTab from "./OwnBudgetTab";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { PiNewspaperFill } from "react-icons/pi";

const EventBudgetPage = () => {
  const eventId = useParams().eventId;

  const location = useLocation();
  const { eventName } = location.state ?? {};

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: allBudget,
    isLoading: allBudgetIsLoading,
    isError: allBudgetIsError,
  } = useQuery(
    ["transaction-request-all", eventId],
    () => getBudgetTransactionRequest({ eventID: eventId, type: "ALL" }),
    { refetchOnWindowFocus: false }
  );

  const {
    data: ownBudget,
    isLoading: ownBudgetIsLoading,
    isError: ownBudgetIsError,
  } = useQuery(
    ["transaction-request-own", eventId],
    () => getBudgetTransactionRequest({ eventID: eventId, type: "OWN" }),
    {
      refetchOnWindowFocus: false,
      select: (data) =>
        data?.filter(
          (item) =>
            !!item?.itemExisted?.tasks?.filter(
              (subtask) => !!subtask?.transactions?.length
            )?.length && item
        ),
    }
  );

  let countOwnbudget;
  if (ownBudget) {
    countOwnbudget = ownBudget?.filter((budget) =>
      budget?.itemExisted?.tasks?.find(
        (task) =>
          !!task?.transactions?.find((item) => item?.status === "PENDING")
      )
    )?.length;
  }

  return (
    <Fragment>
      {contextHolder}

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
        initial={{ y: -75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-5"
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <div className="flex items-center space-x-2 px-5">
                  <BsFillPiggyBankFill className="text-xl" />
                  <p className="text-base">Quản lý thu chi</p>
                </div>
              ),
              children: (
                <AllBudgetTab
                  allBudget={allBudget}
                  allBudgetIsLoading={allBudgetIsLoading}
                  allBudgetIsError={allBudgetIsError}
                />
              ),
            },
            {
              key: "2",
              label: (
                <div className="flex items-center space-x-2 px-5 relative">
                  <PiNewspaperFill className="text-xl" />
                  <p className="text-base">Yêu cầu</p>

                  {!!countOwnbudget && countOwnbudget > 0 && (
                    <p className="absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {countOwnbudget}
                    </p>
                  )}
                </div>
              ),
              children: (
                <div>
                  <OwnBudgetTab
                    ownBudget={ownBudget}
                    ownBudgetIsLoading={ownBudgetIsLoading}
                    ownBudgetIsError={ownBudgetIsError}
                    messageApi={messageApi}
                  />
                </div>
              ),
            },
          ]}
        />
      </motion.div>
    </Fragment>
  );
};

export default memo(EventBudgetPage);
