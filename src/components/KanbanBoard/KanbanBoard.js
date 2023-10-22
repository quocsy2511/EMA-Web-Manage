import React from "react";
import Column from "../KanbanBoard/Column/Column.js";
import { BookOutlined, CalendarOutlined } from "@ant-design/icons";
import AnErrorHasOccured from "../Error/AnErrorHasOccured.js";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator.js";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const KanbanBoard = ({
  selectEvent,
  listTaskParents,
  isErrorListTask,
  isLoadingListTask,
  selectedStatus,
}) => {
  return (
    <>
      <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
        <div
          className={`min-h-[150px] relative group md:w-[100%] w-[45%] bg-bgG cursor-pointer bg-auto bg-center px-16 pt-3`}
        >
          {/* <div className="absolute inset-0 bg-black opacity-60 z-10"></div> */}
          <h2 className="text-4xl font-semibold  mb-3">
            {selectEvent.eventName}
          </h2>
          <span className="flex flex-row justify-start items-center gap-x-2 ">
            <CalendarOutlined className="text-lg text-orange-500" />
            <p className="mt-1 px-4 font-medium  text-black  underline underline-offset-2">
              {selectEvent.startDate} - {selectEvent.endDate}
            </p>
          </span>
          <span className="relative z-20  flex flex-row justify-start items-start gap-x-2 mt-3 mb-6">
            <BookOutlined className="text-lg text-orange-500" />
            {selectEvent?.description !== undefined && (
              <p
                className="text-base w-2/3  px-4 italic text-black "
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
