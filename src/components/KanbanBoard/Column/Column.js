import React, { useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import TaskModal from "../ModalKanban/TaskModal";
import NewTaskModal from "../ModalKanban/NewTaskModal";

const Column = ({ TaskParentArray }) => {
  console.log("🚀 ~ file: Column.js:6 ~ Column ~ TaskParent:", TaskParentArray);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [addNewTask, setAddNewTask] = useState(false);
  const [taskParent, setTaskParent] = useState(false);

  let completed = 0;
  let subtask = TaskParentArray.tasks;
  subtask.forEach((task) => {
    if (task.status === "done") {
      completed++;
    }
  });

  const startDate = TaskParentArray.startDate;
  const endDate = TaskParentArray.endDate;
  const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const openTaskModalHandler = () => {
    setIsOpenTaskModal(true);
    setTaskParent(true);
  };

  return (
    <>
      <div className="scrollbar-hide mt-5 min-w-[280px]">
        <div className=" bg-gray-100 dark:bg-secondaryHover py-3 scrollbar-hide rounded-xl shadow-darkShadow shadow-sm">
          <div
            className="font-semibold flex flex-col items-start gap-2 text-textCol dark:text-white justify-start 
          w-[250px] mx-auto my-2 rounded-lg hover:text-secondary dark:bg-dark  hover:opacity-80 cursor-pointer py-1 px-1"
            onClick={() => openTaskModalHandler()}
          >
            <div className="flex items-start gap-2 w-full">
              <span className={`rounded-full w-4 h-4 bg-red-600 `}></span>
              <div className="flex flex-col gap-y-[2px]">
                <p className=" w-[215px] whitespace-normal">
                  {TaskParentArray?.title} ({TaskParentArray?.tasks?.length})
                </p>
                <p className="text-xs font-normal tracking-tighter text-gray-500">
                  {/* 1/3 completed */}
                  {completed}/{TaskParentArray?.tasks?.length} completed
                </p>
                <p className="text-[7px] font-semibold text-gray-600 underline underline-offset-2">
                  {/* {col.time} */}
                  {formattedStartDate} - {formattedEndDate}
                </p>
              </div>
            </div>
          </div>

          <TaskKanbanBoard
            setTaskParent={setTaskParent}
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
          />
          <TaskKanbanBoard
            setTaskParent={setTaskParent}
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
          />
          <TaskKanbanBoard
            setTaskParent={setTaskParent}
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
          />
          <div
            className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400 dark:hover:text-white dark:hover:bg-secondary  cursor-pointer hover:bg-white"
            onClick={() => setAddNewTask(true)}
          >
            <p className="text-sm font-semibold tracking-tighter">
              + Add a task
            </p>
          </div>
        </div>
        {isOpenTaskModal && (
          <TaskModal
            taskParent={taskParent}
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
          />
        )}
        {addNewTask && (
          <NewTaskModal addNewTask={addNewTask} setAddNewTask={setAddNewTask} />
        )}
      </div>
    </>
  );
};

export default Column;
