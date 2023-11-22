import React, { useEffect, useState } from "react";
import Column from "../KanbanBoard/Column/Column.js";
import DescriptionEvent from "./DescriptionEvent/DescriptionEvent.js";
import { getEventTemplate } from "../../apis/events.js";
import { useQuery } from "@tanstack/react-query";
import AnErrorHasOccured from "../Error/AnErrorHasOccured.js";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator.js";
import { getTasks, getTasksTemplate } from "../../apis/tasks.js";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../store/Slice/notificationsSlice.js";
import TaskModal from "./ModalKanban/TaskModal.js";

const KanbanBoard = ({ selectEvent, listTaskParents, selectedStatus }) => {
  const [isTaskParent, setIsTaskParent] = useState(false);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  // const { data: eventTemplate } = useQuery(
  //   ["events-template"],
  //   () => getEventTemplate(),
  //   {
  //     select: (data) => {
  //       return data;
  //     },
  //   }
  // );

  // const {
  //   data: taskTemplate,
  //   isError: isErrorTaskTemplate,
  //   isLoading: isLoadingTaskTemplate,
  // } = useQuery(
  //   ["tasks-template"],
  //   () =>
  //     getTasksTemplate({
  //       fieldName: "eventID",
  //       conValue: eventTemplate?.id,
  //       sizePage: 10,
  //       currentPage: 1,
  //     }),
  //   {
  //     select: (data) => {
  //       if (data && Array.isArray(data)) {
  //         const formatDate = data.map(({ ...item }) => {
  //           item.startDate = moment(item.startDate).format(
  //             "YYYY/MM/DD HH:mm:ss"
  //           );
  //           item.endDate = moment(item.endDate).format("YYYY/MM/DD HH:mm:ss");
  //           return {
  //             ...item,
  //           };
  //         });
  //         return formatDate;
  //       }
  //       return data;
  //     },
  //     enabled: !!eventTemplate?.id,
  //   }
  // );

  const notification = useSelector((state) => state.notification);
  const {
    data: parentTaskDetail,
    isError: isErrorParentTaskDetail,
    isLoading: isLoadingParentTaskDetail,
  } = useQuery(
    ["parentTaskDetail", notification?.commonId],
    () =>
      getTasks({
        fieldName: "id",
        conValue: notification?.commonId,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        const taskParent = data.map(({ ...item }) => {
          item.startDate = moment(item.startDate).format("YYYY/MM/DD HH:mm:ss");
          item.endDate = moment(item.endDate).format("YYYY/MM/DD HH:mm:ss");
          return {
            ...item,
          };
        });
        return taskParent;
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!notification?.commonId && notification?.type === "TASK",
    }
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (notification?.commonId && notification?.type === "TASK") {
      if (!isErrorParentTaskDetail && !isLoadingParentTaskDetail) {
        setIsOpenTaskModal(true);
        setIsTaskParent(true);
        setTaskSelected(parentTaskDetail?.[0]);
        dispatch(addNotification({}));
      }
    }
  }, [notification?.id, isErrorParentTaskDetail, isLoadingParentTaskDetail]);
  let completed = 0;
  let subTask = taskSelected?.subTask;
  subTask?.forEach((task) => {
    if (task?.status === "CONFIRM") {
      completed++;
    }
  });
  return (
    <>
      {/* {!isLoadingTaskTemplate ? (
        !isErrorTaskTemplate ? (
          <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
            <DescriptionEvent key={selectEvent.id} selectEvent={selectEvent} />
            <div className="flex scrollbar-default overflow-x-scroll px-10 pb-8 gap-x-3">
              {listTaskParents.map((taskParent, index) => (
                <Column
                  taskTemplate={taskTemplate}
                  selectedStatus={selectedStatus}
                  TaskParent={taskParent}
                  idEvent={selectEvent.id}
                  key={taskParent.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )} */}
      <div className="bg-bgG h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
        <DescriptionEvent key={selectEvent?.id} selectEvent={selectEvent} />
        <div className="flex scrollbar-default overflow-x-scroll px-10 pb-8 gap-x-3">
          {listTaskParents.map((taskParent, index) => (
            <Column
              taskTemplate={[]}
              selectedStatus={selectedStatus}
              TaskParent={taskParent}
              idEvent={selectEvent.id}
              key={taskParent.id}
            />
          ))}
        </div>
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
    </>
  );
};

export default KanbanBoard;
