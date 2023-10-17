import { EyeOutlined } from "@ant-design/icons";
import { Avatar, Select, Tag } from "antd";
import React, { useState } from "react";
import Members from "../FieldSubtask/Members";

const statusTask = [
  {
    value: "processing",
    label: "Processing",
    color: "processing",
  },
  {
    value: "done",
    label: "done",
    color: "lime",
  },
  {
    value: "pending",
    label: "pending",
    color: "warning",
  },
  {
    value: "confirmed",
    label: "confirmed",
    color: "success",
  },
];

const Subtasks = ({ onChangeSubtask, Subtask, setSelectedSubTask }) => {
  const { assignTasks } = Subtask;
  const selectSubtaskHandler = (value) => {
    console.log(
      "🚀 ~ file: Subtasks.js:32 ~ selectSubtaskHandler ~ value:",
      value
    );

    setSelectedSubTask(value);
  };

  const [isOpenStatus, setIsOpenStatus] = useState(false);

  const getColorStatus = (status) => {
    const colorMapping = {
      done: "success",
      pending: "warning",
      confirmed: "cyan",
      processing: "processing",
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[status];
  };

  const handleChangeStatus = (value) => {
    console.log(`selected ${value}`);
  };

  const formattedDate = (value) => {
    const date = new Date(value)
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\//g, "-");

    return date;
  };

  return (
    <div className="mt-2 flex flex-col gap-y-2 cursor-pointer ">
      <div className="mt-1 flex flex-col gap-y-2">
        <div className="flex flex-row gap-x-2 cursor-pointer ">
          <input
            className={
              Subtask.status === "confirmed"
                ? "line-through decoration-red-700 decoration-2 opacity-30 bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
                : "bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
            }
            placeholder="title task"
            value={Subtask.title}
            onChange={(e) => onChangeSubtask(Subtask.id, e.target.value)}
            id="board-name-input"
            type="text"
          />
          {!isOpenStatus ? (
            <Tag
              color={getColorStatus(Subtask.status)}
              onClick={() => setIsOpenStatus(true)}
              className="h-fit"
            >
              {Subtask.status}
            </Tag>
          ) : (
            <Select
              removeIcon={true}
              bordered={false}
              defaultValue={Subtask.status}
              className="w-[170px]"
              onChange={(value) => handleChangeStatus(value)}
            >
              {statusTask.map((status) => (
                <Select.Option key={status.value} o>
                  <Tag color={status.color}>{status.label}</Tag>
                </Select.Option>
              ))}
            </Select>
          )}
          <EyeOutlined
            className="text-blue-500"
            onClick={() => selectSubtaskHandler(Subtask)}
          />
        </div>
        <div
          className={
            Subtask.status === "confirmed"
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
                {assignTasks.length > 0 &&
                  assignTasks.map((item) => (
                    <Members
                      userId={item.assignee}
                      size="small"
                      key={item.assignee}
                    />
                  ))}
              </Avatar.Group>
            </div>
          </div>
          {/* Subtask date */}
          <div className="flex pl-2 ">
            <div className="flex justify-start items-center">
              <span
                className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
                  Subtask.status === "processing"
                    ? "bg-blue-300 bg-opacity-20 text-blue-600 rounded-md"
                    : Subtask.status === "done"
                    ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                    : Subtask.status === "confirmed"
                    ? "bg-[#65a9a2] bg-opacity-20 text-[#13676a] rounded-md"
                    : Subtask.status === "pending"
                    ? "bg-[#f9d14c] bg-opacity-20 text-[#faad14] rounded-md"
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
