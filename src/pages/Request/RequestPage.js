import React, { Fragment, useEffect, useState } from "react";
import { BsMailbox, BsTrash3 } from "react-icons/bs";
import RequestsList from "../../components/RequestItem/RequestsList";
import RequestDetail from "../../components/RequestItem/RequestDetail";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllRequests } from "../../apis/requests";
import { useRouteLoaderData } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const RequestPage = () => {
  const staff = useRouteLoaderData("staff");

  const [selectedRequest, setSelectedRequest] = useState();
  const [selectedRequestType, setSelectedRequestType] = useState("inbox"); // inbox - bin
  const [selectedType, setSelectedType] = useState(null);

  const {
    data: requests,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["requests"],
    () =>
      getAllRequests({
        curentPage: 1,
        pageSize: 10,
        type: selectedType,
        requestor: staff ? staff.id : undefined,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );
  console.log("REQUEST: ", requests);

  useEffect(() => {
    refetch();
  }, [selectedType]);

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
            <div
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
            </div>

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
      </div>
    </Fragment>
  );
};

export default RequestPage;
