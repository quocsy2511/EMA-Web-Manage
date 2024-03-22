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

const KanbanBoard = ({ selectEvent, listTaskParents, selectedStatus }) => {
  const dispatch = useDispatch();

  const notification = useSelector((state) => state.redirection);
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
  } = useQuery(
    ["parentTaskDetail", notification?.redirect?.comment],
    () =>
      getTasks({
        fieldName: "id",
        conValue: notification?.redirect?.comment,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        const taskParent = data.map(({ ...item }) => {
          item.startDate = moment(item.startDate).format("YYYY/MM/DD");
          item.endDate = moment(item.endDate).format("YYYY/MM/DD");
          return {
            ...item,
          };
        });
        return taskParent;
      },

      refetchOnWindowFocus: false,
      enabled: !!notification?.redirect?.comment,
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
    if (notification?.redirect?.comment) {
      if (!isErrorParentTaskDetail && !isLoadingParentTaskDetail) {
        setIsOpenTaskModal(true);
        setIsTaskParent(true);
        setTaskSelected(parentTaskDetail?.[0]);
        dispatch(redirectionActions.commentChange(""));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    notification?.redirect?.comment,
    isErrorParentTaskDetail,
    isLoadingParentTaskDetail,
  ]);

  let completed = 0;
  let subTask = taskSelected?.subTask;
  subTask?.forEach((task) => {
    if (task?.status === "CONFIRM") {
      completed++;
    }
  });
  return (
    <Fragment>
      <div className="bg-bgG h-[calc(100vh-64px-4rem)]">
        {!hideDescription && (
          <DescriptionEvent key={selectEvent?.id} selectEvent={selectEvent} />
        )}

        {addNewTask ? (
          <Spin spinning={isLoadingTemplateTask}>
            <div>
              <NewTaskModal
                disableStartDate={selectTaskParent?.startDate}
                disableEndDate={selectTaskParent?.endDate}
                templateTask={templateTask}
                setAddNewTask={setAddNewTask}
                TaskParent={selectTaskParent}
                setHideDescription={setHideDescription}
                addNewTaskTemplate={addNewTaskTemplate}
                setAddNewTaskTemplate={setAddNewTaskTemplate}
              />
            </div>
          </Spin>
        ) : (
          <>
            <div className="flex overflow-x-scroll px-10 pb-8 gap-x-3 min-h-[55vh]">
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
