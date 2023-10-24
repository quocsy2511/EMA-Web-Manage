import React from "react";
import Column from "../KanbanBoard/Column/Column.js";
import AnErrorHasOccured from "../Error/AnErrorHasOccured.js";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator.js";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { FaSearchLocation, FaMoneyBillWave } from "react-icons/fa";
import { BsCalendarHeart, BsFileEarmarkTextFill } from "react-icons/bs";
import { SiFastapi } from "react-icons/si";
import { Tag } from "antd";

const KanbanBoard = ({
  selectEvent,
  listTaskParents,
  isErrorListTask,
  isLoadingListTask,
  selectedStatus,
}) => {
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
      <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
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
        <div className="flex scrollbar-default overflow-x-scroll px-10 py-2 gap-x-3 ">
          {!isLoadingListTask ? (
            !isErrorListTask ? (
              listTaskParents.map((taskParent, index) => (
                <Column
                  selectedStatus={selectedStatus}
                  TaskParent={taskParent}
                  key={taskParent.id}
                  idEvent={selectEvent.id}
                />
              ))
            ) : (
              <AnErrorHasOccured />
            )
          ) : (
            <LoadingComponentIndicator />
          )}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
