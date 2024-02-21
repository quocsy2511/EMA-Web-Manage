import { Form, Modal } from "antd";
import React from "react";

const ContractCreatePage = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // on form submit success
  const onFinish = (values) => {};

  // on form submit fail
  const onFinishFailed = (errorInfo) => {};

  return (
    <Modal
      title={<p className="text-center text-4xl border-b pb-5">Tạo hợp đồng</p>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      //   confirmLoading={isLoading || uploadIsLoading}
      okText="Tạo"
      cancelText="Hủy"
      centered
      width={"50%"}
    >
      <Form
        className="p-5"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        initialValues={{}}
      ></Form>
    </Modal>
  );
};

export default ContractCreatePage;
