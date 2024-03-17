import { Modal } from "antd";
import React from "react";

const ContractRejected = ({
  isModalRejectNoteOpen,
  setIsModalRejectNoteOpen,
  rejectNote,
}) => {
  const handleCancel = () => {
    setIsModalRejectNoteOpen(false);
  };

  return (
    <Modal
      open={isModalRejectNoteOpen}
      title="Lí do từ chối hợp đồng từ khách hàng"
      footer={false}
      onCancel={handleCancel}
    >
      <p className="text-lg italic">
        {rejectNote ? rejectNote : "Chưa có lí do"}
      </p>
    </Modal>
  );
};

export default ContractRejected;
