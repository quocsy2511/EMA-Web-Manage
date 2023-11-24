import React from "react";
import emptyFolder from "../../assets/images/empty_folder.png";
import emptyTimekeeping from "../../assets/images/empty-timekeeping.png";
import { motion } from "framer-motion";

const EmptyTimeKeeping = ({ isEmptyDate }) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="mt-[6%] w-full min-h-full bg-white rounded-lg flex flex-col items-center justify-center gap-y-2"
    >
      <img
        className="m-auto w-[15%] md:w-[20%] "
        src={isEmptyDate ? emptyTimekeeping : emptyFolder}
      />
      <p className="m-auto text-lg text-slate-600 font-medium">
        {isEmptyDate ? "Hãy chọn sự kiến để xem chấm công" : "Chưa có chấm công "}
      </p>
    </motion.div>
  );
};

export default EmptyTimeKeeping;
