import { Form, Modal, message } from "antd";
import React from "react";

const TimekeepingUpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedTimekeeping,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    form.submit();
  };
  return (
    <Modal
      title={<p className="text-2xl">Chấm công ngày 04 / 03</p>}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleOk}
      //   confirmLoading={/*isLoading || uploadIsLoading*/}
      width={"50%"}
      okText="Lưu"
      cancelText="Hủy"
    >
      {contextHolder}
    </Modal>
  );
};

export default TimekeepingUpdateModal;
