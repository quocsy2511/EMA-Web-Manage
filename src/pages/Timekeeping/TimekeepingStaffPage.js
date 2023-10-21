import React, { useState } from "react";
import { Alert, Calendar, Tag } from "antd";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const getListData = (value) => {
  let listData;
  switch (value.date()) {
    case 1:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 2:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 3:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 4:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 5:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 6:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 7:
      listData = [
        {
          type: "success",
          content: "Bắt đầu ",
          date: "08:00",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 10:
      listData = [
        {
          type: "warning",
          content: "Bắt đầu ",
          date: "08:05",
        },
        {
          type: "processing",
          content: "Kết thúc ",
          date: "05:00",
        },
      ];
      break;
    case 15:
      listData = [
        {
          type: "error",
          content: "Không chấm công",
        },
      ];
      break;
    default:
  }
  return listData || [];
};

const TimekeepingStaffPage = () => {
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const onSelect = (newValue) => {
    setSelectedValue(newValue);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div className="events ">
        {listData.map((item) => (
          <Tag
            icon={
              item.type === "success" ? (
                <CheckCircleOutlined />
              ) : item.type === "warning" ? (
                <ClockCircleOutlined />
              ) : item.type === "processing" ? (
                <MinusCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
            color={item.type}
            key={item.content}
          >
            {item.content}
            {item.date}
          </Tag>
        ))}
      </div>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
      <Alert
        message={`You selected date: ${selectedValue?.format("YYYY-MM-DD")}`}
      />
      <div className="p-5 rounded-lg">
        <Calendar
          className="rounded-lg px-2"
          mode="month"
          value={selectedValue}
          cellRender={cellRender}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default TimekeepingStaffPage;
