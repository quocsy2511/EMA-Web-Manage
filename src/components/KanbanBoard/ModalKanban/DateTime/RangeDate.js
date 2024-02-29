import moment from "moment";
import React from "react";

const RangeDate = ({ taskSelected, updateEndDate, updateStartDate }) => {
  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM");
    return date;
  };
  return (
    <div className="flex justify-start items-center mt-4 px-3">
      <span
        className={` px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 ${
          taskSelected.status === "CANCEL" || taskSelected.status === "OVERDUE"
            ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
            : taskSelected.status === "DONE"
            ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
            : ""
        }`}
      >
        {formattedDate(updateStartDate)} - {formattedDate(updateEndDate)}
      </span>
    </div>
  );
};

export default RangeDate;
