import React from "react";
import { Avatar, Input, Popconfirm } from "antd";
import {
  AiOutlineSearch,
  AiOutlineCheckSquare,
  AiOutlineCloseSquare,
} from "react-icons/ai";
import { LuMailOpen, LuMail } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment/moment";

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
      <div className="overflow-y-scroll flex-1">
        {/* <AnimatePresence> */}
        {requests?.map((request, index) => (
          <motion.div
            // layout
            key={index}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="py-3 px-5 border-b cursor-pointer group"
            onClick={handleSelectedRequest}
          >
            <motion.div
              whileHover={{ x: 2, y: -2 }}
              className="flex items-center justify-center gap-x-4 w-[99%]"
            >
              <Avatar size={30} src={request.user?.profile?.avatar} />
              <p className="text-sm font-medium">
                {request.user?.profile?.fullName}
              </p>
              <p className="text-sm text-slate-500 w-[50%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                {request.title}
              </p>
              <div className="flex items-center justify-end gap-x-2 text-xs text-slate-500 flex-1">
                <div className="w-2 h-2 bg-red-400 rounded-full block group-hover:hidden" />
                <p className="group-hover:hidden">
                  {moment(request.createdAt).format("DD [tháng] MM, YYYY")}
                </p>
                <p className="group-hover:hidden">
                  {moment(request.createdAt).format("HH:mm")}
                </p>
                {/* <Popconfirm onClick={(e) => e.stopPropagation()}>
                  <HiOutlineTrash
                    className="hidden group-hover:block"
                    size={20}
                  />
                </Popconfirm> */}
                <AiOutlineCheckSquare
                  onClick={(e) => e.stopPropagation()}
                  className="hidden group-hover:block mr-2 text-blue-500"
                  size={20}
                />
                <AiOutlineCloseSquare
                  onClick={(e) => e.stopPropagation()}
                  className="hidden group-hover:block mr-2 text-red-500"
                  size={20}
                />

                <LuMailOpen size={18} />
                <LuMail size={18} />
              </div>
            </motion.div>
          </motion.div>
        ))}
        {/* </AnimatePresence> */}
      </div>
    </motion.div>
  );
};

export default RequestsList;
