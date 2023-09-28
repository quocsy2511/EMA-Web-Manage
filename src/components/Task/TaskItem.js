import React from "react";
import { Avatar } from "antd";
import { BsHourglassBottom, BsHourglassSplit } from "react-icons/bs";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { BiDetail } from "react-icons/bi";

const TaskItem = ({ task }) => {
  return (
    <div
      className="flex items-center px-10 py-6 rounded-2xl cursor-pointer"
      style={{ boxShadow: "0px 0px 5px 1px #ccc" }}
    >
      <FcLowPriority size={25} />

      <div className="w-[2%]" />

      <div className="space-y-1">
        <p className="text-xl font-semibold">Lễ khai giảng</p>
        <p className="text-xs">
          Chịu trách nhiệm bởi <span className="font-medium">Quốc Sỹ</span> (
          Thiết kế )
        </p>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-xl">
          <BsHourglassSplit size={15} />
          <div className="w-4" />
          <p className="text-sm font-medium">28/9/2023</p>
        </div>
        <div className="w-[4%]" />
        <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-400 rounded-xl">
          <BsHourglassBottom size={15} />
          <div className="w-4" />
          <p className="text-sm font-medium">28/9/2023</p>
        </div>
      </div>

      <div className="w-[4%]" />

      <Avatar
        size={35}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
      />

      <div className="w-[4%]" />

      <BiDetail size={25} className="text-slate-400" />
    </div>
  );
};

export default TaskItem;
