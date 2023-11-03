import React, { Fragment, useState } from "react";
import { BsMailbox, BsTrash3 } from "react-icons/bs";
import RequestsList from "../../components/RequestItem/RequestsList";
import RequestDetail from "../../components/RequestItem/RequestDetail";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "antd";
import NewRequestModal from "./Modal/NewRequestModal";

const RequestPage = () => {
  const [requests, setRequests] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  const [selectedRequest, setSelectedRequest] = useState();
  const [selectedRequestType, setSelectedRequestType] = useState("inbox"); // inbox - bin
  const [isOpenNewRequest, setIsOpenNewRequest] = useState(false);

  const handleChangeRequestType = (type) => {
    setSelectedRequestType(type);
    if (type === "bin") setRequests([1, 2, 3]);
    else setRequests([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  return (
    <Fragment>
      <div className="w-full h-[calc(100vh-64px)] bg-[#F0F6FF] py-12 px-20 ">
        <div className="w-full h-full bg-white rounded-lg shadow-xl flex">
          <div className="w-1/5 border-r">
            <div className="h-10" />

            <motion.div className="w-full flex justify-center items-center mb-3">
              <Button type="primary" onClick={() => setIsOpenNewRequest(true)}>
                Tạo đơn
              </Button>
            </motion.div>
            <motion.div
              layoutId="active-tab"
              onClick={() => handleChangeRequestType("inbox")}
              className={`flex items-center gap-x-4 border-l ${
                selectedRequestType === "inbox" && "border-blue-600"
              } px-5 py-3 cursor-pointer`}
            >
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
            </motion.div>
            <motion.div
              layoutId="active-tab"
              onClick={() => handleChangeRequestType("bin")}
              className={`flex items-center gap-x-4 border-l ${
                selectedRequestType === "bin" && "border-blue-600 text-blue-600"
              } px-5 py-3 cursor-pointer`}
            >
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
            </motion.div>

            <div className="h-10" />

            <p className="text-base text-slate-400 px-5">Loại đơn</p>

            <div className="flex items-center gap-x-4 px-5 py-3 cursor-pointer">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <p className="text-sm font-medium text-slate-500">Đơn xin nghỉ</p>
            </div>

            <div className="flex items-center gap-x-4 px-5 py-3 cursor-pointer">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <p className="text-sm font-medium text-slate-500">
                Đơn xin làm ngoài
              </p>
            </div>
          </div>

          <div className="w-4/5 overflow-hidden">
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
          </div>
        </div>
        {isOpenNewRequest && (
          <NewRequestModal
            isOpenNewRequest={isOpenNewRequest}
            setIsOpenNewRequest={setIsOpenNewRequest}
          />
        )}
      </div>
    </Fragment>
  );
};

export default RequestPage;
