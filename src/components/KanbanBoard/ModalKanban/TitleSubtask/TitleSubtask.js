import { ThunderboltOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Input, message } from "antd";
import { debounce } from "lodash";
import React, { useRef } from "react";
import { getTasks, updateTask } from "../../../../apis/tasks";

const TitleSubtask = ({
  disableUpdate,
  taskParent,
  taskSelected,
  title,
  setTitle,
}) => {
  const inputRef = useRef(null);
  const taskID = taskSelected?.id;

  const titleDebounced = debounce((value) => {
    setTitle(value);
  }, 300); // Thời gian chờ 300ms

  const onPressEnter = (e) => {
    // Kiểm tra nếu người dùng nhấn phím "Enter"
    if (e.key === "Enter") {
      e.preventDefault();
      onFinish(title);
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
      enabled: !!taskID,
    }
  );

  const queryClient = useQueryClient();
  const { mutate: updateTitle } = useMutation((task) => updateTask(task), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["subtaskDetails"], taskID);
      inputRef.current.blur(); //bỏ forcus vô input
      message.open({
        type: "success",
        content: "Cập nhật tên công việc mới thành công",
      });
    },
    onError: () => {
      message.open({
        type: "error",
        content: "Cập nhật tên công việc mới thất bại",
      });
    },
  });

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
      title: values,
      eventID: eventID,
      parentTask: parentTask,
      taskID: taskID,
    };
    console.log("🚀 ~ file: TitleSubtask.js:89 ~ onFinish ~ data:", data);
    // updateTitle({ taskID, task: data });
    updateTitle(data);
  };

  return (
    <div className="mt-2 flex flex-row gap-x-2 justify-start items-center mb-4">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-name-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          <ThunderboltOutlined style={{ fontSize: 24, color: "black" }} />
        </label>
      </div>
      {taskParent ? (
        <Input
          className="mb-2 bg-transparent px-4 py-2 rounded-md text-3xl font-bold border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer h-fit"
          placeholder="Tên công việc ...."
          value={title}
          id="board-name-input"
          type="text"
          disabled={taskParent}
        />
      ) : (
        <Form onFinish={onFinish} className="w-full">
          <Form.Item
            name="title"
            initialValue={subtaskDetails?.[0].title}
            className="w-full mb-2"
          >
            <Input
              onPressEnter={onPressEnter}
              autoComplete="false"
              ref={inputRef}
              className="truncate bg-transparent px-4 py-2 rounded-md text-3xl font-bold border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer h-fit"
              placeholder="Tên công việc ...."
              value={subtaskDetails?.[0].title}
              onChange={(e) => titleDebounced(e.target.value)}
              id="board-name-input"
              type="text"
              disabled={disableUpdate}
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default TitleSubtask;
