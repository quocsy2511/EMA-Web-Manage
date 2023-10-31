import React from "react";
import { Badge, Calendar } from "antd";

const getListData = (value) => {
  let listData;
  switch (value.date()) {
    case 1:
      listData = [
        {
          type: "success",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "05:00",
        },
      ];
      break;
    case 2:
      listData = [
        {
          type: "success",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "05:00",
        },
      ];
      break;
    case 3:
      listData = [
        {
          type: "success",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "05:00",
        },
      ];
      break;
    case 4:
      listData = [
        {
          type: "success",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "05:00",
        },
      ];
      break;
    case 5:
      listData = [
        {
          type: "success",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "05:00",
        },
      ];
      break;
    case 7:
      listData = [
        {
          type: "warning",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "--:--",
        },
      ];
      break;
    case 8:
      listData = [
        {
          type: "warning",
          content: "Làm cả ngày ",
          checkinTime: "08:00",
          checkoutTime: "--:--",
        },
      ];
      break;
    default:
  }

  console.log(
    "🚀 ~ file: TimekeepingStaffPage.js:139 ~ getListData ~ listData:",
    listData
  );
  return listData || [];
};

const TimekeepingStaffPage = () => {
  // const [selectedValue, setSelectedValue] = useState(() => dayjs());
  // const onSelect = (newValue) => {

  //   setSelectedValue(newValue);
  // };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div className="events h-full w-full flex flex-col justify-between items-start pb-4">
        {listData.map((item, index) => (
          <div className="events">
            {listData.map((item, index) => (
              <div key={index}>
                <Badge
                  status={item.type}
                  text={item.content?.toUpperCase()}
                  className="font-bold text-lg "
                />
                <div className="flex flex-row gap-x-2 text-xs ml-4">
                  <p className="">{item.checkinTime}</p>-
                  <p className="text-red-400">{item.checkoutTime}</p>
                </div>
              </div>
            ))}
          </div>
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
      {/* <Alert
        message={`các màu thể hiện trạng thái : ${selectedValue?.format(
          "YYYY-MM-DD"
        )}`}
      /> */}
      <div className="p-5 rounded-lg">
        <Calendar
          className="rounded-lg px-2"
          // mode="month"
          // value={selectedValue}
          cellRender={cellRender}
          // onSelect={onSelect}
          // onPanelChange={onPanelChange}
        />
      </div>
    </div>
  );
};

export default TimekeepingStaffPage;
