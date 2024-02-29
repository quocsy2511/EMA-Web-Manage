import { Modal, Select, Input } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

const ContactUpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  handleUpdateContact,
  selectedContactId,
  updateIsLoading,
}) => {
  const [selectReason, setSelectReason] = useState();
  const [text, setText] = useState("");
  console.log("text > ", text);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    if (selectReason === 0)
      handleUpdateContact(selectedContactId, "REJECTED", text);
    else handleUpdateContact(selectedContactId, "REJECTED", selectReason);

    setSelectReason();
    setText("");
  };

  return (
    <Modal
      title={<p className="text-center text-2xl pb-4">Lý do từ chối</p>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={updateIsLoading}
      centered
      width={"30%"}
      okText="Ok"
      cancelText="Hủy"
    >
      <p className="text-lg mb-2">Chọn lý do</p>
      <Select
        className="w-[80%]"
        // defaultValue
        placeholder="Chọn lý do"
        onChange={(value) => setSelectReason(value)}
        options={[
          {
            value: "Không phù hợp với tổ chức",
            label: <p className="font-semibold">Không phù hợp với tổ chức</p>,
          },
          {
            value: "Ngân sách chưa phù hợp",
            label: <p className="font-semibold">Ngân sách chưa phù hợp</p>,
          },
          {
            value: "Địa điểm không phù hợp",
            label: <p className="font-semibold">Địa điểm không phù hợp</p>,
          },
          {
            value: "Ngày diễn ra bị trùng lặp",
            label: <p className="font-semibold">Ngày diễn ra bị trùng lặp</p>,
          },
          {
            value: "Ngày kết thúc bị trùng lặp",
            label: <p className="font-semibold">Ngày kết thúc bị trùng lặp</p>,
          },
          {
            value: 0,
            label: <p className="font-semibold">Khác</p>,
          },
        ]}
      />

      <p className="text-lg mb-2 mt-5">Mô tả</p>
      <div className="relative">
        {selectReason !== 0 && (
          <div className="absolute bg-slate-500/20 w-full h-full rounded-lg" />
        )}
        <TextArea
          className="text-sm"
          value={text}
          onChange={(target) => setText(target.target.value)}
          rows={4}
          placeholder="Nhập lý do khác ..."
          maxLength={6}
          disabled={selectReason !== 0}
        />
      </div>
    </Modal>
  );
};

export default ContactUpdateModal;
