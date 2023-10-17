import React from "react";
import { Avatar } from "antd";
import { BsHourglassBottom, BsHourglassSplit } from "react-icons/bs";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { BiDetail } from "react-icons/bi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../apis/users";
import moment from "moment";

const TaskItem = ({ task, isSubtask, setSelectedSubTask, setIsOpenModal }) => {
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(
    ["user", task.assignTasks[0]?.assignee],
    () => getUserById(task.assignTasks[0]?.assignee),
    {
      enabled: task.assignTasks.length !== 0,
    }
  );

  const goToSubTask = () => {
    navigate(`${task.id}`);
  };

  const openSubTaskModal = () => {
    setSelectedSubTask(task);
    setIsOpenModal(true);
  };

  return (
    <motion.div
      layout
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      exit={{ x: 100 }}
      whileHover={{ x: 5, y: -5 }}
      onClick={!isSubtask ? goToSubTask : openSubTaskModal}
      className="flex items-center px-10 py-6 rounded-2xl cursor-pointer"
      style={{ boxShadow: "0px 0px 18px 1px rgb(230 230 230)" }}
    >
      <FcLowPriority size={25} />

      <div className="w-[2%]" />

      <div className="space-y-1">
        <p className="text-xl font-semibold">{task.title}</p>
        {task.assignTasks.length !== 0 && (
          <p className="text-xs">
            Chịu trách nhiệm bởi{" "}
            <span className="font-medium">
              {user?.fullName ?? "Tên người dùng"}
            </span>{" "}
            ( {user?.divisionName ?? ""} )
          </p>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-xl">
          <BsHourglassSplit size={15} />
          <div className="w-4" />
          <p className="text-sm font-medium">
            {moment(task.startDate).format("YYYY/MM/DD")}
          </p>
        </div>
        <div className="w-[4%]" />
        <div className="flex items-center px-3 py-1.5 bg-red-100 text-red-400 rounded-xl">
          <BsHourglassBottom size={15} />
          <div className="w-4" />
          <p className="text-sm font-medium">
            {moment(task.endDate).format("YYYY/MM/DD")}
          </p>
        </div>
      </div>

      <div className="w-[4%]" />

      {task.assignTasks.length !== 0 && (
        <Avatar
          size={35}
          alt="avatar"
          src={
            user?.avatar ??
            "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
          }
        />
      )}

      <div className={`${!isSubtask ? "w-[4%]" : "w-[2%]"}`} />

      {!isSubtask && <BiDetail size={25} className="text-slate-400" />}
    </motion.div>
  );
};

export default TaskItem;
