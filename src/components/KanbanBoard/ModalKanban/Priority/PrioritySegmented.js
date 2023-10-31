import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Segmented, message } from "antd";
import React, { useState } from "react";
import { updateTask } from "../../../../apis/tasks";

const PrioritySegmented = ({
  taskSelected,
  setUpdatePriority,
  setIsOpenPriority,
  updatePriority,
}) => {
  const queryClient = useQueryClient();
  const taskID = taskSelected?.id;
  const eventID = taskSelected?.event?.id;
  const parentTask = taskSelected?.parent?.id;
  const optionsPriority = [
    { label: "THẤP", value: "LOW" },
    { label: "TRUNG BÌNH", value: "MEDIUM" },
    { label: "CAO", value: "HIGH" },
  ];
  const [prioritySelected, setPrioritySelected] = useState("");

  const selectedPriority = optionsPriority.find(
    (option) => option.value === updatePriority
  );

  const { mutate: updatePriorityMutate } = useMutation(
    (task) => updateTask(task),
    {
      onSuccess: () => {
        setUpdatePriority(prioritySelected);
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        message.open({
          type: "success",
          content: "Cập nhật độ ưu tiên công việc  thành công",
        });
        setIsOpenPriority(false);
      },

      onError: () => {
        message.open({
          type: "error",
          content: "Cập nhật độ ưu tiên mới thất bại",
        });
      },
    }
  );

  const updatePriorityFinish = (value) => {
    setPrioritySelected(value);
    const {
      approvedBy,
      assignTasks,
      createdAt,
      createdBy,
      event,
      id,
      modifiedBy,
      parent,
      status,
      subTask,
      taskFiles,
      updatedAt,
      ...rest
    } = taskSelected;
    const data = {
      ...rest,
      priority: value,
      eventID: eventID,
      parentTask: parentTask,
      taskID: taskID,
    };
    updatePriorityMutate(data);
  };

  return (
    <Form name="Priority">
      <Form.Item
        name="priority"
        className="text-sm font-medium "
        initialValue={selectedPriority?.value}
      >
        <Segmented
          options={optionsPriority}
          value={selectedPriority?.value}
          onChange={(value) => updatePriorityFinish(value)}
        />
      </Form.Item>
    </Form>
  );
};

export default PrioritySegmented;
