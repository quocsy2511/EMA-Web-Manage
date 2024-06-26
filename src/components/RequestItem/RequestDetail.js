import React from "react";
import { motion } from "framer-motion";
import { IoChevronBackSharp } from "react-icons/io5";
import { BsArrow90DegLeft } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Avatar, Button, Form, Input, Radio, Tag, message } from "antd";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { useRouteLoaderData } from "react-router-dom";
import { LuSend } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveRequest, getRequestDetail } from "../../apis/requests";
import { getMember } from "../../apis/users";

const { TextArea } = Input;

const RequestDetail = ({
  selectedRequest,
  setSelectedRequest,
  resetRequestRedirect,
}) => {
  const manager = useRouteLoaderData("manager");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: requestFromNoti } = useQuery(
    ["request", selectedRequest?.requestFromNotification],
    () => getRequestDetail(selectedRequest?.requestFromNotification),
    {
      select: (data) => {
        return data?.[0];
      },
      enabled: !!selectedRequest?.requestFromNotification,
    }
  );

  const { data: approver } = useQuery(
    ["approver"],
    () =>
      getMember({
        userId: selectedRequest?.approver,
      }),
    {
      select: (data) => {
        return data;
      },
      enabled: !!selectedRequest?.approver,
    }
  );

  const queryClient = useQueryClient();
  const { mutate } = useMutation((request) => approveRequest(request), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["requests"]);
      handleBackSelectedRequest();
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

  const onFinish = (value) => {
    value = { ...value, requestID: selectedRequest.id };
    mutate(value);
  };

  const handleBackSelectedRequest = () => {
    resetRequestRedirect();
    setSelectedRequest();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween" }}
      className="w-full min-h-max overflow-hidden"
    >
      {contextHolder}
      <div className="w-full h-14 bg-white border-b px-5 flex items-center gap-x-5">
        <IoChevronBackSharp
          onClick={handleBackSelectedRequest}
          size={18}
          className="text-slate-500 cursor-pointer"
        />
        <p className="text-sm text-slate-500">
          {requestFromNoti ? requestFromNoti?.title : selectedRequest?.title}
        </p>
        <div className="flex-1 flex justify-end items-center gap-x-2">
          {(requestFromNoti?.type === "L" || selectedRequest?.type === "L") &&
          (requestFromNoti?.isFull || selectedRequest?.isFull) ? (
            <Tag color="cyan" className="w-20 text-center">
              Cả ngày
            </Tag>
          ) : requestFromNoti?.isPM || selectedRequest?.isPM ? (
            <Tag color="geekblue" className="w-20 text-center">
              Buổi chiều
            </Tag>
          ) : (
            <Tag color="orange" className="w-20 text-center">
              Buổi sáng
            </Tag>
          )}
          <div
            className={`w-2 h-2 rounded-full ${
              requestFromNoti?.type === "A" || selectedRequest?.type === "A"
                ? "bg-green-600"
                : requestFromNoti?.type === "L" || selectedRequest?.type === "L"
                ? "bg-red-500"
                : (requestFromNoti?.type === "M" ||
                    selectedRequest?.type === "M") &&
                  "bg-purple-400"
            }`}
          />
          <p className="text-xs">
            {requestFromNoti?.type === "A" || selectedRequest?.type === "A"
              ? "Nghỉ có lương"
              : requestFromNoti?.type === "L" || selectedRequest?.type === "L"
              ? "Nghỉ không lương"
              : (requestFromNoti?.type === "M" ||
                  selectedRequest?.type === "M") &&
                "Đi công tác"}
          </p>
        </div>
      </div>
      <div className="p-5 space-y-10">
        <div className="w-full bg-white rounded-lg p-5">
          <div className="flex items-center gap-x-5">
            {requestFromNoti ? (
              <Avatar size={38} src={requestFromNoti?.user?.profile.avatar} />
            ) : (
              <Avatar size={38} src={selectedRequest?.user?.profile.avatar} />
            )}
            <div>
              <p className="text-sm text-slate-700 font-medium">
                {selectedRequest?.user?.profile.fullName}
              </p>
              <p className="text-xs text-slate-400">
                {selectedRequest?.user?.profile.role === "STAFF"
                  ? "Trưởng phòng"
                  : "Nhân viên"}
              </p>
            </div>
            <p className="flex-1 text-end text-xs text-slate-400">
              {moment(
                requestFromNoti
                  ? requestFromNoti?.createdAt
                  : selectedRequest?.createdAt
              ).format("DD [tháng] MM, YYYY HH:mm")}
            </p>
          </div>
          <p className="pt-5">
            {requestFromNoti
              ? requestFromNoti?.content
              : selectedRequest?.content}
          </p>
        </div>

        {(requestFromNoti?.approver || selectedRequest?.approver) && (
          <div className="flex items-center ml-5 gap-x-5">
            <BsArrow90DegLeft size={35} className="rotate-180 text-slate-300" />
            <div className="flex-1 bg-white rounded-lg p-5">
              <div className="flex items-center gap-x-5">
                <Avatar
                  size={38}
                  src={manager ? manager.avatar : approver?.avatar}
                />
                <div>
                  <p className="text-sm text-slate-700 font-medium">
                    {manager ? manager.fullName : approver?.fullName}
                  </p>
                  <p className="text-xs text-slate-400">Quản lý</p>
                </div>
                <p className="flex-1 text-end text-xs text-slate-400">
                  {moment(
                    requestFromNoti
                      ? requestFromNoti?.updatedAt
                      : selectedRequest?.updatedAt
                  ).format("DD [tháng] MM, YYYY HH:mm")}
                </p>
              </div>
              {(requestFromNoti?.replyMessage ||
                selectedRequest?.replyMessage) &&
              (requestFromNoti?.replyMessage !== "" ||
                selectedRequest?.replyMessage !== "") ? (
                selectedRequest?.replyMessage
              ) : requestFromNoti?.status === "ACCEPT" ||
                selectedRequest?.status === "ACCEPT" ? (
                <div className="flex items-center gap-x-2 pt-5">
                  <p className="">Đơn được chấp thuận</p>
                  <AiOutlineCheck size={20} className="text-green-600" />
                </div>
              ) : (
                <div className="flex items-center gap-x-2 pt-5">
                  <p className="">Đơn bị từ chối</p>
                  <AiOutlineClose size={20} className="text-red-500" />
                </div>
              )}
            </div>
          </div>
        )}

        {manager && (
          <div className="h-96">
            <div className="relative bg-white rounded-lg p-5">
              <p className="text-sm text-slate-500 font-semibold mt-1 mb-3">
                Trả lời {selectedRequest?.user?.profile.fullName}
              </p>
              <Form
                form={form}
                onFinish={onFinish}
                initialValues={{
                  replyMessage: "",
                  status: !selectedRequest.approver && "REJECT",
                }}
              >
                <Form.Item name="replyMessage">
                  <TextArea rows={4} placeholder="Trả lời ..." />
                </Form.Item>

                <div className="flex items-center mb-3">
                  <Form.Item name="status" className="mb-0">
                    <Radio.Group
                      options={[
                        {
                          label: "Chấp nhận",
                          value: "ACCEPT",
                        },
                        {
                          label: "Từ chối",
                          value: "REJECT",
                        },
                      ]}
                      optionType="button"
                    />
                  </Form.Item>

                  <Button
                    className="flex items-center gap-x-3 ml-auto"
                    type={!!selectedRequest.approver ? "default" : "primary"}
                    onClick={() => form.submit()}
                    disabled={!!selectedRequest.approver}
                  >
                    Gửi
                    <LuSend />
                  </Button>
                </div>
              </Form>
              {selectedRequest.approver && (
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-black opacity-5 rounded-lg" />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RequestDetail;
