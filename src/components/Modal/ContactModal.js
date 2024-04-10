import {
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  SwapRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Modal, Popconfirm, Popover } from "antd";
import moment from "moment";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React, { memo } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const ContactModal = ({
  contact,
  isOpenContactModal,
  setIsOpenContactModal,
  setisOpenRejectConfirm,
  handleUpdateContact,
  updateContactStatusIsLoading,
  contracts,
}) => {
  const hasContract = contracts?.find(
    (item) => item?.customerContactId === contact?.id
  );
  const navigate = useNavigate();

  const confirmReject = () => {
    setIsOpenContactModal(false);

    setisOpenRejectConfirm(true);
  };

  const confirmAccepted = () => {
    handleUpdateContact(
      contact?.id,
      "ACCEPTED",
      undefined,
      contact?.eventType?.id
    );
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
        eventType: contact?.eventType?.id,
        hasContract,
      },
    });
  };

  const goToPlanningPageSent = () => {
    navigate("planning", {
      state: {
        contactId: contact?.id,
        eventType: contact?.eventType?.id,
        hasContract,
        readOnly: true,
      },
    });
  };

  return (
    <Modal
      open={isOpenContactModal}
      onCancel={() => setIsOpenContactModal(false)}
      footer={false}
      closeIcon={false}
      width={"75%"}
      centered
    >
      <div className="w-full flex flex-row bg-white max-h-[70vh] relative">
        <div
          className="absolute top-0 right-0 rotate-45 cursor-pointer"
          onClick={() => setIsOpenContactModal(false)}
        >
          <FaPlus className="text-2xl text-red-500" />
        </div>

        {/* leftSize */}
        <div className="w-[30%] flex flex-col justify-center items-start p-10 text-start bg-[#103f6e] rounded-lg">
          <h2 className="text-white font-semibold mb-12 text-[28px] text-start w-full">
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
                <p className="text-base font-medium text-orange-500 border-[2px] border-orange-400 rounded-lg px-2 py-1">
                  Chờ duyệt
                </p>
              ) : contact?.status === "REJECTED" ? (
                <p className="text-base font-medium text-red-500 border-[2px] border-red-500 rounded-lg px-2 py-1">
                  Đã từ chối
                </p>
              ) : contact?.status === "SUCCESS" ? (
                <p className="text-base font-medium text-blue-500 border-[2px] border-blue-500 rounded-lg px-2 py-1">
                  Đã tạo sự kiện
                </p>
              ) : (
                contact?.status === "ACCEPTED" &&
                (!hasContract ? (
                  <p className="text-base font-medium text-green-500 border-[2px] border-green-500 rounded-lg px-2 py-1">
                    Đã chấp nhận
                  </p>
                ) : hasContract?.files?.[0]?.status === "REJECTED" ? (
                  <p className="text-base font-medium text-red-500 border-[2px] border-red-500 rounded-lg px-2 py-1">
                    Hợp đồng bị từ chối
                  </p>
                ) : hasContract?.status === "PENDING" ? (
                  <p className="text-base font-medium text-orange-500 border-[2px] border-orange-400 rounded-lg px-2 py-1">
                    Chờ xác nhận hợp đồng
                  </p>
                ) : hasContract?.status === "SUCCESS" ? (
                  <p className="text-base font-medium text-green-500 border-[2px] border-green-500 rounded-lg px-2 py-1">
                    Đã xác nhận hợp đồng
                  </p>
                ) : (
                  <></>
                ))
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
              {contact?.note && (
                <p
                  className="text-start text-base w-full text-[#103f6e]"
                  dangerouslySetInnerHTML={{
                    __html: new QuillDeltaToHtmlConverter(
                      JSON.parse(
                        contact?.note?.startsWith(`[{`)
                          ? contact?.note
                          : parseJson(contact?.note)
                      )
                    ).convert(),
                  }}
                />
              )}
            </div>
          </div>

          {/* button */}
          <div className="w-full flex flex-row justify-end items-center font-semibold text-[#103f6e] mb-2 gap-x-3">
            <div className="w-full bg-gray-200 h-[1px]" />

            {hasContract &&
              !!hasContract?.files?.length &&
              hasContract?.files?.[0]?.status === "REJECTED" && (
                <div>
                  <Popover
                    content={hasContract?.files?.[0]?.rejectNote}
                    title="Lý do từ chối"
                  >
                    <IoInformationCircleOutline className="text-xl hover:scale-105 hover:text-red-500 transition-all" />
                  </Popover>
                </div>
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

            {contact?.status === "ACCEPTED" &&
              (!hasContract ||
              hasContract?.files?.[0]?.status === "REJECTED" ? (
                <>
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
                        >
                          Từ chối
                        </Button>
                      </ConfigProvider>
                    </div>
                  </Popconfirm>
                  <Button
                    onClick={goToPlanningPage}
                    type="primary"
                    size="large"
                    icon={<CheckOutlined />}
                  >
                    Lên kế hoạch
                  </Button>
                </>
              ) : hasContract?.status === "PAID" ? (
                <Button
                  onClick={goToCreateEventPage}
                  type="primary"
                  size="large"
                  icon={<CheckOutlined />}
                >
                  Tạo sự kiện
                </Button>
              ) : hasContract?.status === "WAIT_FOR_SIGN" ||
                hasContract?.status === "PENDING" ? (
                <Button
                  type="primary"
                  onClick={goToPlanningPageSent}
                  size="large"
                  icon={<CheckOutlined />}
                >
                  Xem chi tiết
                </Button>
              ) : (
                <></>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ContactModal);
