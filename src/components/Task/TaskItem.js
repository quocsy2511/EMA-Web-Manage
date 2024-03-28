import React, { memo, useState } from "react";
import { Avatar, Badge, Popover, Tooltip } from "antd";
import { BsHourglassBottom, BsHourglassSplit } from "react-icons/bs";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { AiOutlineEye, AiOutlineHistory } from "react-icons/ai";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import momenttz from "moment-timezone";
import { defaultAvatar } from "../../constants/global";
import { HiMiniPencilSquare } from "react-icons/hi2";
import clsx from "clsx";
import { FaUser } from "react-icons/fa";
import AssignmentHistoryModal from "../Modal/AssignmentHistoryModal";

const TaskItem = ({
  task,
  isSubtask,
  setSelectedSubTask,
  setIsOpenModal,
  isDropdown,
  eventName,

  // Update task
  goToUpdateTask,
  goToSubTask,

  // Update subtask
  goToUpdateSubtask,
}) => {
  // console.log("TaskItem > ", task);
  const navigate = useNavigate();

  const [isOpenHistoryModal, setIsOpenHistoryModal] = useState(false);

  const responsor = isSubtask
    ? task?.assignTasks?.filter(
        (user) => user?.isLeader && user?.status === "active"
      )?.[0]
    : task?.assignTasks?.find((user) => user?.status === "active");

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
      onClick={(e) => {
        if (isSubtask && !isDropdown) {
          e.stopPropagation();
          openSubTaskModal();
        }
      }}
      className={clsx(
        "flex items-center gap-y-6 px-10 py-6 rounded-2xl cursor-pointer space-x-8 relative"
        // { "w-4/5 px-10 py-3": isDropdown }
      )}
      style={{ boxShadow: "0px 0px 18px 1px rgb(230 230 230)" }}
    >
      <AssignmentHistoryModal
        isModalOpen={isOpenHistoryModal}
        setIsModalOpen={setIsOpenHistoryModal}
        assignTasks={task?.assignTasks}
      />

      {priority}

      <div className="min-w-[20%] max-w-[30%] space-y-1">
        <p
          className={clsx("text-2xl font-medium truncate", {
            "line-through text-black/30": task?.status === "CONFIRM",
          })}
        >
          {task?.title}
        </p>

        {!isDropdown && (
          <div
            className={clsx("flex items-center gap-x-5", {
              "line-through text-black/30": task?.status === "CONFIRM",
            })}
          >
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
        <div className="w-40 flex flex-col gap-y-1 justify-center">
          <p
            className={clsx("text-center text-sm font-medium", {
              "line-through text-black/30": task?.status === "CONFIRM",
            })}
          >
            Trạng thái
          </p>
          <div
            className={`text-center flex justify-center items-center px-3 py-1 ${statusColor} border-2 ${statusBorder} rounded-full truncate`}
          >
            <p className="text-sm font-medium truncate">{status}</p>
          </div>
        </div>

        <div className="space-y-1">
          <p
            className={clsx("text-center text-sm font-medium", {
              "line-through text-black/30": task?.status === "CONFIRM",
            })}
          >
            Thời gian bắt đầu
          </p>

          <div
            className={clsx(
              "flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-lg space-x-3",
              {
                "opacity-50": task?.status === "CONFIRM",
              }
            )}
          >
            <BsHourglassSplit size={15} />
            <p
              className={clsx("text-sm font-medium", {
                "line-through": task?.status === "CONFIRM",
              })}
            >
              {task?.startDate
                ? momenttz(task.startDate).format("DD-MM-YYYY")
                : "-- : --"}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p
            className={clsx("text-center text-sm font-medium", {
              "line-through text-black/30": task?.status === "CONFIRM",
            })}
          >
            Thời gian kết thúc
          </p>

          <div
            className={clsx(
              "flex items-center px-3 py-1.5 bg-red-100 text-red-400 rounded-lg space-x-3",
              {
                "opacity-70": task?.status === "CONFIRM",
              }
            )}
          >
            <BsHourglassBottom size={15} />
            <p
              className={clsx("text-sm font-medium", {
                "line-through": task?.status === "CONFIRM",
              })}
            >
              {task?.endDate
                ? momenttz(task.endDate).format("DD-MM-YYYY")
                : "-- : --"}
            </p>
          </div>
        </div>
      </div>

      {!isDropdown && (
        <div className="shadow-2xl rounded-full">
          <Avatar
            size={40}
            alt="avatar"
            src={responsor?.user?.profile?.avatar ?? defaultAvatar}
            icon={
              <div className="flex items-center justify-center h-full">
                <FaUser />
              </div>
            }
          />
        </div>
      )}

      {!isSubtask ? (
        responsor ? (
          <Popover
            content={<p className="text-sm font-medium">Xem công việc</p>}
          >
            <Badge size="small" count={task?.subTask?.length}>
              <AiOutlineEye
                onClick={(e) => {
                  e.stopPropagation();

                  goToSubTask(task?.id);
                }}
                size={30}
                className="text-slate-400 hover:text-blue-400"
              />
            </Badge>
          </Popover>
        ) : (
          <Popover
            content={
              <p className="text-sm text-center font-medium">
                Chưa giao việc!
                <br />
                Yêu cầu cập nhật công việc
              </p>
            }
          >
            <HiMiniPencilSquare
              onClick={(e) => {
                e.stopPropagation();

                if (!isSubtask) {
                  goToUpdateTask();
                }
              }}
              size={30}
              className="scale-90 text-slate-400 hover:text-orange-500"
            />
          </Popover>
        )
      ) : (
        !isDropdown && (
          <Popover
            content={
              <p className="text-sm font-medium">
                {task?.status === "CONFIRM"
                  ? "Công việc đã hoàn thành"
                  : "Chỉnh sửa công việc"}
              </p>
            }
          >
            <HiMiniPencilSquare
              onClick={(e) => {
                e.stopPropagation();
                // setSelectedSubTask(task);
                // setIsOpenUpdateSubTaskModal(true);
                if (task?.status !== "CONFIRM") goToUpdateSubtask();
              }}
              className={clsx(
                "",
                {
                  "text-slate-600": task?.status !== "CONFIRM",
                },
                {
                  "text-black/20": task?.status === "CONFIRM",
                }
              )}
              size={25}
            />
          </Popover>
        )
      )}
    </motion.div>
  );
};

export default memo(TaskItem);
