import {
  BulbOutlined,
  CheckSquareOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Tag, Tooltip } from "antd";
import React from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getComment } from "../../../apis/comments";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";

const TaskKanbanBoard = ({
  setIsOpenTaskModal,
  setTaskParent,
  task,
  setTaskSelected,
}) => {
  const { assignTasks, id, status } = task;
  const openTaskModalHandler = () => {
    setIsOpenTaskModal(true);
    setTaskParent(false);
    setTaskSelected(task);
  };

  const {
    data: listComments,
    isError: isErrorListComments,
    isLoading: isLoadingListComments,
  } = useQuery(["comments", id], () => getComment(id), {
    select: (data) => {
      const formatDate = data.map(({ ...item }) => {
        item.createdAt = moment(item.createdAt).format("MM/DD HH:mm");
        return {
          ...item,
        };
      });
      return formatDate;
    },
    enabled: !!task,
  });

  let totalTaskFiles = task?.taskFiles?.length;
  let totalFiles = totalTaskFiles;
  listComments?.forEach((item) => {
    let totalCommentFiles = item.commentFiles.length;
    totalFiles += totalCommentFiles;
  });

  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM");
    return date;
  };
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "success", title: "HOÀN THÀNH" },
      PENDING: { color: "warning", title: "ĐANG CHỜ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "red", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "TRUNG BÌNH" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  return (
    <>
      <div
        className="w-[250px] mx-auto my-5 rounded-lg bg-white  shadow-darkShadow py-3 px-3 shadow-lg hover:opacity-60  cursor-pointer"
        onClick={() => openTaskModalHandler()}
      >
        <p className="font-normal text-sm tracking-wide hover:text-secondary ">
          {task?.title}
        </p>

        {/* Sumary */}
        <div className="flex justify-start items-center gap-x-2 cursor-pointer mt-1 flex-wrap">
          <span
            className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
              task.status === "CANCEL" || task.status === "OVERDUE"
                ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                : task.status === "DONE"
                ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                : ""
            }`}
          >
            {task.status === "confirmed" && (
              <CheckSquareOutlined className="text-[#08979c]" />
            )}
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
            {/* {task.time} */}
            {formattedDate(task.endDate)}
          </span>

          {!isLoadingListComments ? (
            !isErrorListComments ? (
              <>
                <span className="flex justify-center items-center gap-x-1 text-xs font-medium">
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
                      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  {listComments?.length}
                </span>
                <span className="flex justify-center items-center gap-x-1 text-xs font-medium">
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
                      d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                    />
                  </svg>
                  {totalFiles}
                </span>
              </>
            ) : (
              <AnErrorHasOccured />
            )
          ) : (
            <LoadingComponentIndicator />
          )}
        </div>
        <div className="flex justify-start items-center gap-x-2 cursor-pointer mt-1 flex-wrap">
          <Tag
            color={getColorStatusPriority(status).color}
            className="h-fit w-fit mt-1 gap-x-1 flex flex-row"
          >
            <BulbOutlined />
            {getColorStatusPriority(status).title}
          </Tag>
        </div>
        <div className="flex justify-end items-center mt-4">
          <Avatar.Group
            maxCount={3}
            maxStyle={{
              color: "#D25B68",
              backgroundColor: "#F4D7DA",
            }}
          >
            {assignTasks.length > 0 &&
              assignTasks.map((item, index) => (
                <Tooltip
                  key="avatar"
                  title={item.user?.profile.fullName}
                  placement="top"
                >
                  {item.user === null ? (
                    <Avatar
                      icon={<UserOutlined />}
                      size="small"
                      className="bg-gray-500"
                    />
                  ) : (
                    <Avatar src={item.user?.profile.avatar} size="small" />
                  )}
                </Tooltip>
              ))}
          </Avatar.Group>
        </div>
      </div>
    </>
  );
};

export default TaskKanbanBoard;
