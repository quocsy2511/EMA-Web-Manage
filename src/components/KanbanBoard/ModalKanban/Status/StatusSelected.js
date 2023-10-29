import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, Tag, message } from "antd";
import React, { useState } from "react";
import { updateTaskStatus } from "../../../../apis/tasks";

const StatusSelected = ({
  taskSelected,
  taskParent,
  setIsOpenStatus,
  updateStatus,
  setUpdateStatus,
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
        message.open({
          type: "success",
          content: "Cập nhật trạng thái thành công",
        });
        setIsOpenStatus(false);
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
        removeIcon={true}
        bordered={false}
        defaultValue={updateStatus}
        className="w-[190px] mt-4"
        onChange={(value) => handleChangeStatus(value)}
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
