import React from "react";
import Column from "../KanbanBoard/Column/Column.js";
import AnErrorHasOccured from "../Error/AnErrorHasOccured.js";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator.js";
import DescriptionEvent from "./DescriptionEvent/DescriptionEvent.js";

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
        <DescriptionEvent selectEvent={selectEvent} />
        <div className="flex scrollbar-default overflow-x-scroll px-10 pb-8 gap-x-3 ">
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
