import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Segmented, message } from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createTaskTemplate } from "../../apis/tasks";

const SettingModal = ({
  isOpenNewTaskTemplate,
  setIsOpenNewTaskTemplate,
  templateEvent,
  selectTypeEvent,
}) => {
  const [form] = Form.useForm();
  const eventID = templateEvent?.id;
  const [priority, setPriority] = useState({ label: "THẤP", value: "LOW" });
  const handleCancel = () => {
    setIsOpenNewTaskTemplate(false);
  };

  const queryClient = useQueryClient();
  const { mutate: submitFormTask, isLoading } = useMutation(
    (task) => createTaskTemplate(task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("template-task");
        setIsOpenNewTaskTemplate(false);
        message.open({
          type: "success",
          content: "Tạo một công việc mới thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const onFinish = (values) => {
    const task = {
      ...values,
      eventID: eventID,
      startDate: "",
      endDate: "",
      isTemplate: true,
      assignee: [],
      estimationTime: 0,
      desc: JSON.stringify(values.desc.ops),
    };

    submitFormTask(task);
  };

  return (
    <Modal
      title={`Thêm công việc mới - ${selectTypeEvent}`}
      open={isOpenNewTaskTemplate}
      footer={false}
      onCancel={handleCancel}
      width={"50%"}
    >
      <div className="px-2 py-3 w-full overflow-hidden">
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          layout="vertical"
          autoComplete="off"
          className="m-0 p-0 "
        >
          <Form.Item
            label="Tên công việc"
            labelCol={{
              style: { padding: 0, fontWeight: 700 },
            }}
            name="title"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                message: "Hãy nhập  tên công việc!",
              },
              {
                whitespace: true,
                message: " Tên công việc không được để trống!",
              },
              {
                min: 3,
                max: 200,
                message: "tên công việc từ 3 đến 200 kí tự!",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Tên công việc  ..." />
          </Form.Item>
          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            className="text-sm font-medium"
            initialValue={priority.value}
            labelCol={{
              style: { padding: 0, fontWeight: 700 },
            }}
          >
            <Segmented
              options={[
                { label: "THẤP", value: "LOW" },
                { label: "VỪA", value: "MEDIUM" },
                { label: "CAO", value: "HIGH" },
              ]}
              value={priority.value}
              onChange={setPriority}
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            className="text-sm font-medium "
            name="desc"
            labelCol={{
              style: { padding: 0, fontWeight: 700 },
            }}
          >
            <ReactQuill
              theme="snow"
              onChange={(content, delta, source, editor) => {
                form.setFieldsValue({ desc: editor.getContents() });
              }}
              className="bg-transparent  py-2 rounded-md text-sm border-none h-20 border-gray-600 focus:outline-secondary outline-none ring-0 w-full "
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              className="mt-9"
            >
              Tạo công việc
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SettingModal;
