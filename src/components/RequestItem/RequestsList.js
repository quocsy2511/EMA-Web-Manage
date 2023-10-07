import React from "react";
import { Avatar, Input, Popconfirm } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi2";
import { LuMailOpen } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

const RequestsList = ({ requests, setSelectedRequest }) => {
  const handleSelectedRequest = (request) => {
    setSelectedRequest(request);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden flex flex-col bg-white"
    >
      <div className="w-full h-14 border-b px-2 flex items-center">
        <Input
          placeholder="Tìm kiếm"
          prefix={<AiOutlineSearch size={18} className="text-slate-500 mr-2" />}
          bordered={false}
          //   onChange={}
          // onPressEnter={}
        />
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: [0.8, 1.3, 1] }}
        transition={{ staggerChildren: 1, delayChildren: 2 }}
        className="overflow-y-scroll flex-1"
      >
        {/* <AnimatePresence> */}
        {requests.map((request, index) => (
          <motion.div
          layout
            key={index}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: [0.8, 1.3, 1] }}
            // exit={{ scale: 1, opacity: 1 }}
            className="py-3 px-5 border-b cursor-pointer group"
            onClick={handleSelectedRequest}
          >
            <motion.div
              whileHover={{ x: 5, y: -2 }}
              className="flex items-center justify-center gap-x-4 w-[99%]"
            >
              <Avatar
                size={30}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3mvt8nCdl5Z0ebV9k3Pqo-BPJYTCEdLnirA&usqp=CAU"
              />
              <p className="text-sm font-medium">Chandler Bing</p>
              <p className="text-sm text-slate-500 w-[50%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                Focused impactful open issues from the project of GitHub
              </p>
              <div className="flex items-center justify-end gap-x-2 text-xs text-slate-500 flex-1">
                <div className="w-2 h-2 bg-red-400 rounded-full block group-hover:hidden" />
                <p className="group-hover:hidden">15 Tháng 5</p>
                <p className="group-hover:hidden">08:40</p>
                {/* <Popconfirm onClick={(e) => e.stopPropagation()}>
                  <HiOutlineTrash
                    className="hidden group-hover:block"
                    size={20}
                  />
                </Popconfirm> */}
                <LuMailOpen className="hidden group-hover:block" size={18} />
              </div>
            </motion.div>
          </motion.div>
        ))}
        {/* </AnimatePresence> */}
      </motion.div>
    </motion.div>
  );
};

export default RequestsList;
