import { Modal } from "antd";
import React from "react";
import { ClockLoader } from "react-spinners";

const LockLoadingModal = ({ isModalOpen, label }) => {
  return (
    <Modal
      open={isModalOpen}
      closable={false}
      footer={null}
      centered
      destroyOnClose={false}
      maskClosable={false}
    >
      <div className="flex flex-col items-center py-5 space-y-5">
        <ClockLoader color="#1677ff" speedMultiplier={1.5} />
        <p className="text-xl font-medium">{label}</p>
      </div>
    </Modal>
  );
};

export default LockLoadingModal;
