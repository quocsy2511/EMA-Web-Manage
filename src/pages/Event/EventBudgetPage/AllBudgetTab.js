import React, { Fragment, memo, useState, useEffect } from "react";
import momenttz from "moment-timezone";
import { Image, Progress, Table, Tag, Tooltip } from "antd";
import clsx from "clsx";
import { HiOutlineExclamation } from "react-icons/hi";
import { FaFileLines } from "react-icons/fa6";
import { IoRemoveOutline } from "react-icons/io5";
import AnErrorHasOccured from "../../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";

const BudgetItem = memo(({ budget, selectBudget, setSelectBudget }) => (
  <div
    onClick={() => setSelectBudget(budget)}
    className={clsx(
      "flex items-center bg-white p-5 mx-5 space-x-5 hover:scale-105 transition-transform cursor-pointer rounded-lg shadow-md",
      { "scale-110": selectBudget?.id === budget?.id }
    )}
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

const AllBudgetTab = ({ allBudget, allBudgetIsLoading, allBudgetIsError }) => {
  console.log("allBudget > ", allBudget);
  const mergeValue = new Set();
  const [hasFilter, setHasFilter] = useState();

  const [selectBudget, setSelectBudget] = useState();

  useEffect(() => {
    return () => {
      setSelectBudget();
    };
  }, []);

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
      <div className="flex justify-between space-x-10 mt-6 pb-20">
        {/* LEFT SIDE */}
        <div className="w-1/4 space-y-5">
          <p className="text-lg text-center text-slate-400 mx-5 font-medium truncate bg-white p-5 rounded-md">
            Danh sách hạng mục
          </p>

          <div className="space-y-5 max-h-[100vh] overflow-y-scroll scrollbar-hide pt-5">
            {allBudget?.map((budget) => (
              <BudgetItem
                key={budget?.itemExisted?.id}
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
              <p className="text-base text-slate-400 font-normal">
                Đã chi tiêu
              </p>
              <p className="text-base text-slate-400 font-normal">Khả dụng</p>
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
                    left: `calc(${selectBudget?.itemExisted?.percentage - 6}%)`,
                  }}
                />
              </Tooltip>
              {selectBudget?.totalTransactionUsed /
                ((selectBudget?.itemExisted?.plannedPrice ?? 1) *
                  (selectBudget?.itemExisted?.plannedAmount ?? 1)) <
                selectBudget?.itemExisted?.percentage / 100 && <></>}
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
                    selectBudget?.itemExisted?.percentage / 100 && {
                    "0%": "#ff4d4f",
                    "100%": "#ff4d4f",
                  }
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
                    <p className="">
                      {momenttz(text).format("DD-MM-YYYY HH:ss")}
                    </p>
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
                  title: "Hóa đơn",
                  dataIndex: "amount",
                  align: "center",
                  render: (_, record) => {
                    // "image/jpg"
                    return (
                      <div className="flex justify-center">
                        {record?.status === "SUCCESS" ? (
                          <div
                            className={clsx("flex justify-center", {
                              "cursor-pointer": !!record?.evidences?.length,
                            })}
                          >
                            <Tooltip
                              title={
                                !record?.evidences?.length && "Không có hóa đơn"
                              }
                            >
                              <div className="relative">
                                <FaFileLines className="text-2xl text-blue-500" />
                              </div>
                            </Tooltip>

                            {!!record?.evidences?.length && (
                              <div className="absolute left-0 right-0 opacity-0">
                                <Image.PreviewGroup>
                                  {record?.evidences?.map((evidence, index) => (
                                    <Image
                                      key={evidence?.id}
                                      width={index === 0 ? "1.5rem" : 0}
                                      src={evidence?.evidenceUrl}
                                    />
                                  ))}
                                </Image.PreviewGroup>
                              </div>
                            )}
                          </div>
                        ) : (
                          <IoRemoveOutline className="text-2xl text-black/30" />
                        )}
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

export default memo(AllBudgetTab);
