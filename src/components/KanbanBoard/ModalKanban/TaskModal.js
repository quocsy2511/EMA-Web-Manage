import { Modal } from "antd";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import TaskModalContent from "./TaskModalContent";

const TaskModal = ({
  isOpenTaskModal,
  setIsOpenTaskModal,
  taskParent,
  taskSelected,
  setTaskSelected,
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
          //cha
          <TaskModalContent
            setTaskSelected={setTaskSelected}
            taskSelected={taskSelected}
            setIsOpenTaskModal={setIsOpenTaskModal}
            taskParent={taskParent}
            setSelectedSubTask={setSelectedSubTask}
          />
        ) : (
          //con
          <TaskModalContent
            taskSelected={selectedSubTask}
            setIsOpenTaskModal={setIsOpenTaskModal}
            taskParent={!taskParent}
            selectedSubTask={selectedSubTask}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskModal;
