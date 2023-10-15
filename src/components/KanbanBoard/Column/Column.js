import React, { useEffect, useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import TaskModal from "../ModalKanban/TaskModal";
import NewTaskModal from "../ModalKanban/NewTaskModal";
import { shuffle } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../apis/tasks";
import moment from "moment";

const Column = ({ TaskParent }) => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];
  const [color, setColor] = useState(null);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [addNewTask, setAddNewTask] = useState(false);
  const [isTaskParent, setIsTaskParent] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);

  let completed = 0;
  let subTask = TaskParent.subTask;
  subTask.forEach((task) => {
    if (task.status === "confirmed") {
      completed++;
    }
  });

  //format date
  // const formattedDate = (value) => {
  //   const date = new Date(value).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   });
  //   return date;
  // };

  const openTaskParentModal = () => {
    setIsOpenTaskModal(true);
    setIsTaskParent(true);
    setTaskSelected(TaskParent);
  };

  useEffect(() => {
    //là nó sẽ trộn random bảng màu của Colors rồi  -> pop() sẽ làm nhiệm vụ xoá thằng đó ra khỏi mảng và trả về cái đó
    setColor(shuffle(colors).pop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="scrollbar-hide mt-5 min-w-[280px]">
        <div className=" bg-bgColumn  py-3 scrollbar-hide rounded-xl shadow-darkShadow shadow-sm">
          {/* task parent */}
          <div
            className=" flex flex-col items-start gap-2  justify-start 
          w-[250px] mx-auto my-2 rounded-lg cursor-pointer py-1 px-1"
            onClick={() => openTaskParentModal()}
          >
            <div className="flex items-start gap-2 w-full">
              <span className={`rounded-full w-4 h-4 ${color} `}></span>
              <div className="flex flex-col gap-y-[2px]">
                <p className=" w-[215px] whitespace-normal italic font-semibold text-darkDropDown hover:text-secondary">
                  {TaskParent?.title} ({completed}/{TaskParent?.subTask?.length}
                  )
                </p>
                <p className="text-[7px] font-semibold text-gray-600 underline underline-offset-2">
                  {TaskParent.startDate} - {TaskParent.endDate}
                </p>
              </div>
            </div>
          </div>

          {/* subtask */}
          {subTask.length > 0
            ? subTask.map((subTask, index) => (
                <TaskKanbanBoard
                  setTaskSelected={setTaskSelected}
                  task={subTask}
                  setTaskParent={setIsTaskParent}
                  setIsOpenTaskModal={setIsOpenTaskModal}
                  key={subTask.id}
                />
              ))
            : ""}
          <div
            className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400    cursor-pointer hover:bg-white"
            onClick={() => setAddNewTask(true)}
          >
            <p className="text-sm font-semibold tracking-tighter">
              + Thêm công việc mới
            </p>
          </div>
        </div>
        {isOpenTaskModal && (
          <TaskModal
            setTaskSelected={setTaskSelected}
            taskSelected={taskSelected}
            taskParent={isTaskParent}
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
