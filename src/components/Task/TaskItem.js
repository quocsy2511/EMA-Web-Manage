import React from "react";
import { Avatar, Badge } from "antd";
import { BsHourglassBottom, BsHourglassSplit } from "react-icons/bs";
import {
  FcApprove,
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { CgDanger } from "react-icons/cg";
import { AiOutlineEye } from "react-icons/ai";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../apis/users";
import { RiAttachment2 } from "react-icons/ri";
import { BiDetail } from "react-icons/bi";

const TaskItem = ({
  task,
  isSubtask,
  setSelectedSubTask,
  setIsOpenUpdateSubTaskModal,
  setIsOpenModal,
  isDropdown,
}) => {
  const navigate = useNavigate();
  const { data: user } = useQuery(
    // ["user", task.assignTasks?.[0]?.user.id],
    ["user", task.assignTasks?.find((item) => item.isLeader === true)?.user.id],
    () =>
      getUserById(
        task.assignTasks?.find((item) => item.isLeader === true)?.user.id
      ),
    {
      enabled: !!task.assignTasks?.find((item) => item.isLeader === true)?.user
        .id,
    }
  );

  // if (isSubtask) console.log("SUBTASK: ", task);
  // if (isDropdown) console.log("DROPDOWN: ", task);
  // console.log("TASK: ", task);

  const goToSubTask = () => {
    navigate(`${task.id}`);
  };

  const openSubTaskModal = () => {
    setSelectedSubTask(task);
    setIsOpenModal(true);
  };

  let priority;
  switch (task.priority) {
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
  switch (task.status) {
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
      statusColor = "text-pink-400";
      statusBorder = "border-pink-400";
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
      className="flex items-center gap-y-6 px-10 py-6 rounded-2xl cursor-pointer"
      style={{ boxShadow: "0px 0px 18px 1px rgb(230 230 230)" }}
    >
      {/* {priority} */}
      {!isSubtask ? (
        <Badge size="small" count={task.subTask?.length}>
          {priority}
        </Badge>
      ) : (
        priority
      )}
      <div className="w-[2%]" />
      <div className="w-[30%] space-y-1">
        <p className="text-xl font-semibold">
          {task.title}
          {/* <Badge size="" count={1} /> */}
          {/* <span className="text-sm font-normal">
            {!isSubtask && `(${task.subTask.length})`}
          </span> */}
        </p>
        <div className="flex items-center gap-x-5">
          {user ? (
            <p className="text-xs">
              Chịu trách nhiệm bởi{" "}
              <span className="font-medium">{user.fullName}</span>
            </p>
          ) : (
            <p className="text-xs">Chưa phân công</p>
          )}
          {task.taskFiles?.length !== 0 &&
            !isDropdown &&
            task.taskFiles?.map((file, index) => (
              <a
                key={index}
                className="text-blue-500 hover:scale-110"
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <RiAttachment2
                  className="text-blue-500 hover:scale-110"
                  size={16}
                />
              </a>
            ))}
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <div
          className={`text-center font-medium flex justify-center items-center px-3 ${statusColor} border-2  ${statusBorder} rounded-full`}
        >
          {status}
        </div>

        <div className="w-[4%]" />

        <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-lg">
          <BsHourglassSplit size={15} />
          <div className="w-4" />
          <p className="text-sm font-medium">
            {task.startDate
              ? moment(task.startDate)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("DD/MM/YYYY HH:mm:ss")
              : "-- : --"}
          </p>
        </div>
        <div className="w-[4%]" />
        <div className="flex items-center px-3 py-1.5 bg-red-100 text-red-400 rounded-lg">
          <BsHourglassBottom size={15} />
          <div className="w-4" />
          <p className="text-sm font-medium">
            {task.endDate
              ? moment(task.endDate)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("DD/MM/YYYY HH:mm:ss")
              : "-- : --"}
          </p>
        </div>
      </div>
      <div className="w-[4%]" />

      {/* {task.assignTasks?.length !== 0 && ( */}
      <Avatar
        size={35}
        alt="avatar"
        src={
          user?.avatar ??
          "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
        }
      />
      {/* )} */}

      <div className={`${!isSubtask ? "w-[4%]" : "w-[2%]"}`} />
      {!isSubtask ? (
        <AiOutlineEye
          onClick={(e) => {
            e.stopPropagation();
            goToSubTask();
          }}
          size={25}
          className="text-slate-400 hover:text-blue-400"
        />
      ) : !isDropdown ? (
        <BiDetail
          onClick={(e) => {
            setSelectedSubTask(task);
            setIsOpenUpdateSubTaskModal(true);
            e.stopPropagation();
          }}
          className="text-slate-400"
          size={25}
        />
      ) : null}
    </motion.div>
  );
};

export default TaskItem;
