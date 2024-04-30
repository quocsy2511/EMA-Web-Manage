import { Button, Image, Input, Modal } from "antd";
import React, { memo, useState } from "react";

const BudgetModal = ({
  isModalOpen,
  setIsModalOpen,

  handleUpdateStatusTransaction,
  messageApi,
}) => {
  const [input, setInput] = useState("Không phù hợp");

  return (
    <Modal
      title={
        <p className="text-center text-3xl">
          {isModalOpen?.evidence ? "Bằng chứng" : "Lý do từ chối"}
        </p>
      }
      open={isModalOpen?.isOpen}
      onCancel={() =>
        setIsModalOpen((prev) => ({
          ...prev,
          isOpen: false,
        }))
      }
      centered
      //   width={"50%"}
      footer={null}
      //   className="flex justify-center items-center"
    >
      {!!isModalOpen?.transactionId && (
        <>
          <Input
            className="my-5"
            value={input}
            placeholder="Nhập lý do từ chối..."
            onChange={(target) => setInput(target.target.value)}
            size="large"
            allowClear
          />
          <Button
            size="large"
            type="primary"
            className="w-full"
            onClick={() =>
              input !== ""
                ? handleUpdateStatusTransaction(
                    isModalOpen?.transactionId,
                    "REJECTED",
                    input
                  )
                : messageApi.open({
                    type: "error",
                    content: "Chưa điền lý do từ chối!",
                  })
            }
          >
            Gửi
          </Button>
        </>
      )}

      {!!isModalOpen?.rejectNote && (
        <p className="my-5 text-xl">{isModalOpen?.rejectNote}</p>
      )}

      {!!isModalOpen?.evidences && (
        <>
          {isModalOpen?.evidences?.map((evidence) => (
            <Image key={evidence?.id} src={evidence?.evidenceUrl} />
          ))}
        </>
      )}
    </Modal>
  );
};

export default memo(BudgetModal);
