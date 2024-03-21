import React, { Fragment, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useParams } from "react-router-dom";
import { Progress, Tabs, Tooltip, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetTransactionRequest,
  updateBudgetTransaction,
} from "../../../apis/budgets";
import BudgetModal from "../../../components/Modal/BudgetModal";
import AllBudgetTab from "./AllBudgetTab";
import OwnBudgetTab from "./OwnBudgetTab";

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
    { refetchOnWindowFocus: false }
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

  // const handleSelectBudget = (id) => {
  //   setSelectedBudgetId(id);
  // };

  const handleChangeStatusTransaction = (transactionId, status, rejectNote) => {
    updateBudgetStatusMutate({ transactionId, status, rejectNote });
  };

  return (
    <Fragment>
      {contextHolder}

      <BudgetModal
        isModalOpen={isModalRejectOpen}
        setIsModalOpen={setIsModalRejectOpen}
        transactionId={transactionId}
        handleChangeStatusTransaction={handleChangeStatusTransaction}
      />
      <BudgetModal
        isModalOpen={isModalSeenRejectOpen}
        setIsModalOpen={setIsModalSeenRejectOpen}
        rejectNote={rejectNote}
      />
      <BudgetModal
        isModalOpen={isModalEvidenceRejectOpen}
        setIsModalOpen={setIsModalEvidenceRejectOpen}
        evidence={evidence}
      />

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
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Quản lý thu chi",
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
            label: "Yêu cầu",
            children: (
              <OwnBudgetTab
                ownBudget={ownBudget}
                ownBudgetIsLoading={ownBudgetIsLoading}
                ownBudgetIsError={ownBudgetIsError}
              />
            ),
          },
        ]}
      />
    </Fragment>
  );
};

export default memo(EventBudgetPage);
