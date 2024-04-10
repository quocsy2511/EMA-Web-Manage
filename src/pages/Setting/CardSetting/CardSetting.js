import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Segmented, Switch, Tooltip, message } from "antd";
import React from "react";
import { updateTask, updateTaskStatus } from "../../../apis/tasks";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CardSetting = ({ task }) => {
  const [form] = Form.useForm();
  const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);
  const queryClient = useQueryClient();
  const { mutate: UpdateStatusMutate, isSuccess } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("template-task");
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

  const { mutate: updateTemp, isLoading: isLoadingUpdateTemp } = useMutation(
    (task) => updateTask(task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("template-task");
        message.open({
          type: "success",
          content: "Cập nhật  công việc thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Không thể Cập nhật  công việc Hãy thử lại sau",
        });
      },
    }
  );

  const onChangeChecked = (checked, value) => {
    if (checked === false && value) {
      UpdateStatusMutate({ taskID: value?.id, status: "CANCEL" });
    } else {
      UpdateStatusMutate({ taskID: value?.id, status: "OVERDUE" });
    }
  };
  const onFinish = (values) => {
    const data = {
      title: values?.taskName,
      eventID: null,
      startDate: null,
      endDate: null,
      description: JSON.stringify(values.description.ops),
      priority: values?.priority,
      parentTask: null,
      estimationTime: 0,
      effort: null,
      taskID: task?.id,
    };
    updateTemp(data);
  };

  return (
    <div className=" flex w-[49%] bg-white h-fit mb-7 rounded-xl" key={task.id}>
      {/* card */}
      <div className="border-none rounded-xl shadow-md w-full">
        {/* headerCard */}
        <div className="w-full bg-white border-b border-b-gray-300 p-4 flex justify-between justify-items-center flex-row rounded-t-xl overflow-hidden">
          <div className="w-[90%]  overflow-hidden">
            <Tooltip title={task?.title} placement="topLeft">
              <h5 className="text-lg font-semibold w-full truncate">
                {task?.title}
              </h5>
            </Tooltip>
          </div>

          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={
              task?.status === "OVERDUE" || task?.status === "PENDING"
                ? true
                : false
            }
            onChange={(checked) => onChangeChecked(checked, task)}
            className="bg-gray-300 w-auto"
            // loading={isSuccess ? true : false}
            checked={
              task?.status === "OVERDUE" || task?.status === "PENDING"
                ? true
                : false
            }
          />
        </div>
        {/* contentCard */}
        <div className="p-6">
          <Form
            key={task.id}
            disabled={task?.status === "CANCEL"}
            name={`task-form-${task?.id}`}
            className="m-0 p-0 w-full"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              taskName: task?.title,
              priority: task?.priority,
              description: {
                ops: JSON.parse(
                  task?.description?.startsWith(`[{"`)
                    ? task?.description
                    : parseJson(task?.description)
                ),
              },
            }}
          >
            <Form.Item
              className="w-full p-0 "
              label="Tên đề mục"
              labelCol={{
                style: { fontWeight: "700" },
              }}
              name="taskName"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên đề mục!",
                },
              ]}
            >
              <Input
                className="px-6 py-3 border-2 text-base font-inter font-normal"
                disabled={task?.status === "CANCEL"}
              />
            </Form.Item>
            {/* priority */}
            <Form.Item
              label="Độ ưu tiên"
              labelCol={{
                style: { fontWeight: "700" },
              }}
              name="priority"
            >
              <Segmented
                options={[
                  { label: "THẤP", value: "LOW" },
                  { label: "VỪA", value: "MEDIUM" },
                  { label: "CAO", value: "HIGH" },
                ]}
                value={task?.priority}
                // onChange={(value) =>
                //   updatePriorityFinish(value)
                // }
                disabled={task?.status === "CANCEL"}
              />
            </Form.Item>
            {/* description */}
            <Form.Item name="description" className="mb-0">
              <ReactQuill
                theme="snow"
                onChange={(content, delta, source, editor) => {
                  form.setFieldsValue({
                    description: editor.getContents(),
                  });
                }}
                readOnly={task?.status === "CANCEL"}
                className=" bg-transparent w-full py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
              className=" mt-5 flex justify-between items-baseline gap-x-3"
            >
              <Button
                type="primary"
                className="hover:scale-105 duration-300 mr-5 font-bold text-base h-fit w-fit py-3"
                htmlType="submit"
                loading={isLoadingUpdateTemp}
              >
                Chỉnh sửa
              </Button>
              {/* <Button
                type="default"
                className="hover:scale-105 duration-300 font-bold text-base h-fit w-fit py-3"
                htmlType="submit"
                //   loading={isLoading}
              >
                Huỷ
              </Button> */}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CardSetting;
