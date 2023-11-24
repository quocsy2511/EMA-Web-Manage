import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, InputNumber, message } from "antd";
import React, { useRef, useState } from "react";
import { getTasks, updateTask } from "../../../../apis/tasks";

const EstimateTime = ({
  taskParent,
  taskSelected,
  updateEstimateTime,
  setUpdateEstimateTime,
  disableUpdate,
}) => {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const taskID = taskSelected?.id;
  const [isInputValid, setIsInputValid] = useState(false);
  const onPressEnter = (e) => {
    // Kiểm tra nếu người dùng nhấn phím "Enter"
    if (e.key === "Enter" && isInputValid) {
      e.preventDefault();
      onFinish(updateEstimateTime);
      setIsInputValid(false);
    }
  };

  const onChange = (value) => {
    if (value) {
      setIsInputValid(true);
      setUpdateEstimateTime(value);
    }
  };
  const { data: subtaskDetails } = useQuery(
    ["subtaskDetails", taskID],
    () =>
      getTasks({
        fieldName: "id",
        conValue: taskID,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
      enabled: !!taskID,
    }
  );

  const { mutate: updateEstimateTimeMutate } = useMutation(
    (task) => updateTask(task),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        inputRef.current.blur(); //bỏ forcus vô input
        message.open({
          type: "success",
          content: "Cập nhật thời gian ước tính làm mới thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Cập nhật thời gian ước tính làm  mới thất bại",
        });
      },
    }
  );

  const onFinish = (values) => {
    const eventID = taskSelected.event.id;
    const parentTask = taskSelected.parent.id;
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
      estimationTime: values,
      eventID: eventID,
      parentTask: parentTask,
      taskID: taskID,
    };
    updateEstimateTimeMutate(data);
  };

  return (
    <div>
      {taskParent ? (
        <InputNumber
          className="bg-transparent rounded-md border-none  border-gray-600 focus:outline-secondary outline-none cursor-pointer px-3"
          placeholder="Thời gian làm ước tính ...."
          value={updateEstimateTime ? updateEstimateTime : 0}
          id="board-name-input"
          type="number"
          disabled={taskParent}
        />
      ) : (
        <Form onFinish={onFinish} className="w-full">
          <Form.Item
            name="estimationTime"
            initialValue={
              subtaskDetails?.[0].estimationTime
                ? subtaskDetails?.[0].estimationTime
                : 0
            }
            className="w-full mb-2 px-3"
            rules={[
              {
                validator: async (_, value) => {
                  if (!/^\d*$/.test(value)) {
                    throw new Error("Chỉ được nhập số");
                  }
                },
              },
              {
                required: true,
                message: "Bắt buộc nhập số ",
              },
              {
                type: "number",
                min: 0,
                message: "Bắt buộc nhập số lớn hơn 0",
              },
            ]}
          >
            <InputNumber
              onPressEnter={onPressEnter}
              autoComplete="false"
              ref={inputRef}
              className="bg-transparent rounded-md border-none  border-gray-600 focus:outline-secondary outline-none cursor-pointer "
              placeholder="Thời gian làm ước tính ...."
              // value={
              //   subtaskDetails?.[0].estimationTime
              //     ? subtaskDetails?.[0].estimationTime
              //     : 0
              // }
              onChange={onChange}
              id="board-name-input"
              // type="number"
              disabled={disableUpdate}
              // step="0.1"
              // stringMode
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EstimateTime;
