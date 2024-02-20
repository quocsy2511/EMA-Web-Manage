import React, { Fragment } from "react";
import LockLoadingModal from "../../../components/Modal/LockLoadingModal";
import { motion } from "framer-motion";
import { message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

const EventAssignTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId, eventName } = location.state;

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Fragment>
      {contextHolder}
      <LockLoadingModal
        // isModalOpen={isLoading}
        label="Đang tạo đề mục ..."
      />

      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400 truncate">
          <Link to="/manager/event" relative="path">
            Sự kiện{" "}
          </Link>
          /{" "}
          <Link to=".." relative="path">
            {eventName}{" "}
          </Link>
          / Tạo đề mục
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={clsx(
          "bg-white rounded-2xl mt-6 mx- overflow-hidden min-h-[calc(100vh-64px-7rem)]",
          {}
        )}
      ></motion.div>
    </Fragment>
  );
};

export default EventAssignTaskPage;
