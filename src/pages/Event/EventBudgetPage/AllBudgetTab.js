import React, { Fragment, memo, useState, useEffect } from "react";
import momenttz from "moment-timezone";
import { Progress, Table, Tag, Tooltip } from "antd";
import clsx from "clsx";
import { HiOutlineExclamation } from "react-icons/hi";
import AnErrorHasOccured from "../../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";

const BudgetItem = memo(({ budget, setSelectBudget }) => (
  <div
    onClick={() => setSelectBudget(budget)}
    className="flex items-center bg-white p-5 space-x-5 hover:scale-105 transition-transform cursor-pointer rounded-lg shadow-md"
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
            0.8 && { "0%": "#ff4d4f", "100%": "#ff4d4f" }
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
        <span className="text-sm text-slate-400 font-normal">VNĐ</span>
      </p>
    </div>
  </div>
));

const AllBudgetTab = ({ allBudget, allBudgetIsLoading, allBudgetIsError }) => {
  console.log("allBudget > ", allBudget);
  const mergeValue = new Set();
  const [hasFilter, setHasFilter] = useState();

  const [selectBudget, setSelectBudget] = useState();

  useEffect(() => {
    allBudget && !!allBudget?.length && setSelectBudget(allBudget?.[0]);
  }, [allBudget]);

  useEffect(() => {
    mergeValue.clear();
  }, [selectBudget, hasFilter]);

  if (allBudgetIsLoading) {
    return (
      <div className="h-[calc(100vh-200px)] w-full">
        <LoadingComponentIndicator />
      </div>
    );
  }
  if (allBudgetIsError) {
    return (
      <div className="h-[calc(100vh-220px)] w-full">
        <AnErrorHasOccured />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex justify-between space-x-10 mt-10">
        {/* LEFT SIDE */}
        <div className="w-1/4 space-y-5">
          {allBudget?.map((budget) => (
            <BudgetItem
              key={budget?.itemExisted?.id}
              budget={budget}
              setSelectBudget={setSelectBudget}
            />
          ))}
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

            <div className="relative">
              {selectBudget?.totalTransactionUsed /
                ((selectBudget?.itemExisted?.plannedPrice ?? 1) *
                  (selectBudget?.itemExisted?.plannedAmount ?? 1)) <
                0.8 && (
                <div className="absolute w-[2px] h-4/5 bg-black/20 right-[calc(20%+2rem)] top-0" />
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
            <p className="text-xl font-semibold">Khoản chi</p>

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
                  //   filters: [
                  //     { text: "CHỜ DUYỆT", value: "PENDING" },
                  //     { text: "CHẤP NHẬN", value: "ACCEPTED" },
                  //     { text: "TỪ CHỐI", value: "REJECTED" },
                  //     { text: "THÀNH CÔNG", value: "SUCCESS" },
                  //   ],
                  //   onFilter: (value, record) => {
                  //     setHasFilter(value);
                  //     return record?.status === value;
                  //   },
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

export default memo(AllBudgetTab);
