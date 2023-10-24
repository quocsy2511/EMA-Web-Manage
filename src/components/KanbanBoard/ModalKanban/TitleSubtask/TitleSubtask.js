import { ThunderboltOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { debounce } from "lodash";
import React, { useRef, useState } from "react";
import { updateTask } from "../../../../apis/tasks";

const TitleSubtask = ({ disableUpdate, taskParent, taskSelected }) => {
  const inputRef = useRef(null);
  const taskID = taskSelected?.id;
  const [title, setTitle] = useState(taskSelected.title);

  const descriptionDebounced = debounce((value) => {
    setTitle(value);
  }, 500); // Thời gian chờ 500ms

  const onPressEnter = (e) => {
    // Kiểm tra nếu người dùng nhấn phím "Enter"
    if (e.key === "Enter") {
      e.preventDefault();
      onFinish(title);
    }
  };
  const queryClient = useQueryClient();
  const { mutate: updateTitle } = useMutation(
    ({ taskID, task }) => updateTask({ taskID, task }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        inputRef.current.blur(); //bỏ forcus vô input
        message.open({
          type: "success",
          content: "Cập tên công việc mới thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Cập tên công việc mới thất bại",
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
      title: values,
      eventID: eventID,
      parentTask: parentTask,
    };
    updateTitle({ taskID, task: data });
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
          <Form.Item name="title" initialValue={title} className="w-full mb-2">
            <Input
              onPressEnter={onPressEnter}
              autoComplete={false}
              ref={inputRef}
              className="truncate bg-transparent px-4 py-2 rounded-md text-3xl font-bold border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer h-fit"
              placeholder="Tên công việc ...."
              value={title}
              onChange={(e) => descriptionDebounced(e.target.value)}
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
