import { Tag } from "antd";
import React from "react";

const PriorityTag = ({ updatePriority, setIsOpenPriority }) => {
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "ĐANG CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "VỪA" },
      CONFIRM: { color: "purple", title: "ĐÃ XÁC THỰC" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  return (
    <div className="cursor-pointer">
      <Tag
        color={getColorStatusPriority(updatePriority)?.color}
        className="h-fit hover:text-blue-500 hover:border-blue-500"
        onClick={() => setIsOpenPriority(true)}
      >
        {getColorStatusPriority(updatePriority)?.title}
      </Tag>
    </div>
  );
};

export default PriorityTag;
