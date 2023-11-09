import React from "react";
import { Avatar, Input, Popconfirm, Tag, message } from "antd";
import {
  AiOutlineSearch,
  AiOutlineCheckSquare,
  AiOutlineCloseSquare,
} from "react-icons/ai";
import { LuMailOpen, LuMail, LuMailCheck, LuMailX } from "react-icons/lu";
import { TbMailStar, TbMailX } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment/moment";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveRequest } from "../../apis/requests";

const RequestsList = ({
  requests,
  setSelectedRequest,
  currentPage,
  setCurrentPage,
  searchText,
  setSearchText,
  isRefetching,
}) => {
  console.log("isRefetching: ", isRefetching);
  const staff = useRouteLoaderData("staff");

  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();
  const { mutate } = useMutation((request) => approveRequest(request), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["requests"]);
      messageApi.open({
        type: "success",
        content: "Duyệt đơn thành công.",
      });
    },
    onError: (data) => {
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const handleApproveRequest = (id, status) => {
    mutate({
      requestID: id,
      replyMessage: "",
      status: status,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden flex flex-col bg-white"
    >
      {contextHolder}
      <div className="w-full h-14 border-b px-2 flex items-center">
        {!staff ? (
          <Input
            placeholder="Tìm kiếm theo tên"
            prefix={
              <AiOutlineSearch size={18} className="text-slate-500 mr-2" />
            }
            bordered={false}
            allowClear
            value={searchText}
            onPressEnter={(value) => {
              if (value) setSearchText(value.nativeEvent.target.value);
              else setSearchText();
            }}
            onChange={(value) => {
              if (value) setSearchText(value.nativeEvent.target.value);
              else setSearchText();
            }}
          />
        ) : (
          <p>Thư của bạn</p>
        )}
      </div>
      <AnimatePresence mode="wait">
        {isRefetching ? (
          <motion.div className="flex-1 h-40 text-center">loadingg</motion.div>
        ) : (
          <motion.div className="flex-1">
            {requests.data.map((request) => (
              <motion.div
                key={request.id}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="py-3 px-5 border-b cursor-pointer group"
                onClick={() => setSelectedRequest(request)}
              >
                <motion.div
                  whileHover={{ x: 2, y: -2 }}
                  className="flex items-center justify-center gap-x-4 w-[99%]"
                >
                  <Avatar size={30} src={request.user?.profile?.avatar} />
                  <p className="text-sm font-medium">
                    {request.user?.profile?.fullName}
                  </p>

                  <p className="text-sm text-slate-500 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {request.title}
                  </p>

                  <div className="flex items-center justify-end gap-x-2 text-xs text-slate-500 flex-1">
                    <div className="group-hover:hidden">
                      {request.type === "L" && request.isFull ? (
                        <Tag color="cyan" className="w-20 text-center">
                          Cả ngày
                        </Tag>
                      ) : request.isPM ? (
                        <Tag color="geekblue" className="w-20 text-center">
                          Buổi chiều
                        </Tag>
                      ) : (
                        <Tag color="orange" className="w-20 text-center">
                          Buổi sáng
                        </Tag>
                      )}
                    </div>

                    <div
                      className={`w-2 h-2 ${
                        request.type === "A"
                          ? "bg-green-600"
                          : request.type === "L"
                          ? "bg-red-500"
                          : request.type === "M" && "bg-purple-400"
                      } rounded-full block group-hover:hidden`}
                    />
                    <p className="group-hover:hidden">
                      {moment(request.createdAt).format("DD [tháng] MM, YYYY")}
                    </p>
                    <p className="group-hover:hidden mr-3">
                      {moment(request.createdAt).format("HH:mm")}
                    </p>

                    {request.approver && request.status === "ACCEPT" ? (
                      <LuMailCheck
                        size={20}
                        className="group-hover:hidden text-blue-500"
                      />
                    ) : request.approver && request.status === "REJECT" ? (
                      <LuMailX
                        size={20}
                        className="group-hover:hidden text-red-500"
                      />
                    ) : (
                      <div className="w-5" />
                    )}

                    {!staff ? (
                      <>
                        {!request.approver && (
                          <>
                            <AiOutlineCheckSquare
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveRequest(request.id, "ACCEPT");
                              }}
                              className="hidden group-hover:block mr-2 text-blue-500"
                              size={20}
                            />
                            <AiOutlineCloseSquare
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveRequest(request.id, "REJECT");
                              }}
                              className="hidden group-hover:block mr-2 text-red-500"
                              size={20}
                            />
                            <LuMail
                              className="hidden group-hover:block"
                              size={18}
                            />
                          </>
                        )}
                        {request.approver && (
                          <LuMailOpen
                            className="hidden group-hover:block"
                            size={18}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <TbMailX
                          onClick={(e) => {
                            e.stopPropagation();

                            // Delete nè
                          }}
                          className="hidden group-hover:block mr-2 text-red-500"
                          size={20}
                        />
                        <TbMailStar
                          onClick={(e) => {
                            e.stopPropagation();

                            // Update nè
                          }}
                          className="hidden group-hover:block mr-2 text-blue-500"
                          size={20}
                        />
                        <LuMail
                          className="hidden group-hover:block"
                          size={18}
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-[#f5f4f7] flex items-center justify-end gap-x-3 pt-4 pr-3 pb-6">
        <IoIosArrowBack
          size={20}
          className={`${!requests.prevPage && "text-slate-300"} cursor-pointer`}
          onClick={() => {
            requests.prevPage && setCurrentPage(requests.prevPage);
          }}
        />
        <p className="text-base font-medium">{requests.currentPage}</p>
        <IoIosArrowBack
          size={20}
          className={`rotate-180 ${
            !requests.nextPage && "text-slate-300"
          } cursor-pointer`}
          onClick={() => {
            requests.nextPage && setCurrentPage(requests.nextPage);
          }}
        />
      </div>
    </motion.div>
  );
};

export default RequestsList;
