import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../apis/users";
import { closeConnectSocket } from "../../../utils/socket";
import { useDispatch } from "react-redux";
import { chatsActions } from "../../../store/chats";
import { chatDetailActions } from "../../../store/chat_detail";

const ChangePasswordModal = ({
  isOpenChangePasswordModal,
  setIsOpenPasswordModal,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.removeItem("token");
    closeConnectSocket();
    dispatch(chatsActions.resetChats());
    dispatch(chatDetailActions.resetChatDetail());
    navigate("/");
  };

  const { mutate: changePasswordMutate, isLoading } = useMutation(
    (user) => changePassword(user),
    {
      onSuccess: () => {
        setIsOpenPasswordModal(false);
        message.open({
          type: "success",
          content: "cập nhật mật khẩu thành công",
        });
        logout();
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Mật khẩu không khớp! Hãy thử lại",
        });
      },
    }
  );

  const onFinish = (values) => {
    changePasswordMutate(values);
  };

  return (
    <Modal
      title="Thay đổi mật khẩu"
      width={800}
      footer={false}
      open={isOpenChangePasswordModal}
      onCancel={() => setIsOpenPasswordModal(false)}
    >
      <div className="mt-4 p-4">
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          autoComplete="off"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                type: "string",
                message: "Hãy nhập Mật khẩu cũ!",
              },
              { whitespace: true, message: "Mật khẩu cũ không được để trống!" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu mới"
              autoComplete="curren-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập đúng mật khẩu đã nhập!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không đúng !"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
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

export default ChangePasswordModal;
