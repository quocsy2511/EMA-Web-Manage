import {
  CheckCircleFilled,
  StarFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Form, Input, Modal, Popconfirm, message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { updateBudgetTransaction } from "../../../../apis/budgets";

const BudgetTransactionModal = ({
  isOpenTransactionModal,
  setIsOpenTransactionModal,
  selectItemTask,
  usedBudget,
  selectItemBudgetId,
  remainingBudget,
  setIsOpenRequestModal,
  setSelectTransactionTask = { setSelectTransactionTask },
}) => {
  const { transactions } = selectItemTask;
  const queryClient = useQueryClient();
  const [isRejectRequest, setIsRejectRequest] = useState(false);
  const [selectRequest, setSelectRequest] = useState("");
  const listStatus = ["PENDING", "ACCEPTED", "SUCCESS", "REJECTED"];

  const onCloseModal = () => {
    console.log("Click");
    setIsOpenTransactionModal(false);
  };
  const sortTransactions = (transactions, listStatus) => {
    return transactions.sort((a, b) => {
      // Lấy index của status của transaction trong mảng order
      const indexA = listStatus.indexOf(a.status);
      const indexB = listStatus.indexOf(b.status);
      // So sánh index để sắp xếp
      return indexA - indexB;
    });
  };
  const sortedTransactions = sortTransactions(transactions, listStatus);
  // console.log("🚀 ~ sortedTransactions:", sortedTransactions);
  const handleSelectRequest = (value) => {
    setSelectRequest(value);
    setIsRejectRequest(true);
  };

  const handleCancelSelectRequest = () => {
    setSelectRequest("");
    setIsRejectRequest(false);
  };

  const { mutate: acceptMutate, isLoading: isLoadingAccept } = useMutation(
    ({ transactionId, status }) =>
      updateBudgetTransaction({ transactionId, status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["budgetItem", selectItemBudgetId]);
        message.open({
          type: "success",
          content: "Đã gửi xác nhận hoá đơn thành công",
        });
        setIsOpenTransactionModal(false);
      },
      onError: (error) => {
        if (error?.response?.data?.statusCode === 500) {
          message.open({
            type: "error",
            content: `${error?.response?.data?.message}`,
          });
        } else {
          message.open({
            type: "error",
            content: "Đã xảy ra lỗi bất ngờ vui lòng thử lại",
          });
        }
      },
    }
  );

  const { mutate: rejectMutate, isLoading: isLoadingReject } = useMutation(
    ({ transactionId, rejectNote, status }) =>
      updateBudgetTransaction({ transactionId, rejectNote, status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["budgetItem", selectItemBudgetId]);
        // selectRequest("");
        message.open({
          type: "success",
          content: "Đã gửi huỷ hợp đồng thành công",
        });
        setIsOpenTransactionModal(false);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const confirm = (value, type) => {
    // console.log("🚀 ~ confirm ~ type:", type);
    acceptMutate({ transactionId: value?.id, status: type });
  };

  const handleRequestBudget = (value) => {
    setSelectTransactionTask(value);
    setIsOpenTransactionModal(false);
    setTimeout(() => {
      setIsOpenRequestModal(true);
    }, 200);
  };

  const onFinish = (value) => {
    // console.log("🚀 ~ onFinish ~ value:", value);
    rejectMutate({
      transactionId: selectRequest?.id,
      status: "REJECTED",
      rejectNote: value.rejectNote,
    });
  };
  return (
    <Modal
      // title={}
      title={
        isRejectRequest
          ? `Lý do từ chối - ${selectItemTask?.title}`
          : `${
              selectItemTask?.title
            } - Ngân sách còn lại : ${remainingBudget.toLocaleString()} VND`
      }
      width={"60%"}
      open={isOpenTransactionModal}
      onCancel={onCloseModal}
      style={{
        top: 20,
      }}
      className="rounded-xl max-h-[90%] overflow-y-scroll  p-0 "
      footer={false}
    >
      <div className="h-full w-full p-3">
        {isRejectRequest ? (
          <div className="w-full">
            <Form
              name="rejectContract"
              onFinish={onFinish}
              autoComplete="off"
              className="p-0 m-0 w-full"
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="rejectNote"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lí do từ chối hợp đồng",
                  },
                ]}
                className="w-full p-0 m-0  mb-4 h-fit"
              >
                <Input.TextArea
                  placeholder="Lí do từ chối hợp đồng ...."
                  showCount
                  maxLength={10000}
                  rows={10}
                  className=" p-0 mb-4"
                />
              </Form.Item>
              <Form.Item className="flex flex-row gap-x-2 justify-end w-full ">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoadingReject}
                  className="mr-2"
                >
                  Gửi
                </Button>
                <Button type="dashed" onClick={handleCancelSelectRequest}>
                  Huỷ
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <>
            {sortedTransactions?.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <div
                  className="w-full bg-slate-50 flex flex-col mt-3 px-4 py-2 rounded-lg mb-6 shadow-md"
                  key={transaction?.id}
                >
                  <div className="w-full flex flex-row justify-between items-stretch my-2  gap-x-2 ">
                    <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 ">
                      {transaction?.status === "PENDING" ? (
                        <p className="text-base text-yellow-500 border border-yellow-400 rounded-lg px-2 py-1">
                          Đang chờ
                        </p>
                      ) : transaction?.status === "ACCEPTED" ? (
                        <div className="w-full flex flex-row items-center gap-x-2">
                          <CheckCircleFilled className="text-green-500 text-2xl" />
                          <p className="text-base text-green-500 border border-green-500 rounded-lg px-2 py-1">
                            Đã chấp nhận
                          </p>
                        </div>
                      ) : transaction?.status === "REJECTED" ? (
                        <p className="text-base text-red-500 border border-red-500 rounded-lg px-2 py-1">
                          Đã từ chối
                        </p>
                      ) : (
                        <div className="w-full flex flex-row items-center gap-x-2">
                          <StarFilled className="text-blue-500 text-2xl" />
                          <p className="text-base text-blue-500 border border-blue-500 rounded-lg px-2 py-1">
                            Thành công
                          </p>
                        </div>
                      )}
                    </div>
                    {transaction?.status === "PENDING" &&
                      transaction?.amount < remainingBudget && (
                        <div className="w-[50%] flex flex-row justify-end items-start gap-x-2">
                          <Popconfirm
                            title="Duyệt yêu cầu"
                            description="Bạn có chắc chắn xác nhận yêu cầu này ?"
                            onConfirm={() => confirm(transaction, "SUCCESS")}
                            okText="Xác nhận"
                            cancelText="Huỷ"
                            key={transaction?.id}
                            okButtonProps={{
                              loading: isLoadingAccept,
                            }}
                          >
                            <Button
                              type="primary"
                              // loading={isLoadingAccept}
                              key={transaction?.id}
                            >
                              Chấp nhận
                            </Button>
                          </Popconfirm>

                          <Button
                            type="default"
                            onClick={() => handleSelectRequest(transaction)}
                          >
                            Từ chối
                          </Button>
                        </div>
                      )}

                    {transaction?.status === "PENDING" &&
                      transaction?.amount > remainingBudget && (
                        <div className="w-[50%] flex flex-row justify-end items-start gap-x-2">
                          <Button
                            type="primary"
                            key={transaction?.id}
                            onClick={() => handleRequestBudget(transaction)}
                          >
                            Yêu cầu ngân sách
                          </Button>
                        </div>
                      )}
                  </div>

                  <div className="w-full flex flex-row justify-between items-stretch mb-2  gap-x-5 ">
                    <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                      <p className="text-sm text-blueSecondBudget">
                        Tên chi phí
                      </p>
                      <b className="font-bold text-lg text-blueBudget">
                        {transaction?.transactionName}
                      </b>
                    </div>
                    <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                      <p className="text-sm text-blueSecondBudget">Ngày tạo</p>
                      <b className="font-bold text-lg text-blueBudget">
                        {moment(transaction?.createdAt).format(
                          " HH:MM, DD-MM-YYYY"
                        )}
                      </b>
                    </div>
                  </div>

                  <div className="w-full flex flex-row justify-between items-stretch mb-2  gap-x-5 ">
                    <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                      <p className="text-sm text-blueSecondBudget">Số tiền</p>
                      <b className="font-bold text-lg text-blueBudget">
                        {transaction?.amount?.toLocaleString()} VND
                      </b>
                    </div>
                    <div className="w-[50%] max-h-[150px] overflow-y-scroll flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                      <p className="text-sm text-blueSecondBudget">Mô tả</p>
                      <b className="font-bold text-lg text-blueBudget ">
                        {transaction?.description}
                      </b>
                    </div>
                  </div>

                  <div className="w-full flex flex-row justify-between items-stretch mb-2 border-b-gray-300 border-b py-2">
                    <div className="w-full flex flex-col justify-start items-start gap-y-2  py-2">
                      <p className="text-sm text-blueSecondBudget">
                        Tài liệu và hoá đơn chứng từ
                      </p>
                      {transaction?.evidences?.length > 0 ? (
                        transaction?.evidences?.map((evidence) => (
                          <a
                            target="_blank"
                            href={
                              evidence?.evidenceUrl ? evidence?.evidenceUrl : ""
                            }
                            key={evidence?.id}
                          >
                            <b className="font-bold text-lg text-blueBudget line-clamp-5 hover:text-blue-500">
                              {evidence?.evidenceFileName}
                            </b>
                          </a>
                        ))
                      ) : (
                        <b className="font-bold text-lg text-gray-300 line-clamp-5 ">
                          Chưa có hoá đơn
                        </b>
                      )}
                    </div>
                  </div>

                  {transaction?.status === "REJECTED" && (
                    <div className="w-full flex flex-row justify-between items-stretch mb-2 max-h-[150px] overflow-y-scroll ">
                      <div className="w-full flex flex-col justify-start items-start gap-y-2  py-2">
                        <p className="text-sm text-blueSecondBudget">
                          Lý do từ chối
                        </p>
                        <b className="font-bold text-lg text-blueBudget ">
                          {transaction?.rejectNote}
                        </b>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center">
                <Empty
                  description={<span>Không có yêu cầu ngân sách nào</span>}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default BudgetTransactionModal;
