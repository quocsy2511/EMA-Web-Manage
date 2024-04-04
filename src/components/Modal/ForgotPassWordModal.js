import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal, message } from "antd";
import React from "react";
import { forgotPassword } from "../../apis/users";

const ForgotPassWordModal = ({
  isOpenForgotPasswordModal,
  setIsOpenForgotPasswordModal,
}) => {
  const [form] = Form.useForm();

  const { mutate: forgotPasswordMutate, isLoading } = useMutation(
    (data) => forgotPassword(data),
    {
      onSuccess: () => {
        setIsOpenForgotPasswordModal(false);
        message.open({
          type: "success",
          content: "cập nhật mật khẩu thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Đã xảy ra lỗi bất ngờ! Hãy thử lại sau",
        });
      },
    }
  );

  const onFinish = (values) => {
    console.log("🚀 ~ onFinish ~ values:", values);
    forgotPasswordMutate(values);
  };
  return (
    <Modal
      title="Quên mật khẩu"
      width={800}
      footer={false}
      open={isOpenForgotPasswordModal}
      onCancel={() => setIsOpenForgotPasswordModal(false)}
    >
      <div className="mt-4 p-4">
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          layout="horizontal"
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                type: "string",
                message: "Hãy nhập Mật khẩu cũ!",
              },
              { whitespace: true, message: "Mật khẩu cũ không được để trống!" },
              {
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                type: "string",
                message: "Hãy nhập Mật khẩu !",
              },
              { whitespace: true, message: "Mật khẩu  không được để trống!" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            label=" "
            colon={false}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full mt-6"
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ForgotPassWordModal;
