import React from "react";
import emptyItem from "../../assets/images/empty_item.jpg";
import { motion } from "framer-motion";

const EmptyList = ({ title }) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center"
    >
      <img className="m-auto" src={emptyItem} />
      <p className="text-base text-slate-500">{title}</p>
    </motion.div>
  );
};

export default EmptyList;
