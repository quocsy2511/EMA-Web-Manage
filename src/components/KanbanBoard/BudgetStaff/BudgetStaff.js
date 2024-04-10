import { BulbOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Empty, Spin, Tabs, Tooltip } from "antd";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router-dom";
import { getBudget, getBudgetItem } from "../../../apis/budgets";
import BudgetRequest from "./BudgetRequest";
import BudgetTask from "./BudgetTask";
import BudgetRequestModal from "./ModalBudget/BudgetRequestModal";
import BudgetTransactionModal from "./ModalBudget/BudgetTransactionModal";

const BudgetStaff = ({ selectEvent, setIsBoardTask }) => {
  const [selectItemBudgetId, setSelectItemBudgetId] = useState("");
  const [selectBudget, setSelectBudget] = useState("");
  const location = useLocation();
  const { parentTaskId, contractId } = location.state ?? {};
  const staffId = useRouteLoaderData("staff")?.id;
  const [isOpenTransactionModal, setIsOpenTransactionModal] = useState(false);
  const [selectItemTask, setSelectItemTask] = useState("");
  const [isOpenRequestModal, setIsOpenRequestModal] = useState(false);
  const [selectTransactionTask, setSelectTransactionTask] = useState("");
  const [activeKey, setActiveKey] = useState("task");
  const {
    data: budgets,
    isError: isErrorBudgets,
    isLoading: isLoadingBudgets,
  } = useQuery(
    ["budgets", staffId, selectEvent?.id],
    () =>
      getBudget({
        assignee: staffId,
        eventID: selectEvent?.id,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!selectEvent?.id,
    }
  );

  const {
    data: budgetItem,
    isError: isErrorBudgetItem,
    isLoading: isLoadingBudgetItem,
    refetch: refetchBudgetItem,
  } = useQuery(
    ["budgetItem", selectItemBudgetId],
    () => getBudgetItem(selectItemBudgetId),
    {
      refetchOnWindowFocus: false,
      enabled: !!selectItemBudgetId,
    }
  );

  useEffect(() => {
    if (!isLoadingBudgets && !isErrorBudgets) {
      setSelectItemBudgetId(budgets?.[0]?.item?.id);
      setSelectBudget(budgets?.[0]);
    }
  }, [isLoadingBudgets, isErrorBudgets]);

  const handleSelect = (task) => {
    setSelectBudget(task);
    setSelectItemBudgetId(task?.item?.id);
    refetchBudgetItem();
  };

  //hàm tính tiền hạn mức
  const calculateBudgetParentTask = (item) => {
    if (!isLoadingBudgets && item) {
      const total = parseInt(
        (item.plannedPrice * item.plannedAmount * item.percentage) / 100
      );
      return total;
    }
  };

  // tính tiền còn lại
  // Hàm tính tổng các transaction có trạng thái SUCCESS hoặc ACCEPTED
  const sumSuccessfulTransactions = (task) => {
    if (!task || !task?.transactions || !task?.transactions.length < 0) {
      return 0;
    }
    const totalAmount = task.transactions.reduce((total, transaction) => {
      if (
        transaction.status === "SUCCESS" ||
        transaction.status === "ACCEPTED"
      ) {
        total += transaction.amount;
      }
      return total;
    }, 0);
    return totalAmount;
  };
  // Hàm tính tổng các task
  const sumTasks = (tasks) => {
    if (!tasks) return 0;
    return tasks.reduce((total, task) => {
      return total + sumSuccessfulTransactions(task);
    }, 0);
  };

  let percent = 0;
  let usedBudget = 0;
  let remainingBudget = 0;
  if (
    !isLoadingBudgetItem &&
    !isLoadingBudgets &&
    budgets?.length > 0 &&
    budgetItem
  ) {
    const total = calculateBudgetParentTask(budgetItem?.itemExisted);
    usedBudget = sumTasks(budgetItem?.itemExisted?.tasks);

    remainingBudget = total - usedBudget;
    percent = ((usedBudget / total) * 100).toFixed(0);
  }

  const onChangeTabs = (key) => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (parentTaskId) {
      const findBudget = budgets?.find((budget) => budget.id === parentTaskId);
      handleSelect(findBudget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentTaskId, contractId]);

  return (
    <>
      <div className="bg-bgG w-full h-[calc(100vh-76px-4rem)] ">
        <div className="w-full px-5 mt-3  overflow-y-scroll scrollbar-hide min-h-full ">
          {/* header */}
          <div className="flex flex-row w-full  py-2">
            <div className="flex flex-row w-full justify-between items-center mb-2 ">
              <div className="w-[40%] flex flex-col justify-center items-start  py-2">
                <h3 className="font-semibold text-3xl text-blueBudget mb-2">
                  Ngân sách công việc
                </h3>
                <Spin spinning={isLoadingBudgets} className="inline-block">
                  <p className="mb-2 text-blueSecondBudget inline-block">
                    Quản lí chi phí công việc:{" "}
                    <b className="text-blueBudget">{selectBudget?.title}</b>
                  </p>
                </Spin>
              </div>
              <div className="w-[60%] flex justify-end text-end">
                <ul className="pl-0 list-none inline-block mt-6">
                  <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                    <span
                      className="cursor-pointer hover:text-blueBudget"
                      onClick={() => setIsBoardTask(true)}
                    >
                      <span className="font-bold">Bảng công việc</span>
                    </span>
                    <DoubleRightOutlined />
                  </li>
                  <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                    <span className="cursor-pointer hover:text-blueBudget">
                      <span className="font-bold">Ngân Sách</span>
                    </span>
                    <DoubleRightOutlined />
                  </li>
                  <li className="relative float-left mr-0 text-blueSecondBudget">
                    <Spin spinning={isLoadingBudgets}>
                      <span>{selectBudget?.title}</span>
                    </Spin>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* content */}
          <div className="outline-none w-full py-2 min-h-full ">
            <Spin spinning={isLoadingBudgets}>
              {budgets?.length > 0 ? (
                <div className="flex flex-row w-full min-h-full ">
                  {/* leftSide */}
                  <div className="w-[25%] overflow-hidden min-h-fit ">
                    <div className="w-full min-h-fit ">
                      <div className="w-full px-3 space-y-3">
                        {/* cardParentTask */}
                        {budgets?.map((task) => (
                          <div
                            key={task?.id}
                            className={`${
                              selectBudget?.id === task?.id
                                ? "bg-bgCardBudget"
                                : "bg-white"
                            } py-5 px-2 cursor-pointer rounded-lg flex items-center flex-col justify-between w-full `}
                            onClick={() => handleSelect(task)}
                          >
                            <div className="w-full overflow-hidden flex flex-row justify-center items-center gap-x-2 mb-[2px]">
                              <div
                                className={` ${
                                  selectBudget?.id === task?.id
                                    ? "bg-[#2321b0]"
                                    : "bg-[#e1e1f9]"
                                }  rounded-full flex justify-center h-[40px] w-[50px] items-center`}
                              >
                                <BulbOutlined
                                  className={`${
                                    selectBudget?.id === task?.id
                                      ? "text-[#e1e1f9]"
                                      : " text-[#2F2CD8] "
                                  } text-base  h-[265px]`}
                                />
                              </div>
                              <Tooltip title="Hạng mục 1 chuẩn bị sân khấu">
                                <h3
                                  className={`text-lg font-semibold truncate w-full  ${
                                    selectBudget?.id === task?.id
                                      ? "text-[#e1e1f9]"
                                      : " text-[#1f2c73]"
                                  }`}
                                >
                                  {task?.title}
                                </h3>
                              </Tooltip>
                            </div>
                            <div className=" w-full overflow-hidden flex flex-row justify-between px-2 items-center ">
                              <p
                                className={`text-sm  ${
                                  selectBudget?.id === task?.id
                                    ? "text-[#e1e1f9]"
                                    : " text-blueSecondBudget "
                                }  font-semibold ml-10`}
                              >
                                {calculateBudgetParentTask(
                                  task?.item
                                ).toLocaleString()}{" "}
                                VND
                              </p>
                              <span
                                className={`${
                                  selectBudget?.id === task?.id
                                    ? "text-[#e1e1f9]"
                                    : " text-blueSecondBudget "
                                }  text-xs font-semibold `}
                              >
                                {moment(task?.item?.createdAt).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RightSize */}
                  <div className="w-[75%] overflow-hidden mx-2 min-h-fit">
                    <Spin spinning={isLoadingBudgetItem}>
                      <Tabs
                        // defaultActiveKey="task"
                        activeKey={activeKey}
                        className=" p-0 m-0"
                        items={[
                          {
                            key: "task",
                            label: "Công việc",
                            children: (
                              <BudgetTask
                                budgetItem={budgetItem}
                                calculateBudgetParentTask={
                                  calculateBudgetParentTask
                                }
                                percent={percent}
                                usedBudget={usedBudget}
                                setIsOpenTransactionModal={
                                  setIsOpenTransactionModal
                                }
                                setSelectItemTask={setSelectItemTask}
                                remainingBudget={remainingBudget}
                              />
                            ),
                          },
                          {
                            key: "request",
                            label: "Yêu cầu",
                            children: (
                              <BudgetRequest selectBudget={selectBudget} />
                            ),
                          },
                        ]}
                        onChange={onChangeTabs}
                        tabPosition="right"
                      />
                    </Spin>
                  </div>
                </div>
              ) : (
                <div className="w-full justify-center items-center py-8">
                  <Empty
                    description={
                      <span>Hiện tại chưa có ngân sách công việc nào</span>
                    }
                  />
                </div>
              )}
            </Spin>
          </div>
        </div>
      </div>

      {isOpenTransactionModal && (
        <BudgetTransactionModal
          selectItemTask={selectItemTask}
          isOpenTransactionModal={isOpenTransactionModal}
          setIsOpenTransactionModal={setIsOpenTransactionModal}
          usedBudget={usedBudget}
          selectItemBudgetId={selectItemBudgetId}
          remainingBudget={remainingBudget}
          setIsOpenRequestModal={setIsOpenRequestModal}
          setSelectTransactionTask={setSelectTransactionTask}
        />
      )}
      {isOpenRequestModal && (
        <BudgetRequestModal
          isOpenRequestModal={isOpenRequestModal}
          setIsOpenRequestModal={setIsOpenRequestModal}
          title={selectBudget?.title}
          taskParentId={selectBudget?.id}
          selectTransactionTask={selectTransactionTask}
          setActiveKey={setActiveKey}
        />
      )}
    </>
  );
};

export default memo(BudgetStaff);
