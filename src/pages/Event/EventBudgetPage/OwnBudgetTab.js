import React, { Fragment, memo, useEffect, useState } from "react";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../../components/Error/AnErrorHasOccured";
import {
  Progress,
  Table,
  Tooltip,
  Tag,
  Dropdown,
  Empty,
  Popconfirm,
} from "antd";
import clsx from "clsx";
import momenttz from "moment-timezone";
import { BsThreeDots } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateBudgetTransaction,
  updatePercentageBudget,
} from "../../../apis/budgets";
import BudgetModal from "../../../components/Modal/BudgetModal";

const BudgetItem = memo(({ budget, selectBudget, setSelectBudget }) => (
  <div
    onClick={() => setSelectBudget(budget)}
    className="flex items-center bg-white p-5 mx-5 space-x-5 hover:scale-105 transition-transform cursor-pointer rounded-lg shadow-md"
  >
    <div className="min-w-[20%] flex justify-center items-center">
      <Progress
        size="small"
        type="dashboard"
        percent={(
          (budget?.totalTransactionUsed /
            ((budget?.itemExisted?.plannedPrice ?? 1) *
              (budget?.itemExisted?.plannedAmount ?? 1))) *
          100
        )?.toFixed(0)}
        strokeColor={
          budget?.totalTransactionUsed /
            ((budget?.itemExisted?.plannedPrice ?? 1) *
              (budget?.itemExisted?.plannedAmount ?? 1)) >=
            budget?.itemExisted?.percentage / 100 && {
            "0%": "#ff4d4f",
            "100%": "#ff4d4f",
          }
        }
        gapDegree={30}
      />
    </div>
    <div className="flex-1 overflow-hidden">
      <Tooltip title={budget?.title ?? "Tên hạng mục"} placement="topLeft">
        <p className="w-full text-xl font-semibold truncate">{budget?.title}</p>
      </Tooltip>
      <p className="text-base">
        {(
          budget?.itemExisted?.plannedAmount * budget?.itemExisted?.plannedPrice
        )?.toLocaleString()}{" "}
        <span className="text-xs text-slate-400 font-normal">VNĐ</span>
      </p>
    </div>
  </div>
));

