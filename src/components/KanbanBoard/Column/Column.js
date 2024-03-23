import React, { memo, useEffect, useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import TaskModal from "../ModalKanban/TaskModal";
import NewTaskModal from "../ModalKanban/NewTaskModal";
import { shuffle } from "lodash";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import { Dropdown, Spin, Tooltip } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getTemplateEvent } from "../../../apis/events";
import { getTasks } from "../../../apis/tasks";

const Column = ({
  TaskParent,
  selectedStatus,
  setHideDescription,
  setSelectTaskParent,
  setAddNewTask,
  setAddNewTaskTemplate,
}) => {
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
  const [isTaskParent, setIsTaskParent] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [disableDoneTaskParent, setDisableDoneTaskParent] = useState(true);

  const TypeNewTask = [
    {
      label: <p>Tạo công việc thủ công</p>,
      key: "newTask",
    },
    {
      label: <p>Tạo công việc nhanh</p>,
      key: "templateTask",
    },
  ];

  const handleSelectTypeNewTask = ({ key }) => {
    if (key === "newTask") {
      setSelectTaskParent(TaskParent);
      setHideDescription(true);
      setAddNewTask(true);
      setAddNewTaskTemplate(false);
    } else {
      setSelectTaskParent(TaskParent);
      setAddNewTaskTemplate(true);
      setHideDescription(true);
      setAddNewTask(true);
    }
  };

  let completed = 0;

  let subTask = TaskParent?.subTask;

  subTask?.forEach((task) => {
    if (task.status === "CONFIRM") {
      completed++;
    }
  });

  const filteredSubTask = subTask?.filter((task) => {
    if (selectedStatus === "clear") {
      return true;
    } else {
      return task?.status === selectedStatus;
    }
  });

  const openTaskParentModal = () => {
    setIsOpenTaskModal(true);
    setIsTaskParent(true);
    setTaskSelected(TaskParent);
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

  const startDate = moment(TaskParent?.startDate).format("DD-MM-YYYY");
  const endDate = moment(TaskParent?.endDate).format("DD-MM-YYYY");
  
  return (
    <>
      <div className="scrollbar-hide mt-5 min-w-[280px]">
        <div className=" bg-bgSubtask py-4 scrollbar-hide rounded-xl w-full shadow-xl">
          {/* task parent */}
          <div
            className="bg-blue-400 flex flex-col items-start gap-2 justify-start 
          w-[250px] mx-auto my-2 rounded-lg cursor-pointer py-4 px-1 hover:opacity-70 shadow-lg shadow-darkShadow"
            onClick={() => openTaskParentModal()}
          >
            <Tooltip title={TaskParent?.title}>
              <div className="flex items-start gap-2 w-full px-2">
                <span
                  className={`rounded-full w-4 h-4 ${color} mt-[2px]`}
                ></span>
                <div className="flex flex-col gap-y-[2px] w-[90%] overflow-hidden  hover:text-secondary">
                  <div className="overflow-hidden  flex w-full gap-x-1">
                    <div className="overflow-hidden max-w-[80%] ">
                      <p className=" italic font-semibold text-white text-sm truncate">
                        {TaskParent?.title}
                      </p>
                    </div>

                    <span className="italic font-semibold text-white text-sm w-[15%]">
                      ({completed}/{TaskParent?.subTask?.length})
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white underline underline-offset-2">
                    {startDate}{" "}
                    <SwapRightOutlined className="underline underline-offset-2" />{" "}
                    {endDate}
                  </p>
                </div>
              </div>
            </Tooltip>
          </div>

          {/* subtask */}
          <AnimatePresence mode="wait">
            {subTask?.length > 0 &&
              filteredSubTask?.map((subTask, index) => (
                <TaskKanbanBoard
                  key={subTask?.id}
                  setTaskSelected={setTaskSelected}
                  task={subTask}
                  setTaskParent={setIsTaskParent}
                  setIsOpenTaskModal={setIsOpenTaskModal}
                />
              ))}
          </AnimatePresence>

          {!disableUpdate && (
            <Dropdown
              menu={{
                items: TypeNewTask,
                onClick: handleSelectTypeNewTask,
              }}
              // trigger={["click"]}
              placement="bottomLeft"
              arrow
            >
              <div className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400  cursor-pointer bg-white shadow-lg shadow-darkShadow">
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
      </div>
    </>
  );
};

export default memo(Column);
