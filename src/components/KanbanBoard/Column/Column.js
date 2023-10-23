import React, { useEffect, useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import TaskModal from "../ModalKanban/TaskModal";
import NewTaskModal from "../ModalKanban/NewTaskModal";
import { shuffle } from "lodash";
import moment from "moment";

const Column = ({ TaskParent, selectedStatus }) => {
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
    if (task.status === "DONE") {
      completed++;
    }
  });
  const filteredSubTask = subTask.filter((task) => {
    if (selectedStatus === "clear") {
      return true;
    } else {
      return task.status === selectedStatus;
    }
  });

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

  const startDate = moment(TaskParent?.startDate).format("YYYY/MM/DD ");
  const endDate = moment(TaskParent?.endDate).format("YYYY/MM/DD ");

  return (
    <>
      <div className="scrollbar-hide mt-5 min-w-[280px]">
        <div className=" bg-bgSubtask py-4 scrollbar-hide rounded-xl w-full shadow-xl">
          {/* task parent */}
          <div
            className="bg-blue-400 flex flex-col items-start gap-2  justify-start 
          w-[250px] mx-auto my-2 rounded-lg cursor-pointer py-4 px-1 hover:opacity-70 shadow-lg shadow-darkShadow"
            onClick={() => openTaskParentModal()}
          >
            <div className="flex items-start gap-2 w-full px-2">
              <span className={`rounded-full w-4 h-4 ${color} mt-[2px]`}></span>
              <div className="flex flex-col gap-y-[2px]  hover:text-secondary">
                <p className=" max-w-[215px] whitespace-normal italic font-semibold text-white text-sm">
                  {TaskParent?.title} ({completed}/{TaskParent?.subTask?.length}
                  )
                </p>
                <p className="text-[8px] font-semibold text-white underline underline-offset-2">
                  {startDate} - {endDate}
                </p>
              </div>
            </div>
          </div>

          {/* subtask */}
          {subTask.length > 0
            ? filteredSubTask.map((subTask, index) => (
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
            className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400  cursor-pointer bg-white shadow-lg shadow-darkShadow"
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
          <NewTaskModal
            disableEndDate={TaskParent?.endDate}
            addNewTask={addNewTask}
            setAddNewTask={setAddNewTask}
            TaskParent={TaskParent}
          />
        )}
      </div>
    </>
  );
};

export default Column;
