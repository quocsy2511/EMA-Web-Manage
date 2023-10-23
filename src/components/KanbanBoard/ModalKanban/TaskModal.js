import { Modal } from "antd";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import TaskModalContent from "./TaskModalContent";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../apis/tasks";
import moment from "moment";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";

const TaskModal = ({
  isOpenTaskModal,
  setIsOpenTaskModal,
  taskParent,
  taskSelected,
  setTaskSelected,
  disableUpdate,
}) => {
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const {
    data: subtaskDetails,
    isError: isErrorSubtaskDetails,
    isLoading: isLoadingSubtaskDetails,
  } = useQuery(
    ["subtaskDetails", selectedSubTask?.id],
    () =>
      getTasks({
        fieldName: "id",
        conValue: selectedSubTask?.id,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        if (data) {
          const formatDate = data.map(({ ...item }) => {
            item.startDate = moment(item.startDate).format("YYYY/MM/DD");
            item.endDate = moment(item.endDate).format("YYYY/MM/DD");
            return {
              ...item,
            };
          });
          return formatDate;
        }
      },
      enabled: !!selectedSubTask?.id,
    }
  );

  const onCloseModal = () => {
    console.log("Click");
    setIsOpenTaskModal(false);
  };

  return (
    <div>
      <Modal
        open={isOpenTaskModal}
        onCancel={onCloseModal}
        footer={false}
        closeIcon={false}
        width={800}
        style={{
          top: 20,
        }}
      >
        {selectedSubTask === null ? (
          //task cha
          <TaskModalContent
            disableUpdate={disableUpdate}
            setTaskSelected={setTaskSelected}
            taskSelected={taskSelected}
            setIsOpenTaskModal={setIsOpenTaskModal}
            taskParent={taskParent}
            setSelectedSubTask={setSelectedSubTask}
          />
        ) : //task con
        !isLoadingSubtaskDetails ? (
          !isErrorSubtaskDetails ? (
            <>
              <TaskModalContent
                disableUpdate={disableUpdate}
                taskSelected={subtaskDetails?.[0]}
                setIsOpenTaskModal={setIsOpenTaskModal}
                taskParent={!taskParent}
              />
            </>
          ) : (
            <AnErrorHasOccured />
          )
        ) : (
          <LoadingComponentIndicator />
        )}
      </Modal>
    </div>
  );
};

export default TaskModal;
