import { CheckCircleFilled } from "@ant-design/icons";
import { Badge, Card, Empty, Progress, Tag, Tooltip } from "antd";
import moment from "moment";
import React from "react";

const BudgetTask = ({
  budgetItem,
  calculateBudgetParentTask,
  setSelectItemTask,
  setIsOpenTransactionModal,
  usedBudget,
  percent,
  remainingBudget,
}) => {
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "ĐANG CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      CONFIRM: { color: "purple", title: "ĐÃ XÁC THỰC" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "VỪA" },
    };
    return colorMapping[value];
  };

  const handleSelectItemTask = (item) => {
    setSelectItemTask(item);
    setIsOpenTransactionModal(true);
  };

  const calculateTotalAmountTask = (task) => {
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

  return (
    <div className=" w-full h-fit">
      <div className="w-full h-fit overflow-hidden rounded-lg border-[#e5eaef] border bg-white mb-2">
        <div className="p-3 w-full flex flex-col gap-y-1">
          <div className=" flex justify-between items-center w-full">
            <div className="flex flex-col gap-y-1 justify-start items-start">
              <p className="text-blueSecondBudget text-start font-semibold">
                Số tiền tiêu dùng
              </p>
              <h3 className="text-blueBudget font-bold text-xl">
                {usedBudget.toLocaleString()} VND
              </h3>
            </div>
            <div className="flex flex-col gap-y-1 justify-center items-center  px-5">
              <p className="text-blueSecondBudget font-semibold text-center">
                Tổng tiền còn lại
              </p>
              <h3 className="text-blueBudget font-bold text-xl text-center">
                {remainingBudget?.toLocaleString()} VND
              </h3>
            </div>
            <div className="flex flex-col gap-y-1 justify-end items-end ">
              <p className="text-blueSecondBudget font-semibold">
                Tổng tiền được giao
              </p>
              <h3 className="text-blueBudget font-bold text-xl">
                {calculateBudgetParentTask(
                  budgetItem?.itemExisted
                )?.toLocaleString()}{" "}
                VND
              </h3>
            </div>
          </div>

          <div className="w-full py-1">
            <Progress
              // percent={calculateBudgetPercent(budgetItem)}
              percent={percent}
              size="default"
              status="active"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap h-fit  gap-x-3 py-2 ">
        {budgetItem?.itemExisted?.tasks?.length > 0 ? (
          budgetItem?.itemExisted?.tasks?.map((subTask, index) => {
            let filterSub = [];
            let filterSubAccepted = [];
            if (subTask?.transactions?.length > 0) {
              filterSub = subTask?.transactions?.filter(
                (item) => item?.status === "PENDING"
              );

              filterSubAccepted = subTask?.transactions?.filter(
                (item) => item?.status === "ACCEPTED"
              );
            }

            return (
              <div
                className="mb-3 w-[32%] h-[265px] overflow-hidden flex flex-col cursor-pointer"
                key={index}
                onClick={() => handleSelectItemTask(subTask)}
              >
                <div className=" bg-white rounded-lg  w-full h-full flex flex-col hover:opacity-50">
                  <div className="w-full p-5 flex flex-row justify-between items-center text-blueBudget overflow-hidden">
                    <Tooltip title=" Mua banner để dựng sân khấu">
                      <h3 className="font-bold text-base text-start w-[80%] truncate">
                        {subTask?.title}
                      </h3>
                    </Tooltip>
                  </div>

                  <div className="w-full px-3  h-fit">
                    <Badge.Ribbon
                      text={
                        subTask?.transactions?.length > 0
                          ? filterSub?.length > 0
                            ? `Mới ${filterSub?.length}`
                            : filterSubAccepted?.length > 0
                            ? `Đã duyệt ${filterSubAccepted?.length}`
                            : "Hoàn thành"
                          : "Chưa có"
                      }
                      color={
                        subTask?.transactions?.length > 0
                          ? filterSub?.length > 0
                            ? "gold"
                            : filterSubAccepted?.length > 0
                            ? "green"
                            : ""
                          : "cyan"
                      }
                    >
                      <Card
                        // title="Số giao dịch"
                        size="small"
                        className="w-full h-fit my-1 bg-[#F7F7FF] font-medium text-blueSecondBudget"
                      >
                        Số giao dịch:{" "}
                        <b className="text-blueBudget">
                          {subTask?.transactions?.length}
                        </b>
                      </Card>
                    </Badge.Ribbon>
                  </div>

                  <div className="w-full p-5 flex flex-row gap-x-2 justify-between items-center overflow-hidden ">
                    <div className="flex flex-col justify-start items-start w-[55%]">
                      <p className="flex flex-row gap-x-1  text-blueSecondBudget text-sm font-semibold text-start">
                        <span>Đã chi (VND)</span>
                      </p>
                      <Tooltip
                        title={calculateTotalAmountTask(
                          subTask
                        )?.toLocaleString()}
                      >
                        <h3 className="text-blueBudget text-base font-bold w-[95%]  truncate">
                          {calculateTotalAmountTask(subTask)?.toLocaleString()}{" "}
                        </h3>
                      </Tooltip>
                    </div>

                    <div className="flex flex-col justify-end items-end w-[48%] text-end">
                      <p className="flex flex-row gap-x-1  text-blueSecondBudget text-sm font-semibold  text-end ">
                        <span className="">Kết thúc công việc</span>
                      </p>
                      <p className="text-blueBudget  font-bold text-sm">
                        {subTask?.endDate
                          ? moment(subTask?.endDate).format("DD-MM-YYYY")
                          : "Đang cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full p-5 flex flex-row gap-x-2 justify-between items-center overflow-hidden">
                    <p className="font-semibold">Trạng thái công việc</p>
                    <Tag
                      icon={
                        subTask?.status === "CONFIRM" && <CheckCircleFilled />
                      }
                      color={getColorStatusPriority(subTask?.status)?.color}
                      className="font-semibold"
                    >
                      {getColorStatusPriority(subTask?.status)?.title}
                    </Tag>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full justify-center items-center flex">
            <Empty
              description={<span>Hiện tại chưa có yêu cầu ngân sách nào</span>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetTask;
