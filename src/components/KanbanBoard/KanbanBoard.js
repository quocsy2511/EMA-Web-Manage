import React, { Fragment, memo, useEffect, useState } from "react";
import Column from "../KanbanBoard/Column/Column.js";
import DescriptionEvent from "./DescriptionEvent/DescriptionEvent.js";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../apis/tasks.js";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TaskModal from "./ModalKanban/TaskModal.js";
import { Empty, Spin } from "antd";
import { redirectionActions } from "../../store/redirection.js";
import NewTaskModal from "./ModalKanban/NewTaskModal.js";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { socketOnNotification } from "../../utils/socket.js";
import { useLocation } from "react-router-dom";

const KanbanBoard = ({
  selectEvent,
  listTaskParents,
  selectedStatus,
  setIsHideHeaderEvent,
}) => {
  // const dispatch = useDispatch();
  const location = useLocation();
  const { taskId } = location.state ?? {};
  console.log("🚀 ~ taskId:", taskId);

  // const notification = useSelector((state) => state.redirection);
  // console.log("🚀 ~ notification:", notification);
  const [isTaskParent, setIsTaskParent] = useState(false);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  const [hideDescription, setHideDescription] = useState(false);
  const [addNewTask, setAddNewTask] = useState(false);
  const [selectTaskParent, setSelectTaskParent] = useState("");
  const [addNewTaskTemplate, setAddNewTaskTemplate] = useState(false);

  const {
    data: parentTaskDetail,
    isError: isErrorParentTaskDetail,
    isLoading: isLoadingParentTaskDetail,
    refetch,
  } = useQuery(
    ["parentTaskDetail", taskId],
    () =>
      getTasks({
        fieldName: "id",
        conValue: taskId,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        const taskParent = data.map(({ ...item }) => {
          item.startDate = moment(item.startDate).format("YYYY-MM-DD");
          item.endDate = moment(item.endDate).format("YYYY-MM-DD");
          return {
            ...item,
          };
        });
        return taskParent;
      },

      refetchOnWindowFocus: false,
      enabled: !!taskId,
    }
  );
  const {
    data: templateTask,
    isError: isErrorTemplateTask,
    isLoading: isLoadingTemplateTask,
    refetch: refetchTemplateTask,
  } = useQuery(
    ["template-task"],
    () =>
      getTasks({
        fieldName: "isTemplate",
        conValue: "true",
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        // const filterTemplate = data.filter((task) => task.status === "OVERDUE");
        // return filterTemplate;
        return data;
      },
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (taskId) {
      if (!isErrorParentTaskDetail && !isLoadingParentTaskDetail) {
        setIsOpenTaskModal(true);
        setIsTaskParent(true);
        setTaskSelected(parentTaskDetail?.[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, isErrorParentTaskDetail, isLoadingParentTaskDetail]);

  let completed = 0;
  let subTask = taskSelected?.subTask;
  subTask?.forEach((task) => {
    if (task?.status === "CONFIRM") {
      completed++;
    }
  });

  const handleBackKanbanBoard = () => {
    setAddNewTask(false);
    setHideDescription(false);
    setIsHideHeaderEvent(false);
  };

  useEffect(() => {
    socketOnNotification(handleRefetchContact);
  }, []);

  const handleRefetchContact = (noti) => {
    if (noti?.type === "COMMENT" || noti?.type === "TASK") {
      refetch();
    }
  };

  return (
    <Fragment>
      <div
        className={
          addNewTask
            ? "bg-bgG h-[calc(100vh-64px)]"
            : "bg-bgG h-[calc(100vh-64px-80px)]"
        }
      >
        {!hideDescription && (
          <DescriptionEvent key={selectEvent?.id} selectEvent={selectEvent} />
        )}

        {addNewTask ? (
          <Spin spinning={isLoadingTemplateTask}>
            <div className="min-h-full pb-3 ">
              <div className=" left-0 z-40 right-0 bg-bgBoard w-full p-5">
                <div
                  onClick={handleBackKanbanBoard}
                  className="w-1/2 text-sm font-semibold flex item-center space-x-2 hover:opacity-50 transition-all cursor-pointer"
                >
                  <ArrowLeftOutlined className="text-lg" />
                  <span className="text-base">Quay lại Công việc</span>
                </div>
              </div>
              <NewTaskModal
                disableStartDate={selectTaskParent?.startDate}
                disableEndDate={selectTaskParent?.endDate}
                templateTask={templateTask}
                setAddNewTask={setAddNewTask}
                TaskParent={selectTaskParent}
                setHideDescription={setHideDescription}
                addNewTaskTemplate={addNewTaskTemplate}
                setAddNewTaskTemplate={setAddNewTaskTemplate}
                setIsHideHeaderEvent={setIsHideHeaderEvent}
              />
            </div>
          </Spin>
        ) : (
          <>
            <div className="flex overflow-x-scroll px-10 pb-3 gap-x-3 min-h-[calc(808px-250px)]">
              {listTaskParents.length > 0 ? (
                listTaskParents?.map((taskParent, index) => (
                  <Column
                    selectedStatus={selectedStatus}
                    TaskParent={taskParent}
                    idEvent={selectEvent?.id}
                    key={taskParent?.id}
                    setHideDescription={setHideDescription}
                    setSelectTaskParent={setSelectTaskParent}
                    setAddNewTaskTemplate={setAddNewTaskTemplate}
                    setAddNewTask={setAddNewTask}
                    setIsHideHeaderEvent={setIsHideHeaderEvent}
                  />
                ))
              ) : (
                <div className="w-full flex justify-center items-center">
                  <Empty
                    description={
                      <span className="text-xl font-medium">
                        Hiện tại bạn chưa có công việc nào.
                      </span>
                    }
                  />
                </div>
              )}
            </div>
          </>
        )}

        {isOpenTaskModal && (
          <TaskModal
            disableStartDate={taskSelected?.startDate}
            disableEndDate={taskSelected?.endDate}
            disableUpdate={false}
            setTaskSelected={setTaskSelected}
            taskSelected={taskSelected}
            taskParent={isTaskParent}
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
            completed={completed}
          />
        )}
      </div>
    </Fragment>
  );
};

export default memo(KanbanBoard);
