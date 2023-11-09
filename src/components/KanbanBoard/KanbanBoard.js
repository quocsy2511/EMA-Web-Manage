import React, { useEffect } from "react";
import Column from "../KanbanBoard/Column/Column.js";
import DescriptionEvent from "./DescriptionEvent/DescriptionEvent.js";
import { getEventTemplate } from "../../apis/events.js";
import { useQuery } from "@tanstack/react-query";
import AnErrorHasOccured from "../Error/AnErrorHasOccured.js";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator.js";
import { getTasksTemplate } from "../../apis/tasks.js";
import moment from "moment";

const KanbanBoard = ({ selectEvent, listTaskParents, selectedStatus }) => {
  // const { data: eventTemplate } = useQuery(
  //   ["events-template"],
  //   () => getEventTemplate(),
  //   {
  //     select: (data) => {
  //       return data;
  //     },
  //   }
  // );

  // const {
  //   data: taskTemplate,
  //   isError: isErrorTaskTemplate,
  //   isLoading: isLoadingTaskTemplate,
  // } = useQuery(
  //   ["tasks-template"],
  //   () =>
  //     getTasksTemplate({
  //       fieldName: "eventID",
  //       conValue: eventTemplate?.id,
  //       sizePage: 10,
  //       currentPage: 1,
  //     }),
  //   {
  //     select: (data) => {
  //       if (data && Array.isArray(data)) {
  //         const formatDate = data.map(({ ...item }) => {
  //           item.startDate = moment(item.startDate).format(
  //             "YYYY/MM/DD HH:mm:ss"
  //           );
  //           item.endDate = moment(item.endDate).format("YYYY/MM/DD HH:mm:ss");
  //           return {
  //             ...item,
  //           };
  //         });
  //         return formatDate;
  //       }
  //       return data;
  //     },
  //     enabled: !!eventTemplate?.id,
  //   }
  // );

  return (
    <>
      {/* {!isLoadingTaskTemplate ? (
        !isErrorTaskTemplate ? (
          <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
            <DescriptionEvent key={selectEvent.id} selectEvent={selectEvent} />
            <div className="flex scrollbar-default overflow-x-scroll px-10 pb-8 gap-x-3">
              {listTaskParents.map((taskParent, index) => (
                <Column
                  taskTemplate={taskTemplate}
                  selectedStatus={selectedStatus}
                  TaskParent={taskParent}
                  idEvent={selectEvent.id}
                  key={taskParent.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )} */}
      <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
        <DescriptionEvent key={selectEvent.id} selectEvent={selectEvent} />
        <div className="flex scrollbar-default overflow-x-scroll px-10 pb-8 gap-x-3">
          {listTaskParents.map((taskParent, index) => (
            <Column
              taskTemplate={[]}
              selectedStatus={selectedStatus}
              TaskParent={taskParent}
              idEvent={selectEvent.id}
              key={taskParent.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
