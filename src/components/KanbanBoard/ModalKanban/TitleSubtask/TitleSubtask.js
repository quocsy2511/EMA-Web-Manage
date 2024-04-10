import { ThunderboltOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Input, message } from "antd";
import { debounce } from "lodash";
import React, { useRef, useState } from "react";
import { getTasks, updateTask } from "../../../../apis/tasks";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import { useRouteLoaderData } from "react-router-dom";

const TitleSubtask = ({
  disableUpdate,
  taskParent,
  taskSelected,
  title,
  setTitle,
}) => {
  const inputRef = useRef(null);
  const taskID = taskSelected?.id;
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const titleDebounced = debounce((value) => {
    setTitle(value);
  }, 300); // Thời gian chờ 300ms

  const onPressEnter = (e) => {
    // Kiểm tra nếu người dùng nhấn phím "Enter"
    if (e.key === "Enter" && submittable) {
      e.preventDefault();
      onFinish(title);
    } else {
      message.open({
        type: "error",
        content: "Không được để trống tên công việc",
      });
    }
  };

  const {
    data: subtaskDetails,
    isError,
    isLoading,
  } = useQuery(
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

  const queryClient = useQueryClient();
  const { mutate: updateTitle } = useMutation((task) => updateTask(task), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
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
    const eventID = taskSelected?.eventDivision?.event?.id;
    const parentTask = taskSelected?.parent?.id;
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
    updateTitle(data);
  };

  return (
    <div className="mt-2 flex flex-row gap-x-2 justify-center items-center  rounded-lg w-full">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-name-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          {/* <ThunderboltOutlined style={{ fontSize: 24, color: "black" }} /> */}
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
        <>
          {!isLoading ? (
            !isError ? (
              <Form onFinish={onFinish} className="w-full" form={form}>
                <Form.Item
                  name="title"
                  initialValue={subtaskDetails?.[0].title}
                  className="w-full mb-2"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên công việc",
                    },
                  ]}
                >
                  <Input
                    onPressEnter={onPressEnter}
                    autoComplete="false"
                    ref={inputRef}
                    className=" hover:bg-slate-200 truncate bg-transparent px-4 py-2 rounded-md text-3xl font-bold border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer h-fit"
                    placeholder="Tên công việc ...."
                    value={subtaskDetails?.[0].title}
                    onChange={(e) => titleDebounced(e.target.value)}
                    id="board-name-input"
                    type="text"
                    disabled={disableUpdate}
                  />
                </Form.Item>
              </Form>
            ) : (
              <AnErrorHasOccured />
            )
          ) : (
            <LoadingComponentIndicator />
          )}
        </>
      )}
    </div>
  );
};

export default TitleSubtask;
