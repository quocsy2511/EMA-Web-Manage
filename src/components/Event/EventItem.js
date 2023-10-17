import React from "react";
import { Avatar } from "antd";
import {
  BsHourglassBottom,
  BsFolder2Open,
  BsFolderX,
  BsHourglassSplit,
  BsArrowRightShort,
} from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EventItem = ({ event }) => {
  const navigate = useNavigate();

  let status, statusColor, statusBgColor;

  switch (event.status) {
    case "PENDING":
      status = "Chờ bắt đầu";
      statusColor = "text-slate-500";
      statusBgColor = "bg-slate-100";
      break;
    case "PROCESSING":
      status = "Đang diễn ra";
      statusColor = "text-orange-500";
      statusBgColor = "bg-orange-100";
      break;
    case "DONE":
      status = "Đã kết thúc";
      statusColor = "text-green-500";
      statusBgColor = "bg-green-100";
      break;
    case "CANCEL":
      status = "Hủy bỏ";
      statusColor = "text-red-500";
      statusBgColor = "bg-red-100";
      break;
    default:
      break;
  }

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", duration: 0.5 }}
      className={`group md:w-[32%] w-[45%] rounded-md cursor-pointer bg-white p-5 shadow-lg`}
      onClick={() => navigate(`${event.id}`)}
    >
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">{event.eventName}</p>
        <div className="flex justify-between items-center">
          <p
            className={`text-sm font-medium px-3 py-2 ${statusBgColor} ${statusColor} rounded-lg`}
          >
            {status}
          </p>
          <div className="w-3" />
          <AiOutlineInfoCircle
            className="text-slate-300 group-hover:text-black transition-all"
            size={25}
          />
        </div>
      </div>

      <div className="w-full bg-slate-200 mt-3 mb-5" style={{ height: 1 }} />

      {/* 1 line = 1rem = +4  */}
      <p
        dangerouslySetInnerHTML={{ __html: event.description }}
        className="text-sm text-slate-500 line-clamp-3 h-16"
      ></p>

      <div className="h-7" />

      <div className="flex items-center gap-x-3">
        <div className="flex items-center gap-x-2 text-green-600 bg-green-400 bg-opacity-20 px-2 py-1 rounded-lg">
          <BsHourglassSplit size={18} />
          <p className="font-semibold">{event.startDate}</p>
        </div>
        <BsArrowRightShort size={20} />
        <div className="flex items-center gap-x-2 text-red-500 bg-red-300 bg-opacity-20 px-2 py-1 rounded-lg">
          <BsHourglassBottom size={18} />
          <p className="font-semibold">{event.endDate}</p>
        </div>
      </div>

      <div className="h-5" />

      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex items-center gap-x-4">
          <p className="font-medium">Chịu trách nhiệm</p>
          <Avatar.Group
            maxCount={event.listDivision.length}
            maxPopoverTrigger="hover"
            maxStyle={{ color: "#D25B68", backgroundColor: "#F4D7DA" }}
          >
            {event.listDivision.map((item) => (
              <Avatar
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
                // src={item.avatar}
              />
            ))}
          </Avatar.Group>
        </div>
        <div className="flex justify-between items-center text-black">
          {event.taskCount > 0 ? (
            <BsFolder2Open size={20} />
          ) : (
            <BsFolderX size={20} />
          )}

          <div className="w-2" />

          {event.taskCount > 0 && (
            <p className="text-sm font-medium">{event.taskCount} đề mục</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventItem;
