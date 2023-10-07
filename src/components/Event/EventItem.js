import React from "react";
import { Avatar } from "antd";
import { BsHourglassBottom, BsFolder2Open } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EventItem = ({ event }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="md:w-[32%] w-[45%] bg-white rounded-md p-5 cursor-pointer"
      onClick={() => navigate(`${"11"}`)}
    >
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">{event.title}</p>
        <div className="flex justify-between items-center">
          <p
            className={`text-sm font-medium px-3 py-2 bg-green-100 text-green-500 rounded-lg`}
          >
            Ongoing
          </p>
          <div className="w-3" />
          <FiEdit className="text-slate-500" size={20} />
        </div>
      </div>

      <div className="w-full bg-black mt-3 mb-7" style={{ height: 1 }} />

      {/* 1 line = 1rem = +4  */}
      <p className="text-sm line-clamp-4 h-20">{event.desc}</p>

      <div className="h-7" />

      <div className="flex items-center gap-x-2 text-red-500">
        <BsHourglassBottom size={18} />
        <p className="font-semibold">{event.endDate.toString()}</p>
      </div>

      <div className="h-5" />

      <div className="flex justify-between items-center cursor-pointer">
        <div>
          <Avatar.Group
            maxCount={4}
            maxPopoverTrigger="hover"
            maxStyle={{ color: "#D25B68", backgroundColor: "#F4D7DA" }}
          >
            {event.users.map((user) => (
              <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />
            ))}
          </Avatar.Group>
        </div>
        <div className="flex justify-between items-center text-slate-500">
          <BsFolder2Open size={18} />

          <div className="w-2" />

          <p className="text-sm font-medium ">{`${event.tasks.length} task lớn`}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EventItem;
