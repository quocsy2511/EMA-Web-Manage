import { PlusCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Popconfirm, Spin, message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { getOwnTransactionBudget } from "../../../apis/budgets";
import { deleteRequestBudget } from "../../../apis/requests";
import BudgetRequestModal from "./ModalBudget/BudgetRequestModal";

const BudgetRequest = ({ selectBudget }) => {
  const taskParentId = selectBudget?.id;
  const [sizePage, setSizePage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("ALL");
  const [isOpenRequestModal, setIsOpenRequestModal] = useState(false);

  const {
    data: requests,
    isError: isErrorRequests,
    isLoading: isLoadingRequests,
  } = useQuery(
    ["requestsTaskParent", taskParentId],
    () =>
      getOwnTransactionBudget({
        sizePage: sizePage,
        currentPage: currentPage,
        sortProperty: "createdAt",
        sort: sort,
        status: status,
        taskId: taskParentId,
      }),
    {
      select: (data) => {
        return data.data?.[0];
        // const findTaskParentTransaction = data?.data?.find(
        //   (task) => task?.taskId === taskParentId
        // );
        // return findTaskParentTransaction;
      },
      refetchOnWindowFocus: false,
      enabled: !!taskParentId,
    }
  );
  const queryClient = useQueryClient();
  const { mutate: deleteRequest, isLoading: isLoadingDeleteRequest } =
    useMutation((id) => deleteRequestBudget(id), {
      onSuccess: () => {
        queryClient.invalidateQueries(["requestsTaskParent", taskParentId]);
        message.open({
          type: "success",
          content: "Đã huỷ yêu cầu thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const handleDeleteRequest = (id) => {
    deleteRequest(id);
  };

  return (
    <div className=" w-full h-fit">
      {selectBudget?.status === "CONFIRM" ? (
        <div className="text-lg font-semibold w-full  bg-slate-50 flex flex-row justify-center items-center  px-4 py-6 rounded-lg mb-4 shadow-md text-gray-400 ">
          <p className="text-base font-semibold text-red-400">
            Công việc đã hoàn thành không thể tạo thêm yêu cầu ngân sách
          </p>
        </div>
      ) : (
        <div
          className="text-lg font-semibold w-full hover:bg-slate-200 bg-slate-50 flex flex-row justify-center items-center  px-4 py-6 rounded-lg mb-4 shadow-md text-gray-400 hover:text-blue-500"
          onClick={() => setIsOpenRequestModal(true)}
        >
          <PlusCircleFilled />
        </div>
      )}

      <Spin spinning={isLoadingRequests}>
        {requests?.transactions?.length > 0 ? (
          requests?.transactions?.map((transaction) => (
            <div
              className="w-full bg-slate-50 flex flex-col  px-4 py-2 rounded-lg mb-4 shadow-md"
              key={transaction?.id}
            >
              <div className="w-full flex flex-row justify-between items-stretch my-2  gap-x-2 ">
                <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 ">
                  {transaction?.status === "PENDING" ? (
                    <p className="text-base text-yellow-500 border border-yellow-400 rounded-lg px-2 py-1">
                      Đang chờ
                    </p>
                  ) : transaction?.status === "ACCEPTED" ? (
                    <p className="text-base text-green-500 border border-green-500 rounded-lg px-2 py-1">
                      Đã chấp nhận
                    </p>
                  ) : transaction?.status === "REJECTED" ? (
                    <p className="text-base text-red-500 border border-red-500 rounded-lg px-2 py-1">
                      Đã từ chối
                    </p>
                  ) : (
                    <p className="text-base text-blue-500 border border-blue-500 rounded-lg px-2 py-1">
                      Thành công
                    </p>
                  )}
                </div>
                {transaction?.status === "PENDING" && (
                  <div className="flex flex-row justify-end items-start ">
                    <Popconfirm
                      title="Xoá yêu cầu"
                      description="Bạn có chắc chắn xoá yêu cầu này ?"
                      onConfirm={() => handleDeleteRequest(transaction?.id)}
                      okText="Đồng ý"
                      cancelText="Không"
                      key={transaction?.id}
                    >
                      <Button danger>Huỷ yêu cầu</Button>
                    </Popconfirm>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-row justify-between items-stretch mb-2  gap-x-5 ">
                <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                  <p className="text-sm text-blueSecondBudget">
                    {transaction?.transactionName
                      ? "Tên chi phí"
                      : "Mã chi phí"}
                  </p>
                  <b className="font-bold text-lg text-blueBudget">
                    {transaction?.transactionName
                      ? transaction?.transactionName
                      : transaction?.transactionCode}
                  </b>
                </div>
                <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                  <p className="text-sm text-blueSecondBudget">Ngày tạo</p>
                  <b className="font-bold text-lg text-blueBudget">
                    {moment(transaction?.createdAt).format(
                      "HH:mm:ss, DD-MM-YYYY"
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
                    {transaction?.description
                      ? transaction?.description
                      : "chưa có mô tả"}
                  </b>
                </div>
              </div>

              {transaction?.status === "REJECTED" && (
                <div className="w-full flex flex-row justify-between items-stretch mb-2">
                  <div className="w-full flex flex-col justify-start items-start gap-y-2  py-2 max-h-[150px] overflow-y-scroll">
                    <p className="text-sm text-blueSecondBudget">
                      Lý do từ chôi
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
          <div className="w-ful flex justify-center items-center">
            {" "}
            <Empty description={<span>Chưa có giao dịch nào</span>} />
          </div>
        )}
      </Spin>
      <Spin spinning={isLoadingRequests}>
        {isOpenRequestModal && (
          <BudgetRequestModal
            isOpenRequestModal={isOpenRequestModal}
            setIsOpenRequestModal={setIsOpenRequestModal}
            taskParentId={taskParentId}
            selectTransactionTask={null}
            title={selectBudget?.title}
          />
        )}
      </Spin>
    </div>
  );
};

export default BudgetRequest;
