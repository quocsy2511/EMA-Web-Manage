import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Select, Tag, message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { updateTaskStatus } from "../../../../apis/tasks";

const StatusSelected = ({
  taskSelected,
  taskParent,
  updateStatus,
  setUpdateStatus,
  classNameStyle,
  setIsOpenTaskModal,
  updateStartDate,
}) => {
  const startDate = moment(updateStartDate);
  const today = moment();
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusTask = [
    {
      value: "PENDING",
      label: "ĐANG CHUẨN BỊ",
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
      label: "ĐÃ XÁC THỰC",
      color: "purple",
    },
    {
      value: "CANCEL",
      label: "HUỶ",
      color: "red",
    },
    {
      value: "OVERDUE",
      label: "QUÁ HẠN",
      color: "orange",
    },
  ];

  const StatusParentTask = statusTask.filter(
    (task) =>
      task.value !== "CONFIRM" &&
      task.value !== "CANCEL" &&
      task.value !== "OVERDUE"
  );

  const [uploadStatus, setUploadStatus] = useState("");
  const [isCancel, setIsCancel] = useState(false);
  const taskID = taskSelected?.id;
  const queryClient = useQueryClient();
  const { mutate: UpdateStatusMutate, isSuccess } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: () => {
        setUpdateStatus(uploadStatus);
        queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
        queryClient.invalidateQueries(["subtaskDetails", taskID]);
        queryClient.invalidateQueries(["parentTaskDetail", taskID]);
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

  let filterStatusTaskStatus;
  if (today?.isBefore(startDate)) {
    filterStatusTaskStatus = statusTask.filter(
      (task) => task.value !== "CONFIRM" && task.value !== "DONE"
    );
  } else if (today?.isSame(startDate)) {
    filterStatusTaskStatus = statusTask;
  } else {
    filterStatusTaskStatus = statusTask;
  }

  if (isSuccess && isCancel) {
    setIsCancel(false);
    setIsOpenTaskModal(false);
  }

  const handleChangeStatus = (value) => {
    setUploadStatus(value);
    if (value === "CANCEL") {
      setIsCancel(true);
      setIsModalOpen(true);
    } else {
      const data = { status: value, taskID: taskID };
      UpdateStatusMutate(data);
    }
  };

  const handleOk = () => {
    const data = { status: "CANCEL", taskID: taskID };
    UpdateStatusMutate(data);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
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
      >
        {taskParent
          ? StatusParentTask?.map((status) => (
              <Select.Option key={status.value}>
                <Tag color={status.color}>{status.label}</Tag>
              </Select.Option>
            ))
          : filterStatusTaskStatus?.map((status) => (
              <Select.Option key={status.value}>
                <Tag color={status.color}>{status.label}</Tag>
              </Select.Option>
            ))}
      </Select>
      <Modal
        title="Xác nhận huỷ công việc"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Không
          </Button>,
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            onClick={handleOk}
          >
            Đồng ý
          </Button>,
        ]}
      >
        <p>Bạn không thể khôi phục lại công việc sau khi đã huỷ </p>
        <p>
          Bạn có muốn tiếp tục huỷ công việc <b>{taskSelected?.title} </b> ?
        </p>
      </Modal>
    </div>
  );
};

export default StatusSelected;
