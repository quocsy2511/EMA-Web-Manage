import { Modal } from "antd";
import React from "react";

const ContactRejectNoteModal = ({
  isRejectContactModal,
  setIsRejectContactModal,
}) => {
  return (
    <Modal
      open={isRejectContactModal}
      onCancel={onCloseModal}
      footer={false}
      closeIcon={false}
    ></Modal>
  );
};

export default ContactRejectNoteModal;
