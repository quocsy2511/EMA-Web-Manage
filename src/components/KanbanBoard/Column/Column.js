import React, { useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import TaskModal from "../ModalKanban/TaskModal";
import NewTaskModal from "../ModalKanban/NewTaskModal";
const Column = () => {
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [addNewTask, setAddNewTask] = useState(false);
  const [taskParent, setTaskParent] = useState(false);

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
          w-[250px] mx-auto my-2 rounded-lg hover:bg-white dark:bg-dark  hover:opacity-80 cursor-pointer py-1 px-1"
            onClick={() => openTaskModalHandler()}
          >
            <div className="flex items-start gap-2 w-full">
              <span className={`rounded-full w-4 h-4 bg-red-600`}></span>
              <div className="flex flex-col gap-y-[2px]">
                <p className=" w-[145px] whitespace-normal">
                  Thiết kế sân khấu (5)
                </p>
                <p className="text-xs font-normal tracking-tighter text-gray-500">
                  1/3 completed
                </p>
                <p className="text-[7px] font-normal text-gray-500 underline underline-offset-2">
                  {/* {col.time} */}
                  28/07-29/08
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
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
          />
          <TaskKanbanBoard
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
