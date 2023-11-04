import React, { Fragment, useState } from "react";
import { BsMailbox, BsTrash3 } from "react-icons/bs";
import RequestsList from "../../components/RequestItem/RequestsList";
import RequestDetail from "../../components/RequestItem/RequestDetail";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "antd";
import NewRequestModal from "./Modal/NewRequestModal";
import { useQuery } from "@tanstack/react-query";
import { getAllRequests } from "../../apis/requests";
import { useRouteLoaderData } from "react-router-dom";

const RequestPage = () => {
  // const [requests, setRequests] = useState([
  //   {
  //     id: "60a89717-5ae0-4a1a-97f9-2342490a67d9",
  //     createdAt: "2023-11-02T13:57:41.873Z",
  //     updatedAt: "2023-11-02T13:57:41.873Z",
  //     title: "12",
  //     content: "12",
  //     startDate: "2023-11-02T13:28:44.000Z",
  //     endDate: "2023-11-02T13:28:44.000Z",
  //     isFull: true,
  //     isPM: false,
  //     approver: null,
  //     status: "PENDING",
  //     replyMessage: null,
  //     requestor: "b7c81983-48be-4047-b92e-fdc52de198a0",
  //     type: "A",
  //     user: {
  //       id: "b7c81983-48be-4047-b92e-fdc52de198a0",
  //       profile: {
  //         profileId: "b7c81983-48be-4047-b92e-fdc52de198a0",
  //         role: "STAFF",
  //         fullName: "Nguyễn Quốc Sỹ",
  //         phoneNumber: "0983709791",
  //         avatar:
  //           "https://storage.googleapis.com/hrea-8d10b.appspot.com/avatar/d26521f3-9019-45fd-9cd0-646cf2a324da?GoogleAccessId=firebase-adminsdk-sen9c%40hrea-8d10b.iam.gserviceaccount.com&Expires=1893456000&Signature=idv%2BCYmvGLyK2cRQ8aEU8Qn4NEHQRNBUlTqugZdGDzfgyuHxgLmnrftcnfaXO4YAoJ69vOBtFJ73caBXySaHIhx94uZWW2AoVaKk8tmlQJx7DYYrZ0xM%2Bpp2amHirAbIrTPTMxZIM3N27KgmI%2BxQSPZA1OVeG%2BYQwUAR4Jw6uk6T1eFV1tJBQZ5REhoYv2EHB1rYyje5RGDfTPOJplKe5CoEo9n9yfrVQTsJMNZgcLvAGOknBGR0htWBR7ya%2BY47fZmHTptcX3wHUskuvnGiYIuKWrCz0s2X5DIzVwHCRYgFs545jevoBh%2FtauoX2q484fHzIU64fnDW6ia24uP%2BsQ%3D%3D",
  //       },
  //     },
  //   },
  //   {
  //     id: "a3fa377a-150a-4580-a0cf-35b3931c914p",
  //     createdAt: "2023-11-02T06:10:02.272Z",
  //     updatedAt: "2023-11-02T06:10:02.272Z",
  //     title: "tesst ",
  //     content: "tesst 1",
  //     startDate: "2023-11-01T19:03:24.000Z",
  //     endDate: "2023-11-01T19:03:24.000Z",
  //     isFull: true,
  //     isPM: false,
  //     approver: null,
  //     status: "PENDING",
  //     replyMessage: null,
  //     requestor: "b7c81983-48be-4047-b92e-fdc52de198a0",
  //     type: "A",
  //     user: {
  //       id: "b7c81983-48be-4047-b92e-fdc52de198a0",
  //       profile: {
  //         profileId: "b7c81983-48be-4047-b92e-fdc52de198a0",
  //         role: "STAFF",
  //         fullName: "Nguyễn Quốc Sỹ",
  //         phoneNumber: "0983709791",
  //         avatar:
  //           "https://storage.googleapis.com/hrea-8d10b.appspot.com/avatar/d26521f3-9019-45fd-9cd0-646cf2a324da?GoogleAccessId=firebase-adminsdk-sen9c%40hrea-8d10b.iam.gserviceaccount.com&Expires=1893456000&Signature=idv%2BCYmvGLyK2cRQ8aEU8Qn4NEHQRNBUlTqugZdGDzfgyuHxgLmnrftcnfaXO4YAoJ69vOBtFJ73caBXySaHIhx94uZWW2AoVaKk8tmlQJx7DYYrZ0xM%2Bpp2amHirAbIrTPTMxZIM3N27KgmI%2BxQSPZA1OVeG%2BYQwUAR4Jw6uk6T1eFV1tJBQZ5REhoYv2EHB1rYyje5RGDfTPOJplKe5CoEo9n9yfrVQTsJMNZgcLvAGOknBGR0htWBR7ya%2BY47fZmHTptcX3wHUskuvnGiYIuKWrCz0s2X5DIzVwHCRYgFs545jevoBh%2FtauoX2q484fHzIU64fnDW6ia24uP%2BsQ%3D%3D",
  //       },
  //     },
  //   },
  // ]);
  const [selectedRequest, setSelectedRequest] = useState();
  const [selectedRequestType, setSelectedRequestType] = useState("inbox"); // inbox - bin
  const [isOpenNewRequest, setIsOpenNewRequest] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const staff = useRouteLoaderData("staff");

  const {
    data: requests,
    isLoading,
    isError,
    refetch,
  } = useQuery(["requests"], () =>
    getAllRequests({ curentPage: 1, pageSize: 10 })
  );
  console.log("REQUEST: ", requests);

  const handleChangeRequestType = (type) => {
    setSelectedRequestType(type);
    // if (type === "bin") setRequests([1, 2, 3]);
    // else setRequests([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  const handleChangeType = (type) => {
    setSelectedType(type);
  };

  return (
    <Fragment>
      <div className="w-full h-[calc(100vh-64px)] bg-[#F0F6FF] py-12 px-20 ">
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
                onClick={() => handleChangeType("All")}
                className="flex items-center gap-x-6 px-5 py-3 cursor-pointer"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <p className="text-sm font-medium text-slate-500">Tất cả</p>
              </div>
              {selectedType === "All" && (
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

          <div className="w-4/5 overflow-hidden overflow-y-scroll scrollbar-hide">
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
