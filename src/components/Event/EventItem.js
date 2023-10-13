import React from "react";
import { Avatar } from "antd";
import { BsHourglassBottom, BsFolder2Open, BsHourglassSplit } from "react-icons/bs";
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
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", duration: 0.5 }}
      className={`group md:w-[32%] w-[45%] rounded-md cursor-pointer bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg')] bg-auto bg-center`}
      onClick={() => navigate(`${event.id}`)}
    >
      <div className="p-5 bg-black bg-opacity-20 rounded-md group-hover:bg-opacity-60">
        <div className="flex justify-between items-center">
          <p className="text-xl text-white font-semibold">{event.eventName}</p>
          <div className="flex justify-between items-center">
            <p
              className={`text-sm font-medium px-3 py-2 ${statusBgColor} ${statusColor} rounded-lg`}
            >
              {status}
            </p>
            <div className="w-3" />
            <AiOutlineInfoCircle className="text-white" size={25} />
          </div>
        </div>

        <div className="w-full bg-slate-200 mt-3 mb-7" style={{ height: 1 }} />

        {/* 1 line = 1rem = +4  */}
        <p
          dangerouslySetInnerHTML={{ __html: event.description }}
          className="text-sm text-slate-200 line-clamp-4 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></p>

        <div className="h-7" />

        <div className="flex gap-x-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-x-2 text-white bg-white bg-opacity-20 px-2 py-1 rounded-lg">
            <BsHourglassSplit size={18} />
            <p className="font-semibold">{event.startDate}</p>
          </div>
          <div className="flex items-center gap-x-2 text-white bg-white bg-opacity-20 px-2 py-1 rounded-lg">
            <BsHourglassBottom size={18} />
            <p className="font-semibold">{event.endDate}</p>
          </div>
        </div>

        <div className="h-5" />

        <div className="flex justify-between items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-x-4">
            <p className="text-white font-medium">Chịu trách nhiệm</p>
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
          <div className="flex justify-between items-center text-white">
            <BsFolder2Open size={20} />

            <div className="w-2" />

            <p className="text-sm font-medium ">
              {/* {`${event.tasks.length} đề mục`} */}5 đề mục
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventItem;
