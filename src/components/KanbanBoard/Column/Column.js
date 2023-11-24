import React, { useEffect, useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import TaskModal from "../ModalKanban/TaskModal";
import NewTaskModal from "../ModalKanban/NewTaskModal";
import { shuffle } from "lodash";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import { Dropdown } from "antd";
import NewTaskModalTemplate from "../ModalKanban/NewTaskModalTemplate";

const Column = ({ TaskParent, selectedStatus, taskTemplate }) => {
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
  const [addNewTaskTemplate, setAddNewTaskTemplate] = useState(false);
  const [taskTemplateModal, setTaskTemplateModal] = useState(null);

  const [isTaskParent, setIsTaskParent] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [disableDoneTaskParent, setDisableDoneTaskParent] = useState(true);

  let completed = 0;
  let subTask = TaskParent.subTask;
  subTask.forEach((task) => {
    if (task.status === "CONFIRM") {
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

  const newTaskItems = [
    {
      key: "newTaskDefault",
      label: <p>Thêm công việc mới</p>,
    },
    {
      type: "divider",
    },
    {
      key: "newTaskTemplate",
      label: "Các Công việc mẫu",
      children: taskTemplate?.map((task, index) => {
        return {
          key: task.id,
          label: task.title,
        };
      }),
    },
  ];

  const handleSelectCreateTask = ({ key }) => {
    if (key === "newTaskDefault") {
      setAddNewTask(true);
    } else {
      const newTaskTemplate = taskTemplate?.find((task) => task.id === key);
      setAddNewTaskTemplate(true);
      setTaskTemplateModal(newTaskTemplate);
    }
  };

  useEffect(() => {
    if (TaskParent?.status === "CONFIRM") {
      setDisableUpdate(true);
    }
    if (completed === TaskParent?.subTask?.length) {
      setDisableDoneTaskParent(false);
    } else {
      setDisableDoneTaskParent(true);
    }
  }, [TaskParent]);

  useEffect(() => {
    //là nó sẽ trộn random bảng màu của Colors rồi  -> pop() sẽ làm nhiệm vụ xoá thằng đó ra khỏi mảng và trả về cái đó
    setColor(shuffle(colors).pop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDate = moment(TaskParent?.startDate).format("DD/MM/YYYY");
  const endDate = moment(TaskParent?.endDate).format("DD/MM/YYYY");

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
                <p className=" max-w-[215px] whitespace-normal italic font-semibold text-white text-sm break-words ">
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
          <AnimatePresence mode="wait">
            {subTask.length > 0 &&
              filteredSubTask.map((subTask, index) => (
                <TaskKanbanBoard
                  setTaskSelected={setTaskSelected}
                  task={subTask}
                  setTaskParent={setIsTaskParent}
                  setIsOpenTaskModal={setIsOpenTaskModal}
                  key={subTask.id}
                />
              ))}
          </AnimatePresence>

          {!disableUpdate && (
            <Dropdown
              menu={{
                items: newTaskItems,
                onClick: handleSelectCreateTask,
              }}
              trigger={["click"]}
            >
              <div
                className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400  cursor-pointer bg-white shadow-lg shadow-darkShadow"
                // onClick={() => setAddNewTask(true)}
              >
                <p className="text-sm font-semibold tracking-tighter">
                  + Thêm công việc mới
                </p>
              </div>
            </Dropdown>
          )}
        </div>

        {isOpenTaskModal && (
          <TaskModal
            disableStartDate={TaskParent?.startDate}
            disableEndDate={TaskParent?.endDate}
            disableUpdate={disableUpdate}
            setTaskSelected={setTaskSelected}
            taskSelected={taskSelected}
            taskParent={isTaskParent}
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
            completed={completed}
            disableDoneTaskParent={disableDoneTaskParent}
          />
        )}
        {addNewTask && (
          <NewTaskModal
            disableStartDate={TaskParent?.startDate}
            disableEndDate={TaskParent?.endDate}
            addNewTask={addNewTask}
            setAddNewTask={setAddNewTask}
            TaskParent={TaskParent}
          />
        )}
        {addNewTaskTemplate && (
          <NewTaskModalTemplate
            addNewTaskTemplate={addNewTaskTemplate}
            setAddNewTaskTemplate={setAddNewTaskTemplate}
            taskTemplateModal={taskTemplateModal}
            TaskParent={TaskParent}
          />
        )}
      </div>
    </>
  );
};

export default Column;
