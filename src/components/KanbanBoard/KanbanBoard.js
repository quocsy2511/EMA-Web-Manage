import React from "react";
import Column from "../KanbanBoard/Column/Column.js";
import AnErrorHasOccured from "../Error/AnErrorHasOccured.js";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator.js";
import DescriptionEvent from "./DescriptionEvent/DescriptionEvent.js";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const KanbanBoard = ({ selectEvent, listTaskParents, selectedStatus }) => {
  return (
    <>
      <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
        <DescriptionEvent key={selectEvent.id} selectEvent={selectEvent} />

        <div className="flex scrollbar-default overflow-x-scroll px-10 pb-8 gap-x-3">
          {listTaskParents.map((taskParent, index) => (
            <Column
              selectedStatus={selectedStatus}
              TaskParent={taskParent}
              idEvent={selectEvent.id}
              key={taskParent.id}
            />
          ))}
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default KanbanBoard;
