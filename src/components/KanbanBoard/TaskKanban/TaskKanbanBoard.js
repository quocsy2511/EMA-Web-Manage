import { CheckSquareOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import React from "react";

const TaskKanbanBoard = ({
  setIsOpenTaskModal,
  setTaskParent,
  task,
  setTaskSelected,
}) => {
  const openTaskModalHandler = () => {
    setIsOpenTaskModal(true);
    setTaskParent(false);
    setTaskSelected(task);
  };

  const formattedDate = (value) => {
    const date = new Date(value).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
    return date;
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
              task.status === "PROCESSING"
                ? "bg-blue-300 bg-opacity-20 text-blue-600 rounded-md"
                : task.status === "DONE"
                ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                : task.status === "CONFIRMED"
                ? "bg-[#65a9a2] bg-opacity-20 text-[#13676a] rounded-md"
                : task.status === "PENDING"
                ? "bg-[#f9d14c] bg-opacity-20 text-[#faad14] rounded-md"
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
            {/* {task?.comment?.length} */}
            {!task.comment ? 0 : task?.comment?.length}
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
            {!task.file ? 0 : task.file?.length}
          </span>
        </div>
        <div className="flex justify-end items-center mt-4">
          <Tooltip key="avatar" title={task.member?.name} placement="top">
            <Avatar src={task.member?.avatar} size="small" />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default TaskKanbanBoard;
