import { Modal } from "antd";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import TaskModalContent from "./TaskModalContent";

const TaskModal = ({
  disableEndDate,
  disableStartDate,
  isOpenTaskModal,
  setIsOpenTaskModal,
  taskParent,
  taskSelected,
  setTaskSelected,
  disableUpdate,
  completed,
}) => {
  const [selectedSubTask, setSelectedSubTask] = useState(null);

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
            disableEndDate={disableEndDate}
            disableStartDate={disableStartDate}
            completed={completed}
          />
        ) : (
          //task con
          <>
            <TaskModalContent
              disableUpdate={disableUpdate}
              taskSelected={selectedSubTask}
              setIsOpenTaskModal={setIsOpenTaskModal}
              taskParent={!taskParent}
              disableEndDate={disableEndDate}
              disableStartDate={disableStartDate}
              completed={completed}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default TaskModal;
