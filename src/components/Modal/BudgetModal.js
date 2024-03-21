import { Button, Image, Input, Modal } from "antd";
import React, { memo, useState } from "react";

const BudgetModal = ({
  isModalOpen,
  setIsModalOpen,

  transactionId,
  handleChangeStatusTransaction,

  rejectNote,

  evidence,
}) => {
  const [input, setInput] = useState("Không phù hợp");

  return (
    <Modal
      title={
        <p className="text-center text-3xl">
          {evidence ? "Bằng chứng" : "Lý do từ chối"}
        </p>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      centered
      //   width={"50%"}
      footer={null}
      //   className="flex justify-center items-center"
    >
      {!!transactionId && (
        <>
          <Input
            className="my-5"
            value={input}
            placeholder="Nhập lý do từ chối..."
            onChange={(target) => setInput(target.target.value)}
            size="large"
          />
          <Button
            size="large"
            type="primary"
            className="w-full"
            onClick={() =>
              handleChangeStatusTransaction(transactionId, "REJECTED", input)
            }
          >
            Gửi
          </Button>
        </>
      )}

      {!!rejectNote && <p className="my-5 text-xl">{rejectNote}</p>}

      {!!evidence && (
        <>
          {evidence?.map((item) => (
            <Image key={item?.id} src={item?.evidenceUrl} />
          ))}
        </>
      )}
    </Modal>
  );
};

export default memo(BudgetModal);
