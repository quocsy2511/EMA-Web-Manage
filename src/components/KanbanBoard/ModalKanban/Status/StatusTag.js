import { Tag } from "antd";
import React from "react";

const StatusTag = ({ taskSelected, updateStatus }) => {
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
      CONFIRM: { color: "purple", title: "ĐÃ XÁC NHẬN" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };
  return (
    <>
      <Tag
        color={getColorStatusPriority(updateStatus)?.color}
        className="h-fit w-fit mt-4 cursor-pointer"
      >
        {getColorStatusPriority(updateStatus)?.title}
      </Tag>
    </>
  );
};

export default StatusTag;