const OwnBudgetTab = ({
  ownBudget,
  ownBudgetIsLoading,
  ownBudgetIsError,
  messageApi,
}) => {
  console.log("ownBudget > ", ownBudget);

  const mergeValue = new Set();
  const [selectBudget, setSelectBudget] = useState();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState({
    isOpen: false,
    transactionId: null,
  });
  // const [isRejectNoteModalOpen, setIsRejectNoteModalOpen] = useState({
  //   isOpen: false,
  //   rejectNote: null,
  // });
  // const [isHavingEvidenceModalOpen, setIsHavingEvidenceModalOpen] = useState({
  //   isOpen: false,
  //   evidences: null,
  // });

  useEffect(() => {
    ownBudget && !!ownBudget?.length && setSelectBudget(ownBudget?.[0]);
  }, [ownBudget]);

  const queryClient = useQueryClient();
  const {
    mutate: updateStatusTransactionMutate,
    isLoading: updateStatusTransactionIsLoading,
  } = useMutation(
    ({ transactionId, status, rejectNote }) =>
      updateBudgetTransaction({ transactionId, status, rejectNote }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["transaction-request-own"]);
        queryClient.invalidateQueries(["transaction-request-all"]);

        setIsRejectModalOpen((prev) => ({ ...prev, isOpen: false }));

        messageApi.open({
          type: "success",
          content: "Cập nhật trạng thái thành công",
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

  const {
    mutate: updatePercentageBudgetMutate,
    isLoading: updatePercentageBudgetIsLoading,
  } = useMutation(
    ({ transactionId, amount }) =>
      updatePercentageBudget({ transactionId, amount }),
    {
      onSuccess: (data) => {
        messageApi.open({
          type: "success",
          content: "Cập nhật trạng thái thành công",
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

  const handleUpdateStatusTransaction = (transactionId, status, rejectNote) => {
    updateStatusTransactionMutate({ transactionId, status, rejectNote });
  };

  const handleUpdatePercentageBudgetMutate = (transactionId, amount) => {
    updatePercentageBudgetMutate({ transactionId, amount });
  };

  if (ownBudgetIsLoading) {
    return (
      <div className="h-[calc(100vh-200px)] w-full">
        <LoadingComponentIndicator />
      </div>
    );
  }
  if (ownBudgetIsError) {
    return (
      <div className="h-[calc(100vh-220px)] w-full">
        <AnErrorHasOccured />
      </div>
    );
  }

  if (!ownBudget?.length) {
    return (
      <div className="h-[60vh] w-full flex flex-col justify-center items-center space-y-2">
        <Empty description={false} />
        <p className="font-medium text-xl">Chưa có yêu cầu nào.</p>
      </div>
    );
  }

  return (
    <Fragment>
      <BudgetModal
        isModalOpen={isRejectModalOpen}
        setIsModalOpen={setIsRejectModalOpen}
        handleUpdateStatusTransaction={handleUpdateStatusTransaction}
        messageApi={messageApi}
      />

      <div className="flex justify-between space-x-10 mt-6">
        {/* LEFT SIDE */}
        <div className="w-1/4 space-y-5">
          <p className="text-3xl mx-5 font-semibold truncate bg-white p-5 rounded-md">
            Danh sách hạng mục
          </p>

          <div className="space-y-5 max-h-[100vh] overflow-y-scroll scrollbar-hide pt-5">
            {ownBudget?.map((budget) => (
              <BudgetItem
                key={budget?.id}
                budget={budget}
                selectBudget={selectBudget}
                setSelectBudget={setSelectBudget}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 overflow-hidden space-y-8">
          <p className="w-full text-3xl font-semibold truncate bg-white p-5 rounded-md">
            {selectBudget?.title}
          </p>

          <div className="bg-white p-5 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-base text-slate-400 font-normal">Đã sử dụng</p>
              <p className="text-base text-slate-400 font-normal">Hạn mức</p>
            </div>

            <div className="flex justify-between items-center">
              <p
                className={clsx("text-2xl font-semibold", {
                  "text-red-500":
                    selectBudget?.totalTransactionUsed >
                    selectBudget?.itemExisted?.plannedPrice *
                      selectBudget?.itemExisted?.plannedAmount,
                })}
              >
                {selectBudget?.totalTransactionUsed?.toLocaleString()}{" "}
                <span
                  className={clsx("text-sm font-normal", {
                    "text-slate-400":
                      selectBudget?.totalTransactionUsed <=
                      selectBudget?.itemExisted?.plannedPrice *
                        selectBudget?.itemExisted?.plannedAmount,
                    "text-red-500":
                      selectBudget?.totalTransactionUsed >
                      selectBudget?.itemExisted?.plannedPrice *
                        selectBudget?.itemExisted?.plannedAmount,
                  })}
                >
                  VNĐ
                </span>
                {selectBudget?.totalTransactionUsed >
                  selectBudget?.itemExisted?.plannedPrice *
                    selectBudget?.itemExisted?.plannedAmount && (
                  <p className="inline-block ml-3">
                    (-$
                    {(
                      selectBudget?.totalTransactionUsed -
                      selectBudget?.itemExisted?.plannedPrice *
                        selectBudget?.itemExisted?.plannedAmount
                    )?.toLocaleString()}
                    ){" "}
                    <span className={clsx("text-sm font-normal text-red-500")}>
                      VNĐ
                    </span>
                  </p>
                )}
              </p>
              <p className="text-2xl text-black font-semibold">
                {(
                  selectBudget?.itemExisted?.plannedPrice *
                  selectBudget?.itemExisted?.plannedAmount
                )?.toLocaleString()}{" "}
                <span className="text-sm font-normal text-slate-400">VNĐ</span>
              </p>
            </div>

            <div className="relative pb-5">
              {selectBudget?.totalTransactionUsed /
                ((selectBudget?.itemExisted?.plannedPrice ?? 1) *
                  (selectBudget?.itemExisted?.plannedAmount ?? 1)) <
                selectBudget?.itemExisted?.percentage / 100 && (
                <Tooltip
                  title={
                    <p className="text-base text-center">
                      Hạn mức
                      <br />
                      {(
                        selectBudget?.itemExisted?.plannedPrice *
                        selectBudget?.itemExisted?.plannedAmount *
                        (selectBudget?.itemExisted?.percentage / 100)
                      ).toLocaleString()}{" "}
                      VNĐ
                    </p>
                  }
                  placement="top"
                >
                  <div
                    className={`absolute z-10 w-1 h-1/2 bg-black/20 top-0 mx-5 cursor-pointer`}
                    style={{
                      left: `calc(${selectBudget?.itemExisted?.percentage}% - 2rem)`,
                    }}
                  />
                </Tooltip>
              )}
              <Progress
                percent={(
                  (selectBudget?.totalTransactionUsed /
                    ((selectBudget?.itemExisted?.plannedPrice ?? 1) *
                      (selectBudget?.itemExisted?.plannedAmount ?? 1))) *
                  100
                )?.toFixed(0)}
                format={(percent) =>
                  percent >= 100 ? (
                    <div className="text-[#ff4d4f] text-center">
                      <HiOutlineExclamation className="text-[#ff4d4f] text-2xl" />
                      {(
                        (selectBudget?.totalTransactionUsed /
                          ((selectBudget?.itemExisted?.plannedPrice ?? 1) *
                            (selectBudget?.itemExisted?.plannedAmount ?? 1))) *
                        100
                      )?.toFixed(0)}
                      %
                    </div>
                  ) : (
                    `${percent}%`
                  )
                }
                strokeColor={
                  selectBudget?.totalTransactionUsed /
                    ((selectBudget?.itemExisted?.plannedPrice ?? 1) *
                      (selectBudget?.itemExisted?.plannedAmount ?? 1)) >=
                    0.8 && { "0%": "#ff4d4f", "100%": "#ff4d4f" }
                }
                type="line"
              />
            </div>
          </div>

          <div className="p-5 pb-16 bg-white">
            <p className="text-xl font-semibold mb-5">Khoản chi</p>

            <Table
              columns={[
                {
                  title: "Công việc",
                  dataIndex: "title",
                  onCell: (record, index) => {
                    let tableData = selectBudget?.itemExisted?.tasks
                      ?.map((subtask) =>
                        subtask?.transactions?.map((transaction) => ({
                          ...transaction,
                          title: subtask?.title,
                          key: subtask?.id + transaction?.id,
                        }))
                      )
                      .flat();

                    // if (hasFilter) {
                    //   tableData?.filter((data) => data?.status === hasFilter);
                    // }

                    if (mergeValue?.has(record?.title)) {
                      return { rowSpan: 0 };
                    } else {
                      const rowCount = tableData?.filter((data) => {
                        if (data?.title === record?.title) return data;
                      })?.length;
                      mergeValue.add(record?.title);
                      return { rowSpan: rowCount };
                    }
                  },
                  width: "15%",
                },
                {
                  title: "Giao dịch",
                  dataIndex: "transactionName",
                  width: "15%",
                  render: (text) => <p className="line-clamp-2">{text}</p>,
                },
                {
                  title: "Mô tả",
                  dataIndex: "description",
                  width: "25%",
                  render: (text) => <p className="line-clamp-2">{text}</p>,
                },
                {
                  title: "Ngày tạo",
                  dataIndex: "createdAt",
                  // width: "25%",
                  align: "center",
                  render: (text) => (
                    <p className="">{momenttz(text).format("DD-MM-YYYY")}</p>
                  ),
                },
                {
                  title: "Giá thành (VNĐ)",
                  dataIndex: "amount",
                  align: "center",
                  render: (text) => (
                    <p className="font-medium">{text?.toLocaleString()}</p>
                  ),
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  align: "center",
                  render: (text) => {
                    if (text === "PENDING")
                      return <Tag color="orange">CHỜ DUYỆT</Tag>;
                    if (text === "ACCEPTED")
                      return <Tag color="green">CHẤP NHẬN</Tag>;
                    if (text === "REJECTED")
                      return <Tag color="red">TỪ CHỐI</Tag>;
                    if (text === "SUCCESS")
                      return <Tag color="blue">THÀNH CÔNG</Tag>;
                  },
                },
                {
                  title: "Hành động",
                  dataIndex: "",
                  align: "center",
                  render: (_, record) => {
                    return (
                      <div className="flex justify-center cursor-pointer">
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "1",
                                label: (
                                  <Popconfirm
                                    title="Xác nhận chấp nhận liên hệ"
                                    description="Bạn có chắc chắn chấp nhận liên hệ này?"
                                    onConfirm={() => {
                                      handleUpdatePercentageBudgetMutate(
                                        record?.id,
                                        record?.amount
                                      );
                                    }}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                  >
                                    <div className="flex space-x-2 items-center">
                                      <FaCheck className="text-green-500 text-lg" />
                                      <p>Chấp nhận</p>
                                    </div>
                                  </Popconfirm>
                                ),
                                disabled: record?.status !== "PENDING",
                              },
                              {
                                key: "2",
                                label: (
                                  <div
                                    onClick={() => {
                                      setIsRejectModalOpen({
                                        isOpen: true,
                                        transactionId: record?.id,
                                      });
                                    }}
                                    className="flex space-x-2 items-center"
                                  >
                                    <CgClose className="text-red-500 text-lg" />
                                    <p>Từ chối</p>
                                  </div>
                                ),
                                disabled: record?.status !== "PENDING",
                              },
                            ],
                          }}
                          arrow
                        >
                          <BsThreeDots className="text-xl" />
                        </Dropdown>
                      </div>
                    );
                  },
                },
              ]}
              dataSource={selectBudget?.itemExisted?.tasks
                ?.map((subtask) =>
                  subtask?.transactions?.map((transaction) => ({
                    ...transaction,
                    title: subtask?.title,
                    key: subtask?.id + transaction?.id,
                  }))
                )
                .flat()}
              bordered
              pagination={false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(OwnBudgetTab);
