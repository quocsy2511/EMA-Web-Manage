import React, { Fragment, useEffect, useState } from "react";
import { BsMailbox, BsTrash3 } from "react-icons/bs";
import RequestsList from "../../components/RequestItem/RequestsList";
import RequestDetail from "../../components/RequestItem/RequestDetail";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "antd";
import NewRequestModal from "./Modal/NewRequestModal";
import { useQuery } from "@tanstack/react-query";
import { getAllRequests, getAnnualLeave } from "../../apis/requests";
import { useRouteLoaderData } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import EditRequestModal from "./Modal/EditRequestModal";
import moment from "moment";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";

const RequestPage = () => {
  const staff = useRouteLoaderData("staff");
  // console.log("🚀 ~ file: RequestPage.js:16 ~ RequestPage ~ staff:", staff);

  const [currentPage, setCurrentPage] = useState(1);
  console.log("currentPage: ", currentPage);
  const [selectedRequest, setSelectedRequest] = useState();
  const [selectedRequestType, setSelectedRequestType] = useState("inbox"); // inbox - bin
  const [isOpenNewRequest, setIsOpenNewRequest] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isOpenEditRequest, setIsOpenEditRequest] = useState(false);
  const [requestSelected, setRequestSelected] = useState("");
  const [searchText, setSearchText] = useState();

  const {
    data: requests,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery(
    ["requests"],
    () =>
      getAllRequests({
        curentPage: currentPage,
        pageSize: 10,
        type: selectedType,
        requestor: staff ? staff.id : undefined,
        requestorName: searchText,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: annualLeave,
    isLoading: isLoadingAnnualLeave,
    isError: isErrorAnnualLeave,
  } = useQuery(["annual-leave"], () => getAnnualLeave(), {
    refetchOnWindowFocus: false,
    select: (data) => {
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [selectedType, currentPage]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      refetch();
    }, 1500);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchText]);

  const handleChangeRequestType = (type) => {
    setSelectedRequestType(type);
  };

  const handleChangeType = (type) => {
    setSelectedType(type);
  };

  return (
    <Fragment>
      <div className="w-full h-[calc(100vh-64px)] bg-[#F0F6FF] py-12 px-20">
        <div className="w-full h-full bg-white rounded-lg shadow-xl flex">
          <div className="w-1/5 border-r overflow-hidden overflow-y-scroll scrollbar-hide">
            <div className="h-10" />
            {staff?.role && (
              <motion.div className="w-full flex justify-center items-center mb-3">
                <Button
                  type="primary"
                  onClick={() => setIsOpenNewRequest(true)}
                >
                  Tạo đơn
                </Button>
              </motion.div>
            )}

            <div
              onClick={() => handleChangeRequestType("inbox")}
              className="flex items-center gap-x-4 border-l cursor-pointer"
            >
              {selectedRequestType === "inbox" ? (
                <motion.div
                  layoutId="active-tab"
                  className={`w-0.5 h-10 bg-blue-600`}
                />
              ) : (
                <div className="w-0.5" />
              )}
              <div className="flex items-center gap-x-4 px-5 py-3">
                <BsMailbox
                  className={`text-slate-500 ${
                    selectedRequestType === "inbox" && "text-blue-600"
                  }`}
                  size={22}
                />
                <p
                  className={`text-sm font-medium text-slate-500 ${
                    selectedRequestType === "inbox" && "text-blue-600"
                  } `}
                >
                  Hộp thư đến
                </p>
              </div>
            </div>

            {/* <div
              onClick={() => handleChangeRequestType("bin")}
              className="flex items-center gap-x-4 border-l cursor-pointer"
            >
              {selectedRequestType === "bin" ? (
                <motion.div
                  layoutId="active-tab"
                  className={`w-0.5 h-10 bg-blue-600`}
                />
              ) : (
                <div className="w-0.5" />
              )}
              <div className="flex items-center gap-x-4 px-5 py-3">
                <BsTrash3
                  className={`text-slate-500 ${
                    selectedRequestType === "bin" && "text-blue-600"
                  }`}
                  size={22}
                />
                <p
                  className={`text-sm font-medium text-slate-500 ${
                    selectedRequestType === "bin" && "text-blue-600"
                  } `}
                >
                  Đã xóa
                </p>
              </div>
            </div> */}

            {!isLoadingAnnualLeave ? (
              !isErrorAnnualLeave ? (
                staff?.role && (
                  <div className="flex items-center gap-x-4 border-l cursor-pointer">
                    <div className="w-0.5" />
                    <div className="flex items-center gap-x-4 px-5 py-3">
                      <p className={`text-sm font-medium text-slate-500  `}>
                        Ngày phép còn lại : {annualLeave?.amount}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <AnErrorHasOccured />
              )
            ) : (
              <LoadingComponentIndicator />
            )}

            <div className="h-10" />

            <p className="text-base text-slate-400 px-5 mb-2">Loại đơn</p>

            <div className="relative">
              <div
                onClick={() => handleChangeType(null)}
                className="flex items-center gap-x-6 px-5 py-3 cursor-pointer"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <p className="text-sm font-medium text-slate-500">Tất cả</p>
              </div>
              {selectedType === null && (
                <motion.div
                  layoutId="active-request-type"
                  className="absolute border border-slate-300 left-10 right-10 top-0 bottom-0 rounded-xl"
                />
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => handleChangeType("A")}
                className="flex items-center gap-x-6 px-5 py-3 cursor-pointer"
              >
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <p className="text-sm font-medium text-slate-500">
                  Đơn xin nghỉ có lương
                </p>
              </div>
              {selectedType === "A" && (
                <motion.div
                  layoutId="active-request-type"
                  className="absolute border border-slate-300 left-10 right-10 top-0 bottom-0 rounded-xl"
                />
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => handleChangeType("L")}
                className="flex items-center gap-x-6 px-5 py-3 cursor-pointer"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <p className="text-sm font-medium text-slate-500">
                  Đơn xin nghỉ không lương
                </p>
              </div>
              {selectedType === "L" && (
                <motion.div
                  layoutId="active-request-type"
                  className="absolute border border-slate-300 left-10 right-10 top-0 bottom-0 rounded-xl"
                />
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => handleChangeType("M")}
                className="flex items-center gap-x-6 px-5 py-3 cursor-pointer"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <p className="text-sm font-medium text-slate-500">
                  Đơn xin đi công tác
                </p>
              </div>
              {selectedType === "M" && (
                <motion.div
                  layoutId="active-request-type"
                  className="absolute border border-slate-300 left-10 right-10 top-0 bottom-0 rounded-xl"
                />
              )}
            </div>
          </div>

          <div className="w-4/5 min-h-full bg-[#f5f4f7] overflow-hidden overflow-y-scroll scrollbar-hide">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center min-h-full"
                >
                  <MoonLoader color="#36d7b7" size={60} />
                </motion.div>
              ) : !isError ? (
                <motion.div
                  key="loading-request"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.1 }}
                >
                  <AnimatePresence mode="wait">
                    {!selectedRequest ? (
                      <RequestsList
                        key="request-list"
                        requests={requests}
                        setSelectedRequest={setSelectedRequest}
                        setIsOpenEditRequest={setIsOpenEditRequest}
                        setRequestSelected={setRequestSelected}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        isRefetching={isRefetching}
                      />
                    ) : (
                      <RequestDetail
                        key="request-detail"
                        selectedRequest={selectedRequest}
                        setSelectedRequest={setSelectedRequest}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <p className="flex items-center justify-center min-h-full text-lg">
                  Không thể tải yêu cầu
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
        {isOpenNewRequest && (
          <NewRequestModal
            isOpenNewRequest={isOpenNewRequest}
            setIsOpenNewRequest={setIsOpenNewRequest}
          />
        )}
        {isOpenEditRequest && (
          <EditRequestModal
            isOpenEditRequest={isOpenEditRequest}
            setIsOpenEditRequest={setIsOpenEditRequest}
            requestSelected={requestSelected}
          />
        )}
      </div>
    </Fragment>
  );
};

export default RequestPage;
