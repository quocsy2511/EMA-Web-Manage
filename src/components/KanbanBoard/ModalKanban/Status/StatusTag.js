import { Tag } from "antd";
import React from "react";

const StatusTag = ({ taskSelected, setIsOpenStatus, updateStatus }) => {

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
    <>
      <Tag
        color={getColorStatusPriority(updateStatus)?.color}
        onClick={() => setIsOpenStatus(true)}
        className="h-fit w-fit mt-4 cursor-pointer"
      >
        {getColorStatusPriority(updateStatus)?.title}
      </Tag>
    </>
  );
};

export default StatusTag;
