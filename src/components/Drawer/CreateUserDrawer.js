import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Drawer, Form } from "antd";
import React from "react";

const Label = ({ label }) => <p className="text-lg font-medium">{label}</p>;

const CreateUserDrawer = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError } = useMutation();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <div>
      {contextHolder}
      <Drawer
        title="Khởi tạo 1 nhân viên"
        width={550}
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name=""
            label={<Label label="" />}
            rules={[
              {
                required: true,
                message: `Nhập dữ liệu đi!`,
              },
            ]}
          >
            <Input placeholder="Nhập  ..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateUserDrawer;
