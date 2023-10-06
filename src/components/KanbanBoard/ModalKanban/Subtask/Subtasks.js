import { EyeOutlined, OrderedListOutlined } from "@ant-design/icons";
import { Avatar, Select, Tag, Tooltip } from "antd";
import React, { useState } from "react";

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

const Subtasks = ({
  onChangeCheckSubTask,
  onChangeSubtask,
  boardItem,
  isOpenDate,
  onChange,
  onOk,
  deadline,
  setIsOpenDate,
  Subtask,
  setSelectedSubTask,
}) => {
  const onCLick = (value) => {
    setSelectedSubTask(value);
  };
  const [confirmed, setConfirmed] = useState(false);
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

  return (
    <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-subTask-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          <OrderedListOutlined style={{ fontSize: 24 }} />
        </label>
      </div>
      <div className="w-full flex flex-col">
        <h3 className="text-lg font-bold">Subtask (1/3)</h3>
        <div className="mt-2 flex flex-col gap-y-2 cursor-pointer ">
          {Subtask.map((item) => (
            <div key={item.id} className="mt-1 flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2 cursor-pointer ">
                <input
                  className={
                    item.status === "done"
                      ? "line-through decoration-red-700 decoration-2 opacity-30 bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
                      : "bg-transparent px-2 py-1 rounded-md text-sm font-medium border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer "
                  }
                  placeholder="title task"
                  value={item.title}
                  onChange={(e) => onChangeSubtask(item.id, e.target.value)}
                  id="board-name-input"
                  type="text"
                />
                {!isOpenStatus ? (
                  <Tag
                    color={getColorStatus(item.status)}
                    onClick={() => setIsOpenStatus(true)}
                    className="h-fit"
                  >
                    {item.status}
                  </Tag>
                ) : (
                  <Select
                    removeIcon={true}
                    bordered={false}
                    defaultValue={item.status}
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
                  onClick={() => onCLick(item)}
                />
              </div>
              <div
                className={
                  item.checked
                    ? "opacity-50 flex flex-row justify-start items-center"
                    : "flex flex-row justify-start items-center"
                }
              >
                {/* Subtask member */}
                <div className="flex pl-2">
                  <div className="flex justify-start items-center">
                    <Tooltip key="1" title="Vu" placement="top">
                      <Avatar
                        src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
                        size="small"
                      />
                    </Tooltip>
                  </div>
                </div>
                {/* Subtask date */}
                <div className="flex pl-2 ">
                  <div className="flex justify-start items-center">
                    <span
                      // className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
                      //   task.color === "red"
                      //     ? "bg-red-300 bg-opacity-20 text-red-600 dark:bg-red-600 dark:bg-opacity-40 dark:text-red-400 rounded-md"
                      //     : task.color === "green"
                      //     ? "bg-green-300 bg-opacity-20 text-green-600 dark:bg-green-600 dark:bg-opacity-40 dark:text-green-400 rounded-md"
                      //     : ""
                      // }`}
                      className="px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 bg-green-300 bg-opacity-20 text-green-600 dark:bg-green-600 dark:bg-opacity-40 dark:text-green-400 rounded-md cursor-pointer"
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
                      08/27 at 12:32
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subtasks;
