import { Tag } from "antd";
import React from "react";

const PriorityTag = ({ updatePriority, setIsOpenPriority }) => {
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "TRUNG BÌNH" },
      CONFIRM: { color: "purple", title: "XÁC NHẬN" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  return (
    <div className="px-3">
      <Tag
        color={getColorStatusPriority(updatePriority)?.color}
        className="h-fit"
        onClick={() => setIsOpenPriority(true)}
      >
        {getColorStatusPriority(updatePriority)?.title}
      </Tag>
    </div>
  );
};

export default PriorityTag;
