import { Avatar, Tooltip } from "antd";
import React from "react";

const TaskKanbanBoard = ({ setIsOpenTaskModal, setTaskParent }) => {
  const openTaskModalHandler = () => {
    setIsOpenTaskModal(true);
    setTaskParent(false);
  };

  return (
    <>
      <div
        className="w-[250px] mx-auto my-5 rounded-lg bg-white dark:bg-dark shadow-darkShadow py-3 px-3 shadow-lg hover:opacity-80 dark:text-white cursor-pointer"
        onClick={() => openTaskModalHandler()}
      >
        <p className="font-normal text-sm tracking-wide hover:text-secondary dark:hover:text-secondary ">
          {/* {task.title} */}
          Thiết kế Banner bục giảng
        </p>

        {/* Sumary */}
        <div className="flex justify-start items-center gap-x-2 cursor-pointer mt-1 flex-wrap">
          {/* <span>
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
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span> */}
          <span
            // className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
            //   task.color === "red"
            //     ? "bg-red-300 bg-opacity-20 text-red-600 dark:bg-red-600 dark:bg-opacity-40 dark:text-red-400 rounded-md"
            //     : task.color === "green"
            //     ? "bg-green-300 bg-opacity-20 text-green-600 dark:bg-green-600 dark:bg-opacity-40 dark:text-green-400 rounded-md"
            //     : ""
            // }`}
            className="px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 bg-green-300 bg-opacity-20 text-green-600 dark:bg-green-600 dark:bg-opacity-40 dark:text-green-400 rounded-md"
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
            {/* {task.time} */}
            08/27
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
            {/* {task.comment.length} */}4
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
            {/* {task.attachments.length} */}4
          </span>
        </div>
        <div className="flex justify-end items-center mt-4">
          {/* <Avatar.Group
            maxCount={3}
            maxStyle={{
              color: "#D25B68",
              backgroundColor: "#F4D7DA",
              fontSize: "11px",
            }}
            size="small"
          >
            {boardItem.members.map((member) => {
              return (
                <Tooltip key={member.name} title={member.name} placement="top">
                  <Avatar src={member.avatar} size="small" />
                </Tooltip>
              );
            })}
          </Avatar.Group> */}
          <Tooltip key="avatar" title="Vu Nguyen" placement="top">
            <Avatar
              src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
              size="small"
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default TaskKanbanBoard;
