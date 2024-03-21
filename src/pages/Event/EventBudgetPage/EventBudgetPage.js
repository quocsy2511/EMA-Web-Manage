import React, { Fragment, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tabs, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetTransactionRequest,
  updateBudgetTransaction,
} from "../../../apis/budgets";
import BudgetModal from "../../../components/Modal/BudgetModal";
import AllBudgetTab from "./AllBudgetTab";
import OwnBudgetTab from "./OwnBudgetTab";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { PiNewspaperFill } from "react-icons/pi";

const EventBudgetPage = () => {
  const eventId = useParams().eventId;
  console.log("eventId: ", eventId);

  const location = useLocation();
  const { eventName } = location.state ?? {};

  const [selectedBudgetId, setSelectedBudgetId] = useState();
  const [isModalRejectOpen, setIsModalRejectOpen] = useState(false);
  const [transactionId, setTransactionId] = useState();

  const [isModalSeenRejectOpen, setIsModalSeenRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState();

  const [isModalEvidenceRejectOpen, setIsModalEvidenceRejectOpen] =
    useState(false);
  const [evidence, setEvidence] = useState();

  const [messageApi, contextHolder] = message.useMessage();
  const mergeValue = new Set();

  const {
    data: allBudget,
    isLoading: allBudgetIsLoading,
    isError: allBudgetIsError,
  } = useQuery(
    ["transaction-request-all"],
    () => getBudgetTransactionRequest({ eventID: eventId, type: "ALL" }),
    { refetchOnWindowFocus: false }
  );

  const {
    data: ownBudget,
    isLoading: ownBudgetIsLoading,
    isError: ownBudgetIsError,
  } = useQuery(
    ["transaction-request-own"],
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

  const queryClient = useQueryClient();
  const {
    mutate: updateBudgetStatusMutate,
    isLoading: updateBudgetStatusIsLoading,
  } = useMutation(
    ({ transactionId, status, rejectNote }) =>
      updateBudgetTransaction({ transactionId, status, rejectNote }),
    {
      onSuccess: (data, variable) => {
        queryClient.invalidateQueries(["budget-item", selectedBudgetId]);
        messageApi.open({
          type: "success",
          content: "Đã cập nhật trạng thái thành công.",
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content:
            error?.response?.data?.message ??
            "1 lỗi bất ngờ xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const handleChangeStatusTransaction = (transactionId, status, rejectNote) => {
    updateBudgetStatusMutate({ transactionId, status, rejectNote });
  };

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
                <div className="flex items-center space-x-2">
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
                <div className="flex items-center space-x-2">
                  <PiNewspaperFill className="text-xl" />
                  <p className="text-base">Yêu cầu</p>
                </div>
              ),
              children: (
                <OwnBudgetTab
                  ownBudget={ownBudget}
                  ownBudgetIsLoading={ownBudgetIsLoading}
                  ownBudgetIsError={ownBudgetIsError}
                  messageApi={messageApi}
                />
              ),
            },
          ]}
        />
      </motion.div>
    </Fragment>
  );
};

export default memo(EventBudgetPage);
