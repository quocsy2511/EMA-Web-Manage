import {
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  SwapRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Modal, Popconfirm } from "antd";
import moment from "moment";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React, { memo } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const ContactModal = ({
  contact,
  isOpenContactModal,
  setIsOpenContactModal,
  setisOpenRejectConfirm,
  handleUpdateContact,
  updateContactStatusIsLoading,
}) => {
  console.log("🚀 ~ ContactModal ~ contact:", contact);
  const navigate = useNavigate();

  const confirmReject = () => {
    setIsOpenContactModal(false);

    setisOpenRejectConfirm(true);
  };

  const confirmAccepted = () => {
    handleUpdateContact(contact?.id, "ACCEPTED");
  };

  const goToCreateEventPage = () => {
    navigate("addition", {
      state: {
        contactId: contact?.id,
        eventType: contact?.eventType?.id,
      },
    });
  };

  const goToPlanningPage = () => {
    navigate("planning", {
      state: {
        contactId: contact?.id,
      },
    });
  };

  return (
    <Modal
      open={isOpenContactModal}
      onCancel={() => setIsOpenContactModal(false)}
      footer={false}
      closeIcon={false}
      width={"70%"}
      centered
    >
      <div className="w-full flex flex-row bg-white max-h-[60vh] relative">
        <div
          className="absolute top-0 right-0 rotate-45 cursor-pointer"
          onClick={() => setIsOpenContactModal(false)}
        >
          <FaPlus className="text-2xl text-red-500" />
        </div>

        {/* leftSize */}
        <div className="w-[30%] flex flex-col justify-center items-center p-10 text-start bg-[#103f6e] rounded-lg">
          <h2 className="text-white font-semibold mb-12 text-3xl text-start w-full">
            Thông tin khách hàng
          </h2>
          <div className="w-full flex flex-col justify-start gap-y-2">
            <div className="w-full flex flex-row justify-start items-center font-semibold text-white mb-2 gap-x-3">
              <UserOutlined className="w-auto text-2xl text-white/50" />
              <p className="w-[95%] text-base break-words font-medium">
                {contact?.fullName}
              </p>
            </div>
            <div className="w-full flex flex-row justify-start items-center font-semibold text-white mb-2 gap-x-3">
              <PhoneOutlined className="w-auto text-2xl text-white/50" />
              <p className="w-[95%] text-base break-words font-medium">
                {contact?.phoneNumber}
              </p>
            </div>
            <div className="w-full flex flex-row justify-start items-center font-semibold text-white mb-2 gap-x-3">
              <MailOutlined className="w-auto text-2xl text-white/50" />
              <p className="w-[95%] text-base break-words font-medium">
                {contact?.email}
              </p>
            </div>
          </div>
        </div>
        {/* rightSize */}
        <div className="flex-1 flex flex-col justify-between space-y-5 items-center p-10 text-start">
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-[#103f6e] font-semibold text-3xl ">
              Thông tin sự kiện
            </p>

            <>
              {contact?.status === "PENDING" ? (
                // <MdOutlinePending className={clsx("text-2xl text-orange-300")} />
                <p className="text-base text-yellow-500 border border-yellow-400 rounded-lg px-2 py-1">
                  Chờ duyệt
                </p>
              ) : contact?.status === "ACCEPTED" ? (
                // <MdCheckCircleOutline className={clsx("text-2xl text-green-400")} />
                <p className="text-base text-green-500 border border-green-500 rounded-lg px-2 py-1">
                  Đã chấp nhận
                </p>
              ) : contact?.status === "SUCCESS" ? (
                // <MdCheckCircleOutline className={clsx("text-2xl text-green-400")} />
                <p className="text-base text-blue-500 border border-blue-500 rounded-lg px-2 py-1">
                  Đã tạo sự kiện
                </p>
              ) : (
                <p className="text-base text-red-500 border border-red-500 rounded-lg px-2 py-1">
                  Đã từ chối
                </p>
              )}
            </>
          </div>

          {/* Info */}
          <div className="flex-1 h-full w-full flex flex-col justify-start gap-y-4 max-h-[80%]">
            {/* time & budget*/}
            <div className="w-full flex flex-row justify-between items-center">
              <div className="w-[45%] flex flex-col justify-start items-start font-semibold text-[#103f6e] mb-2 gap-y-1 border-b border-gray-200 pb-2">
                <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                  <span className="text-sm text-slate-400 font-normal">
                    Ngân Sách sự kiện
                  </span>
                </div>
                <p className="w-full break-words text-xl">{`${contact?.budget?.toLocaleString()} VNĐ`}</p>
              </div>

              <div className="w-[45%] flex flex-col justify-start items-center font-semibold text-[#103f6e] mb-2 gap-y-1 border-b border-gray-200 pb-2">
                <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                  <span className="text-sm text-slate-400 font-normal">
                    Thời gian diễn ra
                  </span>
                </div>
                <p className="w-full break-words flex flex-row justify-start items-center gap-x-3">
                  <span className="text-xl">
                    {moment(contact?.startDate).format("DD-MM-YYYY")}
                  </span>
                  <SwapRightOutlined className="text-xl" />
                  <span className="text-xl">
                    {moment(contact?.endDate).format("DD-MM-YYYY")}
                  </span>
                </p>
              </div>
            </div>

            {/* address & type */}
            <div className="w-full flex flex-row justify-between items-center h-fit">
              <div className="w-[45%] flex flex-col justify-start items-center font-semibold text-[#103f6e]  gap-y-1  h-full  border-b border-gray-200 pb-2">
                <div className=" flex flex-row justify-start items-start gap-x-2 text-start w-full">
                  <span className="text-sm text-slate-400 font-normal">
                    Địa điểm sự kiện
                  </span>
                </div>
                <p className="w-full break-words text-xl">{contact?.address}</p>
              </div>

              <div className="w-[45%] flex flex-col justify-start items-start font-semibold text-[#103f6e]  gap-y-1  h-full border-b border-gray-200 pb-2">
                <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                  <span className="text-sm text-slate-400 font-normal">
                    Loại sự kiện
                  </span>
                </div>
                <p className="w-full break-words text-xl">
                  {contact?.eventType?.typeName}
                </p>
              </div>
            </div>

            {/* note */}
            <span className="text-start w-full text-sm text-slate-400 font-normal">
              Ghi chú sự kiện
            </span>
            <div className="flex-1 w-full flex flex-col justify-start items-center font-semibold text-[#103f6e] mb-2 gap-y-1 overflow-y-scroll">
              <p
                className="text-start text-base w-full text-[#103f6e]"
                dangerouslySetInnerHTML={{
                  __html: new QuillDeltaToHtmlConverter(
                    JSON.parse(
                      contact?.note?.startsWith(`[{"`)
                        ? contact?.note
                        : parseJson(contact?.note)
                    )
                  ).convert(),
                }}
              />
            </div>
          </div>

          {/* button */}
          <div className="w-full flex flex-row justify-end items-center font-semibold text-[#103f6e] mb-2 gap-x-3">
            <div className="w-full bg-gray-200 h-[1px]" />
            {contact?.status === "ACCEPTED" && (
              <Popconfirm
                title="Xác nhân từ chối liên hệ "
                description="Bạn có chắc chắn từ chối liên hệ này?"
                onConfirm={confirmReject}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <div>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimaryHover: "#ff4d4f",
                      },
                    }}
                  >
                    <Button
                      size="large"
                      type="dashed"
                      icon={<CloseOutlined />}
                      // loading={updateContactStatusIsLoading}
                    >
                      Từ chối
                    </Button>
                  </ConfigProvider>
                </div>
              </Popconfirm>
            )}

            {contact?.status === "PENDING" && (
              <Popconfirm
                title="Xác nhận chấp nhận liên hệ"
                description="Bạn có chắc chắn chấp nhận liên hệ này?"
                onConfirm={confirmAccepted}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckOutlined />}
                  loading={updateContactStatusIsLoading}
                >
                  Xác nhận
                </Button>
              </Popconfirm>
            )}

            {contact?.status === "ACCEPTED" && (
              <Button onClick={goToPlanningPage} type="primary" size="large" icon={<CheckOutlined />}>
                Lên kế hoạch
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ContactModal);
