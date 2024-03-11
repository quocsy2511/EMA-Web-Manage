import React, { Fragment, memo, useEffect, useState } from "react";
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
import { Empty } from "antd";
import { redirectionActions } from "../../store/redirection.js";

const KanbanBoard = ({ selectEvent, listTaskParents, selectedStatus }) => {
  const dispatch = useDispatch();

  const notification = useSelector((state) => state.redirection);
  const [isTaskParent, setIsTaskParent] = useState(false);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);

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
  console.log("🚀 ~ KanbanBoard ~ parentTaskDetail:", parentTaskDetail);

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
        <DescriptionEvent key={selectEvent?.id} selectEvent={selectEvent} />

        <div className="flex overflow-x-scroll px-10 pb-8 gap-x-3 min-h-[55vh]">
          {listTaskParents.length > 0 ? (
            listTaskParents?.map((taskParent, index) => (
              <Column
                taskTemplate={[]}
                selectedStatus={selectedStatus}
                TaskParent={taskParent}
                idEvent={selectEvent?.id}
                key={taskParent?.id}
              />
            ))
          ) : (
            <Empty />
          )}
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
    </Fragment>
  );
};

export default memo(KanbanBoard);
