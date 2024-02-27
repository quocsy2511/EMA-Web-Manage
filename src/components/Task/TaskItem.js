import React, { memo } from "react";
import { Avatar, Badge, Popover } from "antd";
import { BsHourglassBottom, BsHourglassSplit } from "react-icons/bs";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { AiOutlineEye } from "react-icons/ai";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../apis/users";
import { RiAttachment2 } from "react-icons/ri";
import { MdMode } from "react-icons/md";
import { defaultAvatar } from "../../constants/global";
import clsx from "clsx";

const TaskItem = ({
  task,
  isSubtask,
  setSelectedSubTask,
  setIsOpenUpdateSubTaskModal,
  setIsOpenModal,
  isDropdown,
  eventName,
}) => {
  const navigate = useNavigate();

  console.log("task > ", task);
  const responsor = task?.assignTasks?.[0];

  const goToSubTask = () => {
    if (eventName) navigate(`${task?.id}`, { state: { eventName } });
  };

  const openSubTaskModal = () => {
    setSelectedSubTask(task);
    setIsOpenModal(true);
  };

  let priority;
  switch (task?.priority) {
    case "LOW":
      priority = <FcLowPriority size={30} />;
      break;
    case "MEDIUM":
      priority = <FcMediumPriority size={30} />;
      break;
    case "HIGH":
      priority = <FcHighPriority size={30} />;
      break;

    default:
      break;
  }

  let status, statusColor, statusBorder;
  switch (task?.status) {
    case "PENDING":
      status = "Đang chuẩn bị";
      statusColor = "text-gray-400";
      statusBorder = "border-gray-400";
      break;

    case "PROCESSING":
      status = "Đang thực hiện";
      statusColor = "text-blue-400";
      statusBorder = "border-blue-400";
      break;

    case "DONE":
      status = "Hoàn thành";
      statusColor = "text-green-400";
      statusBorder = "border-green-400";
      break;

    case "CONFIRM":
      status = "Đã xác thực";
      statusColor = "text-purple-400";
      statusBorder = "border-purple-400";
      break;

    case "CANCEL":
      status = "Hủy bỏ";
      statusColor = "text-red-500";
      statusBorder = "border-red-500";
      break;

    case "OVERDUE":
      status = "Quá hạn";
      statusColor = "text-orange-500";
      statusBorder = "border-orange-500";
      break;

    default:
      break;
  }

  return (
    <motion.div
      layout
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      whileHover={{ x: 5, y: -5 }}
      onClick={() => {
        if (isSubtask && !isDropdown) openSubTaskModal();
      }}
      className={clsx(
        "flex items-center gap-y-6 px-10 py-6 rounded-2xl cursor-pointer space-x-8",
        { "w-4/5 px-10 py-3": isDropdown }
      )}
      style={{ boxShadow: "0px 0px 18px 1px rgb(230 230 230)" }}
    >
      {priority}

      <div className="min-w-[20%] max-w-[30%] space-y-1">
        <p className="text-2xl font-medium truncate">{task?.title}</p>

        {!isDropdown && (
          <div className="flex items-center gap-x-5">
            {responsor ? (
              <p className="text-sm font-normal">
                Chịu trách nhiệm bởi{" "}
                <span className="font-medium">
                  {responsor?.user?.profile?.fullName ?? "Nhân viên"}
                </span>
              </p>
            ) : (
              <p className="text-xs">Chưa phân công</p>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex justify-end space-x-8">
        <div className="w-1/5 flex flex-col gap-y-1 justify-center">
          <div
            className={`text-center flex justify-center items-center px-3 py-1 ${statusColor} border-2  ${statusBorder} rounded-full truncate`}
          >
            <p className="text-sm font-medium truncate">{status}</p>
          </div>
        </div>

        {/* <div className="w-[4%]" /> */}

        <div className="space-y-1">
          <p className="text-center text-sm font-medium">Thời gian bắt đầu</p>

          <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-lg space-x-3">
            <BsHourglassSplit size={15} />
            <p className="text-sm font-medium">
              {task?.startDate
                ? moment(task.startDate).utc().format("DD/MM/YYYY")
                : "-- : --"}
            </p>
          </div>
          {/* <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-lg">
              <p className="text-sm font-medium">
                {task?.startDate
                  ? moment(task.startDate).utc().format("HH:mm")
                  : "-- : --"}
              </p>
            </div> */}
        </div>

        {/* <div className="w-[4%]" /> */}

        <div className="space-y-1">
          <p className="text-center text-sm font-medium">Thời gian kết thúc</p>
          <div className="flex items-center px-3 py-1.5 bg-red-100 text-red-400 rounded-lg space-x-3">
            <BsHourglassBottom size={15} />
            <p className="text-sm font-medium">
              {task?.endDate
                ? moment(task.endDate).utc().format("DD/MM/YYYY")
                : "-- : --"}
            </p>
          </div>
          {/* <div className="flex items-center px-3 py-1.5 bg-red-100 text-red-400 rounded-lg">
              <p className="text-sm font-medium">
                {task?.endDate
                  ? moment(task.endDate).utc().format("HH:mm")
                  : "-- : --"}
              </p>
            </div> */}
        </div>
      </div>

      {!isDropdown && (
        <div className="shadow-2xl rounded-full">
          <Avatar
            size={40}
            alt="avatar"
            src={responsor?.user?.profile?.avatar ?? defaultAvatar}
            defaultAvatar={defaultAvatar}
          />
        </div>
      )}

      {!isSubtask ? (
        <Popover
          content={
            <p className="text-sm font-medium">
              {responsor ? "Xem công việc" : "Chưa giao việc"}
            </p>
          }
        >
          <Badge size="small" count={task?.subTask?.length}>
            <AiOutlineEye
              onClick={(e) => {
                e.stopPropagation();
                if (responsor) goToSubTask();
              }}
              size={30}
              className="text-slate-400 hover:text-blue-400"
            />
          </Badge>
        </Popover>
      ) : (
        !isDropdown && (
          <MdMode
            onClick={(e) => {
              setSelectedSubTask(task);
              setIsOpenUpdateSubTaskModal(true);
              e.stopPropagation();
            }}
            className="text-slate-400 border-2 p-2 rounded-xl"
            size={40}
          />
        )
      )}
    </motion.div>
  );
};

export default memo(TaskItem);
