import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircleFilled,
  DoubleRightOutlined,
  SwapOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Empty, Spin } from "antd";
import { getContractFile } from "../../apis/contract";
import moment from "moment";
import ContractRejected from "../../components/Modal/ContractRejected";

const ContractHomePage = () => {
  const [isContract, setIsContract] = useState(false);
  const [selectContract, setSelectContract] = useState("");
  const [isModalRejectNoteOpen, setIsModalRejectNoteOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const navigate = useNavigate();

  const {
    data: contracts,
    isLoading,
    isError,
  } = useQuery(["contracts"], () => getContractFile(), {
    select: (data) => {
      // console.log("🚀 ~ ContractHomePage ~ data:", data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleSelectContract = (value) => {
    console.log("🚀 ~ handleSelectContract ~ value:", value);
    setIsContract(true);
    setSelectContract(value);
  };

  const handleBack = () => {
    setIsContract(false);
    setSelectContract("");
  };

  const handleOpenRejectNote = (value) => {
    setIsModalRejectNoteOpen(true);
    setRejectNote(value);
  };

  return (
    <>
      {/* header */}
      <div className="flex flex-row w-full py-2">
        <div className="flex flex-row w-full justify-between items-center mb-2 ">
          <div className="w-full flex flex-col justify-center items-start  py-2">
            {isContract ? (
              <h3 className="font-bold text-3xl text-blueBudget mb-2">
                Chi tiết hợp đồng
              </h3>
            ) : (
              <h3 className="font-bold text-3xl text-blueBudget mb-2">
                Danh sách hợp đồng
              </h3>
            )}

            <p className="text-blueSecondBudget font-semibold">
              Quản lí thông tin hợp đồng khách hàng
            </p>
          </div>
          <div className="w-[50%] flex justify-end text-end items-end h-full">
            <ul className="pl-0 list-none flex flex-row justify-end items-end mt-2 w-full overflow-hidden">
              <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                <span
                  className="cursor-pointer hover:text-blue-500 text-blueBudget font-bold"
                  onClick={() => navigate("/manager")}
                >
                  Trang chủ
                </span>
                <DoubleRightOutlined />
              </li>
              <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                <span className="cursor-pointer hover:text-blueBudget">
                  <span className="font-bold">Hợp đồng</span>
                </span>
                <DoubleRightOutlined />
              </li>
              <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                <span className="cursor-pointer hover:text-blueBudget">
                  <span className="font-bold">Danh sách hợp đồng</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isContract ? (
        <div className="w-full flex flex-col mt-3">
          {/* inforCus */}
          <div className="w-full bg-white h-fit mb-7 rounded-xl p-6">
            <div className="w-full flex flex-row justify-start items-center gap-x-3 mb-6">
              <SwapOutlined
                onClick={handleBack}
                className="text-lg text-blue-500 hover:text-blue-300"
              />
              <h2 className="font-bold text-2xl">Thông tin khách hàng</h2>
            </div>
            <div className="w-full flex flex-row justify-between items-stretch mb-2  gap-x-5">
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">Họ và tên</p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.customerName}
                </b>
              </div>
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">Mã định danh</p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.customerNationalId}
                </b>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-stretch mb-2 gap-x-5">
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">Địa chỉ</p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.customerAddress}
                </b>
              </div>
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">Email</p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.customerEmail}
                </b>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-stretch mb-2 gap-x-5">
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b pt-2 pb-[14px]">
                <p className="text-sm text-blueSecondBudget">Số điện thoại</p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.customerPhoneNumber}
                </b>
              </div>
            </div>
          </div>
          {/* inforEvent */}
          <div className="w-full bg-white h-fit mb-7 rounded-xl p-6">
            <div className="w-full flex flex-row justify-start items-center gap-x-3 mb-6">
              <h2 className="font-bold text-2xl break-words flex-1">
                Thông tin sự kiện
              </h2>
            </div>
            <div className="w-full flex flex-row justify-between items-stretch mb-2  gap-x-5">
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">Tên sự kiện</p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.eventName}
                </b>
              </div>
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">
                  Thời gian diễn ra sự kiện
                </p>
                <b className="font-bold text-lg text-blueBudget">
                  {moment(selectContract?.processingDate).format("DD-MM-YYYY")}{" "}
                  <SwapRightOutlined />{" "}
                  {moment(selectContract?.endDate).format("DD-MM-YYYY")}
                </b>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-stretch mb-2 gap-x-5 h-fit ">
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2 ">
                <p className="text-sm text-blueSecondBudget">
                  Địa điễm diễn ra sự kiện
                </p>
                <b className="font-bold text-lg text-blueBudget break-words">
                  {selectContract?.location}
                </b>
              </div>
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2 ">
                <p className="text-sm text-blueSecondBudget">
                  Thời gian bắt đầu dự án
                </p>
                <b className="font-bold text-lg text-blueBudget">
                  {moment(selectContract?.startDate).format("DD-MM-YYYY")}
                </b>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-stretch mb-2 gap-x-5">
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b pt-2">
                <p className="text-sm text-blueSecondBudget">
                  Phương thức thanh toán
                </p>
                <b className="font-bold text-lg text-blueBudget">
                  {selectContract?.paymentMethod}
                </b>
              </div>
              <div className="w-[50%] flex flex-col justify-start items-start gap-y-2 border-b-gray-300 border-b py-2">
                <p className="text-sm text-blueSecondBudget">
                  Trạng thái hợp đồng{" "}
                </p>

                {selectContract?.status === "PENDING" ? (
                  <p className="text-base text-yellow-500 border border-yellow-400 rounded-lg px-2 py-1">
                    Đang chờ
                  </p>
                ) : selectContract?.status === "ACCEPTED" ? (
                  <>
                    <CheckCircleFilled className="text-green-500 text-2xl" />
                    <p className="text-base text-green-500 border border-green-500 rounded-lg px-2 py-1">
                      Đã chấp nhận
                    </p>
                  </>
                ) : selectContract?.status === "REJECTED" ? (
                  <p className="text-base text-red-500 border border-red-500 rounded-lg px-2 py-1">
                    Đã từ chối
                  </p>
                ) : (
                  <p className="text-base text-gray-500 border border-gray-500 rounded-lg px-2 py-1">
                    Chờ kí
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* listFile */}
          <div className="w-full bg-white h-fit mb-7 rounded-xl p-6">
            <h2 className="font-bold text-2xl mb-6">
              Danh sách tài liệu hợp đồng
            </h2>

            <div className="w-full flex flex-col">
              {/* cardFile */}
              {selectContract?.files?.length > 0 ? (
                selectContract?.files?.map((file, index) => (
                  <div
                    className="w-full flex flex-col  items-start border-b border-b-gray-200 mb-2 py-3 "
                    key={index}
                  >
                    <a
                      target="_blank"
                      href={file?.contractFileUrl ? file?.contractFileUrl : ""}
                      className="w-full flex flex-row  items-start "
                    >
                      <div className="flex-1 flex flex-col justify-start items-start text-start">
                        <div className="w-full flex flex-row  items-center gap-x-4">
                          <h5
                            className={`font-bold text-lg text-blueBudget hover:text-blue-600 ${
                              file?.contractFileStatus === "REJECTED"
                                ? "line-through decoration-red-700 decoration-2 text-opacity-30"
                                : file?.contractFileStatus === "ACCEPTED" &&
                                  "text-green-500"
                            }`}
                          >
                            {file?.contractFileName}
                          </h5>
                        </div>
                        <p className="text-sm text-blueSecondBudget">
                          Thời gian tạo :{" "}
                          <b>
                            {file?.createdAt
                              ? moment(file?.createdAt).format("DD-MM-YYYY")
                              : moment(selectContract?.createdAt).format(
                                  "DD-MM-YYYY"
                                )}
                          </b>
                        </p>
                      </div>
                      <>
                        {file?.status === "PENDING" ? (
                          <p className="text-base text-yellow-500 border border-yellow-400 rounded-lg px-2 py-1">
                            Đang chờ
                          </p>
                        ) : file?.status === "ACCEPTED" ? (
                          <>
                            <CheckCircleFilled className="text-green-500 text-2xl" />
                            <p className="text-base text-green-500 border border-green-500 rounded-lg px-2 py-1">
                              Đã chấp nhận
                            </p>
                          </>
                        ) : file?.status === "REJECTED" ? (
                          <p className="text-base text-red-500 border border-red-500 rounded-lg px-2 py-1">
                            Đã từ chối
                          </p>
                        ) : (
                          <p className="text-base text-gray-500 border border-gray-500 rounded-lg px-2 py-1">
                            Chờ kí
                          </p>
                        )}
                      </>
                    </a>
                    {file?.status === "REJECTED" && (
                      <p
                        className="font-semibold text-base text-red-400 hover:text-red-600 w-full text-end cursor-pointer"
                        onClick={() => handleOpenRejectNote(file?.rejectNote)}
                      >
                        (Lí do từ chối)
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full py-4 flex justify-center items-center">
                  <Empty
                    description={
                      <span>Hiện tại chưa có danh sách hợp đồng</span>
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Spin spinning={isLoading}>
            <div className="flex flex-wrap w-full gap-x-5 ">
              {/* card */}
              {contracts?.length > 0 ? (
                contracts?.map((contract) => (
                  <div
                    className=" flex w-[49%] bg-white h-fit mb-7 rounded-xl"
                    key={contract?.id}
                  >
                    <div className="border-none rounded-xl shadow-md w-full">
                      <div className="p-5 flex flex-col w-full">
                        <div className="flex flex-row items-center justify-start gap-x-2 w-full mb-3">
                          <div className="w-full flex flex-col justify-start items-start ">
                            <div className="w-full justify-start items-start flex flex-row gap-x-2 mb-3">
                              <h4 className="font-bold text-lg break-words text-blueBudget ">
                                Sự kiện :
                              </h4>
                              <h4 className="font-bold text-lg break-words text-blueBudget ">
                                {contract?.eventName}
                              </h4>
                            </div>

                            <div className="w-full justify-start items-center flex flex-row gap-x-2 mb-1">
                              <h4 className="font-bold text-sm text-blueSecondBudget ">
                                Thời gian tạo :{" "}
                              </h4>
                              <p className="font-medium text-sm  break-words text-blueSecondBudget ">
                                {moment(contract?.createdAt).format(
                                  "DD-MM-YYYY"
                                )}
                              </p>
                            </div>

                            <div className="w-full justify-start items-center flex flex-row gap-x-2 mb-1">
                              <h4 className="font-bold text-sm text-blueSecondBudget ">
                                Khách hàng :{" "}
                              </h4>
                              <p className="font-medium text-sm flex-1 truncate text-blueSecondBudget mb-1">
                                {contract?.customerName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="h-[1px] w-full bg-slate-200 mb-3" />
                        <div className="w-full flex flex-row justify-between ">
                          <div className="flex flex-row items-center gap-x-3">
                            <>
                              {contract?.status === "PENDING" ? (
                                <p className="text-base text-yellow-500 border border-yellow-400 rounded-lg px-2 py-1">
                                  Đang chờ
                                </p>
                              ) : contract?.status === "ACCEPTED" ? (
                                <>
                                  <CheckCircleFilled className="text-green-500 text-2xl" />
                                  <p className="text-base text-green-500 border border-green-500 rounded-lg px-2 py-1">
                                    Đã chấp nhận
                                  </p>
                                </>
                              ) : contract?.status === "REJECTED" ? (
                                <p className="text-base text-red-500 border border-red-500 rounded-lg px-2 py-1">
                                  Đã từ chối
                                </p>
                              ) : (
                                <p className="text-base text-gray-500 border border-gray-500 rounded-lg px-2 py-1">
                                  Chờ kí
                                </p>
                              )}
                            </>
                          </div>
                          <div
                            className="text-end flex flex-row items-center gap-x-1 text-blue-400 hover:text-blue-200 cursor-pointer"
                            onClick={() => handleSelectContract(contract)}
                          >
                            <DoubleRightOutlined className=" text-xs " />
                            <p className=" text-sm ">Xem chi tiết</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex justify-center items-center py-8">
                  <Empty description={<span>Hiện tại chưa có hợp đồng</span>} />
                </div>
              )}
            </div>
          </Spin>
        </>
      )}

      {isModalRejectNoteOpen && (
        <ContractRejected
          isModalRejectNoteOpen={isModalRejectNoteOpen}
          setIsModalRejectNoteOpen={setIsModalRejectNoteOpen}
          rejectNote={rejectNote}
        />
      )}
    </>
  );
};

export default ContractHomePage;
