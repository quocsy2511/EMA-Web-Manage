import { SwapRightOutlined } from "@ant-design/icons";
import { Progress, Tooltip } from "antd";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import TaskModal from "../ModalKanban/TaskModal";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";

const Column = ({
  TaskParent,
  selectedStatus,
  setHideDescription,
  setSelectTaskParent,
  setAddNewTask,
  setAddNewTaskTemplate,
  setIsHideHeaderEvent,
}) => {
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "bg-green-500", title: "HOÀN THÀNH" },
      PENDING: { color: "bg-yellow-500", title: "ĐANG CHUẨN BỊ" },
      CANCEL: { color: "bg-red-500", title: "ĐÃ HUỶ" },
      PROCESSING: { color: "bg-blue-500", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "bg-red-500", title: "QUÁ HẠN" },
      CONFIRM: { color: "bg-purple-500", title: "ĐÃ XÁC NHẬN" },
    };
    return colorMapping[value];
  };
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [isTaskParent, setIsTaskParent] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [disableDoneTaskParent, setDisableDoneTaskParent] = useState(true);

  const handleSelectTypeNewTask = () => {
    setSelectTaskParent(TaskParent);
    setAddNewTaskTemplate(true);
    setHideDescription(true);
    setAddNewTask(true);
    setIsHideHeaderEvent(true);
  };

  let completed = 0;
  let completionPercentage = 0;
  let subTask = TaskParent?.subTask;

  subTask?.forEach((task) => {
    if (task.status === "CONFIRM") {
      completed++;
    }
  });

  if (TaskParent && subTask?.length > 0) {
    completionPercentage = ((completed / subTask?.length) * 100).toFixed(0);
  } else {
    completionPercentage = 0;
  }

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
            <div className="flex items-start gap-2 w-full px-2">
              <Tooltip
                title={getColorStatusPriority(TaskParent?.status)?.title}
              >
                <span
                  className={`rounded-full w-4 h-4 ${
                    getColorStatusPriority(TaskParent?.status)?.color
                  } mt-[2px]`}
                ></span>
              </Tooltip>

              <Tooltip title={TaskParent?.title}>
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
                    {moment(TaskParent?.startDate, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    )}{" "}
                    <SwapRightOutlined className="underline underline-offset-2" />{" "}
                    {moment(TaskParent?.endDate, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    )}
                  </p>
                  <div className="pr-1 text-white">
                    <Progress
                      percent={completionPercentage}
                      size="small"
                      className="m-0 text-gray-50"
                      trailColor="white"
                    />
                  </div>
                </div>
              </Tooltip>
            </div>
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
          {TaskParent?.status !== "CONFIRM" && (
            <div
              className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400  cursor-pointer bg-white shadow-lg shadow-darkShadow"
              onClick={handleSelectTypeNewTask}
            >
              <p className="text-sm font-semibold tracking-tighter">
                + Thêm công việc mới
              </p>
            </div>
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
