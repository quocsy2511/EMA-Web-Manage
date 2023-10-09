import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, message } from "antd";
import React from "react";
import { createDivision } from "../../apis/users";

const Label = ({ label }) => <p className="text-lg font-medium">{label}</p>;

const CreateDivisionDrawer = ({ showDrawer, setShowDrawer }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (division) => createDivision(division),
    {
      onSuccess: (data, division) => {
        console.log("success data: ", data);
        console.log("Params: ", division);
        form.setFieldsValue({ divisionName: "", description: "" });
        queryClient.invalidateQueries("division");
        setShowDrawer(false);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Khởi tạo 1 bộ phận"
        width={550}
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        bodyStyle={
          {
            // paddingBottom: 80,
          }
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="divisionName"
            label={<Label label="Tên bộ phận" />}
            rules={[
              {
                required: true,
                message: `Nhập dữ liệu đi!`,
              },
            ]}
          >
            <Input placeholder="Nhập tên ..." size="large" />
          </Form.Item>
          <Form.Item
            name="description"
            label={<Label label="Mô tả" />}
            rules={[
              {
                required: true,
                message: `Nhập dữ liệu đi!`,
              },
            ]}
          >
            <Input placeholder="Nhập mô tả ..." size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              className="mt-5"
              type="primary"
              size="large"
              onClick={() => form.submit()}
              loading={isLoading}
            >
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateDivisionDrawer;
