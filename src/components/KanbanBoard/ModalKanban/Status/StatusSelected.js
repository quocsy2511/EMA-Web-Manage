import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, Tag, message } from "antd";
import React, { useState } from "react";
import { updateTaskStatus } from "../../../../apis/tasks";

const StatusSelected = ({
  taskSelected,
  taskParent,
  updateStatus,
  setUpdateStatus,
  classNameStyle,
  // disableDoneTaskParent,
}) => {
  const statusTask = [
    {
      value: "PENDING",
      label: "CHUẨN BỊ",
      color: "default",
    },
    {
      value: "PROCESSING",
      label: "ĐANG DIỄN RA",
      color: "processing",
    },
    {
      value: "DONE",
      label: "HOÀN THÀNH",
      color: "green",
    },
    {
      value: "CONFIRM",
      label: "XÁC NHẬN",
      color: "purple",
    },
    {
      value: "CANCEL",
      label: "ĐÃ HUỶ",
      color: "red",
    },
    {
      value: "OVERDUE",
      label: "QUÁ HẠN",
      color: "orange",
    },
  ];
  // Sửa giá trị của CONFIRM trong statusTask
  // const updatedStatusTask = statusTask.map((task) =>
  //   task.value === "CONFIRM"
  //     ? { ...task, disabled: true } // Thêm thuộc tính disabled và gán giá trị true
  //     : task
  // );
  const StatusParentTask = statusTask.filter(
    (task) => task.value !== "CONFIRM"
  );
  const [uploadStatus, setUploadStatus] = useState("");
  const taskID = taskSelected?.id;
  const queryClient = useQueryClient();
  const { mutate: UpdateStatusMutate } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: () => {
        setUpdateStatus(uploadStatus);
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        queryClient.invalidateQueries(["parentTaskDetail"], taskID);
        message.open({
          type: "success",
          content: "Cập nhật trạng thái thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể cập nhật trạng thái lúc này! Hãy thử lại sau",
        });
      },
    }
  );
  const handleChangeStatus = (value) => {
    setUploadStatus(value);
    const data = { status: value, taskID: taskID };
    UpdateStatusMutate(data);
  };

  return (
    <>
      <Select
        autoFocus={true}
        suffixIcon={false}
        removeIcon={true}
        bordered={false}
        defaultValue={updateStatus}
        style={{ padding: 0 }}
        className={classNameStyle}
        onChange={(value) => handleChangeStatus(value)}
        popupMatchSelectWidth={false}
        // disabled={taskParent ? true : false}
      >
        {taskParent
          ? StatusParentTask?.map((status) => (
              <Select.Option key={status.value}>
                <Tag color={status.color}>{status.label}</Tag>
              </Select.Option>
            ))
          : statusTask?.map((status) => (
              <Select.Option key={status.value}>
                <Tag color={status.color}>{status.label}</Tag>
              </Select.Option>
            ))}
      </Select>
    </>
  );
};

export default StatusSelected;
