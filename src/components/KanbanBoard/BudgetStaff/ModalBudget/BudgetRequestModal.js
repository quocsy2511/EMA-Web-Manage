import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import React from "react";
import { postTransactionBudget } from "../../../../apis/budgets";

const BudgetRequestModal = ({
  isOpenRequestModal,
  setIsOpenRequestModal,
  // requests,
  taskParentId,
  title,
  selectTransactionTask,
  setActiveKey,
}) => {
  const onCloseModal = () => {
    setIsOpenRequestModal(false);
  };
  const queryClient = useQueryClient();
  const { mutate: newRequest, isLoading: isLoadingNewRequest } = useMutation(
    (data) => postTransactionBudget(taskParentId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["requestsTaskParent", taskParentId]);
        message.open({
          type: "success",
          content: "Đã gửi yêu cầu ngân sách mới thành công",
        });
        setIsOpenRequestModal(false);
        if (selectTransactionTask) {
          setActiveKey("request");
        }
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const onFinish = (value) => {
    newRequest(value);
  };
  return (
    <Modal
      title={`Yêu cầu thêm ngân sách công việc - ${title}`}
      width={"60%"}
      open={isOpenRequestModal}
      onCancel={onCloseModal}
      footer={false}
    >
      <div className="w-full">
        <Form
          name="transaction-request"
          onFinish={onFinish}
          autoComplete="off"
          className="p-0 m-0 w-full"
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Tên chi phí yêu cầu"
            labelCol={{
              style: { fontWeight: "700" },
            }}
            name="transactionName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên yêu cầu ngân sách",
              },
            ]}
            className="w-full h-fit"
            initialValue={
              selectTransactionTask
                ? selectTransactionTask?.transactionName
                : ""
            }
          >
            <Input placeholder="Tên yêu cầu ngân sách ...." />
          </Form.Item>
          <Form.Item
            labelCol={{
              style: { fontWeight: "700" },
            }}
            label="Chi phí dự kiến"
            name="amount"
            className=" w-full"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số tiền",
              },
              {
                validator: (_, value) =>
                  value >= 1000
                    ? Promise.resolve()
                    : Promise.reject(new Error("Chi phí tối thiểu là 1,000")),
              },
            ]}
            initialValue={
              selectTransactionTask ? selectTransactionTask?.amount : 0
            }
          >
            <InputNumber
              className="w-full"
              min={1000}
              placeholder="Chi phí sự kiện"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              controls={false}
              addonAfter="VND"
              variant="borderless"
              size="large"
            />
          </Form.Item>
          <Form.Item
            labelCol={{
              style: { fontWeight: "700" },
            }}
            label="Mô tả yêu cầu chi phí"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả ngân sách",
              },
            ]}
            className="w-full   mb-4 h-fit"
            initialValue={
              selectTransactionTask ? selectTransactionTask?.description : ""
            }
          >
            <Input.TextArea
              placeholder="mô tả ngân sách ...."
              showCount
              maxLength={10000}
              rows={5}
              className=" p-0 mb-4"
            />
          </Form.Item>
          <Form.Item className="w-full ">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingNewRequest}
              className="w-full"
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default BudgetRequestModal;
