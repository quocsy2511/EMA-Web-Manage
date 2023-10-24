import { Tabs, Tag } from "antd";
import React from "react";
import ConfirmedBudgetStaff from "./ConfirmedBudgetStaff";
import ComfirmingBudgetStaff from "./ComfirmingBudgetStaff";
import NewBudget from "./ModalBudget/NewBudget";
import { BsCalendarHeart, BsFileEarmarkTextFill } from "react-icons/bs";
import { FaMoneyBillWave, FaSearchLocation } from "react-icons/fa";
import { SiFastapi } from "react-icons/si";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const BudgetStaff = ({ selectEvent }) => {
  const labelTable = [
    {
      key: "1",
      label: "Đã duyệt",
      children: <ConfirmedBudgetStaff selectEvent={selectEvent} />,
    },
    {
      key: "2",
      label: "Chờ duyệt",
      children: <ComfirmingBudgetStaff selectEvent={selectEvent} />,
    },
    {
      key: "3",
      label: "Thêm chi phí",
      children: <NewBudget selectEvent={selectEvent} />,
    },
  ];
  const onChangeTable = (key) => {
    console.log(key);
  };

  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      CONFIRM: { color: "purple", title: "XÁC NHẬN" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  return (
    <>
      <div className="bg-bgG h-screen overflow-scroll">
        <div
          className={`min-h-[150px] relative group md:w-[100%] w-[45%] bg-bgG cursor-pointer bg-auto bg-center px-16 pt-3 mt-5`}
        >
          {/* <div className="absolute inset-0 bg-black opacity-60 z-10"></div> */}
          <h2 className="text-4xl font-semibold  mb-3">
            {selectEvent.eventName}
          </h2>
          <div className="flex flex-row  items-center gap-x-32 ">
            <span className="flex flex-row justify-start items-center gap-x-2 ">
              <BsCalendarHeart className=" text-orange-500" size={20} />
              <p className="mt-1 px-2 font-medium  text-black  underline underline-offset-2">
                {selectEvent.startDate} - {selectEvent.endDate}
              </p>
            </span>
            <span className="flex flex-row justify-start items-center gap-x-2 ">
              <FaSearchLocation className=" text-blue-500" size={20} />
              <p className="mt-1 px-2 font-medium  text-black  underline underline-offset-2">
                {selectEvent.location}
              </p>
            </span>
            <span className="flex flex-row justify-start items-center gap-x-2 ">
              <FaMoneyBillWave className=" text-green-500" size={20} />
              <p className="mt-1 px-2 font-medium  text-black  underline underline-offset-2">
                {selectEvent.estBudget?.toLocaleString()} VND
              </p>
            </span>
            <span className="flex flex-row justify-start items-center gap-x-2 ">
              <SiFastapi className=" text-purple-500" size={20} />
              <Tag
                color={getColorStatusPriority(selectEvent.status)?.color}
                className="h-fit w-fit mt-1 mx-2 font-medium  text-black "
              >
                {getColorStatusPriority(selectEvent.status)?.title}
              </Tag>
            </span>
          </div>

          <span className="relative z-20  flex flex-row justify-start items-start gap-x-2 mt-5 mb-5 ">
            <BsFileEarmarkTextFill className=" text-gray-500" size={20} />
            {selectEvent?.description !== undefined && (
              <p
                className="text-base w-2/3  px-2 italic text-black "
                dangerouslySetInnerHTML={{
                  __html: new QuillDeltaToHtmlConverter(
                    JSON.parse(selectEvent?.description)
                  ).convert(),
                }}
              ></p>
            )}
          </span>
        </div>
        <div className="py-2 pl-3 pr-8 mt-6">
          <Tabs
            tabPosition="left"
            defaultActiveKey="1"
            items={labelTable}
            onChange={onChangeTable}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default BudgetStaff;
