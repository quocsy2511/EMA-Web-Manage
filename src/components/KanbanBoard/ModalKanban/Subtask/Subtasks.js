import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Select, Tag, Tooltip, message } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../../apis/tasks";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import StatusSelected from "../Status/StatusSelected";

const Subtasks = ({
  onChangeSubtask,
  Subtask,
  setSelectedSubTask,
  disableUpdate,
}) => {
  const { id } = Subtask;
  const {
    data: subtaskDetails,
    isError: isErrorSubtaskDetails,
    isLoading: isLoadingSubtaskDetails,
  } = useQuery(
    ["subtaskDetails", id],
    () =>
      getTasks({
        fieldName: "id",
        conValue: id,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        if (data.startDate && data.endDate) {
          const formatDate = data.map(({ ...item }) => {
            item.startDate = moment(item.startDate).format(
              "YYYY/MM/DD HH:mm:ss"
            );
            item.endDate = moment(item.endDate).format("YYYY/MM/DD HH:mm:ss");
            return {
              ...item,
            };
          });
          return formatDate;
        }
        return data;
      },
      refetchOnMount: false,
      enabled: !!Subtask?.id,
    }
  );

  const selectSubtaskHandler = () => {
    setSelectedSubTask(subtaskDetails?.[0]);
  };

  const [updateStatus, setUpdateStatus] = useState(Subtask?.status);

  const getColorStatus = (status) => {
    const colorMapping = {
      DONE: { color: "green", status: "HOÀN THÀNH" },
      PENDING: { color: "default", status: "CHUẨN BỊ" },
      CANCEL: { color: "red", status: "ĐÃ HUỶ" },
      PROCESSING: { color: "processing", status: "ĐANG DIỄN RA" },
      OVERDUE: { color: "red", status: "QUÁ HẠN" },
      CONFIRM: { color: "purple", status: "XÁC NHẬN" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[status];
  };

  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM HH:mm");
    return date;
  };

  return (
    <div className="mt-2 flex flex-col gap-y-2 cursor-pointer ">
      <div className="mt-1 flex flex-col gap-y-2 pb-2">
        <div className="flex flex-row  cursor-pointer justify-center items-center">
          <input
            className={
              updateStatus === "CANCEL" || updateStatus === "OVERDUE"
                ? "line-through decoration-red-500 decoration-2 opacity-30 bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
                : updateStatus === "CONFIRM"
                ? "line-through decoration-purple-500 decoration-2 opacity-30 bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
                : "bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
            }
            placeholder="title task"
            value={Subtask.title}
            onChange={(e) => onChangeSubtask(Subtask.id, e.target.value)}
            id="board-name-input"
            type="text"
            disabled
          />
          {disableUpdate ? (
            <Tag color={getColorStatus(updateStatus).color} className="h-fit">
              {getColorStatus(updateStatus).status}
            </Tag>
          ) : (
            <StatusSelected
              updateStatus={updateStatus}
              setUpdateStatus={setUpdateStatus}
              taskSelected={Subtask}
              taskParent={false}
              classNameStyle="ml-6"
            />
          )}

          <EyeOutlined
            className="text-blue-500"
            onClick={() => selectSubtaskHandler(subtaskDetails?.[0])}
          />
        </div>
        <div
          className={
            updateStatus === "confirmed"
              ? "opacity-50 flex flex-row justify-start items-center"
              : "flex flex-row justify-start items-center"
          }
        >
          {/* Subtask member */}
          <div className="flex pl-2">
            <div className="flex justify-start items-center">
              <Avatar.Group
                maxCount={3}
                maxStyle={{
                  color: "#D25B68",
                  backgroundColor: "#F4D7DA",
                }}
              >
                {!isLoadingSubtaskDetails ? (
                  !isErrorSubtaskDetails ? (
                    <>
                      {subtaskDetails?.[0].assignTasks.length > 0 &&
                        subtaskDetails?.[0].assignTasks.map((item, index) => (
                          <Tooltip
                            key="avatar"
                            title={item.user?.profile?.fullName}
                            placement="top"
                          >
                            {item?.user?.profile === null ? (
                              <Avatar
                                icon={<UserOutlined />}
                                size="small"
                                className="bg-gray-500"
                              />
                            ) : (
                              <Avatar
                                src={item.user?.profile?.avatar}
                                size="small"
                              />
                            )}
                          </Tooltip>
                        ))}
                    </>
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <LoadingComponentIndicator />
                )}
              </Avatar.Group>
            </div>
          </div>
          {/* Subtask date */}
          <div className="flex pl-2 ">
            <div className="flex justify-start items-center">
              <span
                className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
                  updateStatus === "PROCESSING"
                    ? "bg-blue-300 bg-opacity-20 text-blue-600 rounded-md"
                    : updateStatus === "DONE"
                    ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                    : updateStatus === "CONFIRM"
                    ? "bg-purple-300 bg-opacity-20 text-purple-500 rounded-md"
                    : updateStatus === "CANCEL" || updateStatus === "OVERDUE"
                    ? "bg-red-300 bg-opacity-20 text-red-500 rounded-md"
                    : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formattedDate(Subtask.endDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subtasks;
