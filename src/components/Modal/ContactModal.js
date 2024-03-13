import {
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  SwapRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Modal, Popconfirm, Tag } from "antd";
import moment from "moment";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React from "react";

const ContactModal = ({
  isOpenContactModal,
  setIsOpenContactModal,
  contact,
}) => {
  console.log("🚀 ~ ContactModal ~ contact:", contact);
  const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);
  const onCloseModal = () => {
    console.log("Click");
    setIsOpenContactModal(false);
  };
  const confirmReject = (e) => {
    console.log(e);
  };
  const cancelReject = (e) => {
    console.log(e);
  };

  const confirmAccepted = (e) => {
    console.log(e);
  };
  const cancelAccepted = (e) => {
    console.log(e);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 0,
        },
      }}
    >
      <Modal
        open={isOpenContactModal}
        onCancel={onCloseModal}
        footer={false}
        closeIcon={false}
        width={"70%"}
        centered
      >
        <div className="w-full bg-white max-h-[60vh] overflow-hidden">
          <div className="w-full flex flex-row overflow-hidden min-h-fit">
            {/* leftSize */}
            <div className="w-[30%] flex flex-col justify-start items-center py-10 px-6 text-start bg-[#103f6e] rounded-lg">
              <h2 className="text-white font-semibold mb-8 text-2xl text-start w-full">
                Thông tin khách hàng
              </h2>
              <div className="w-full flex flex-col justify-start gap-y-4">
                <div className="w-full flex flex-row justify-start items-center font-semibold text-white mb-2 gap-x-3">
                  <UserOutlined className="w-auto" />
                  <p className="w-[95%] break-words ">{contact?.fullName}</p>
                </div>
                <div className="w-full flex flex-row justify-start items-center font-semibold text-white mb-2 gap-x-3">
                  <PhoneOutlined className="w-auto" />
                  <p className="w-[95%]  break-words">{contact?.phoneNumber}</p>
                </div>
                <div className="w-full flex flex-row justify-start items-center font-semibold text-white mb-2 gap-x-3">
                  <MailOutlined className="w-auto" />
                  <p className="w-[95%]  break-words">{contact?.email}</p>
                </div>
              </div>
            </div>
            {/* rightSize */}
            <div className="w-[70%] flex flex-col justify-start items-center py-10 px-10 text-start min-h-fit">
              <div className="w-full flex flex-row justify-between items-center mb-8 ">
                <h2 className="text-[#103f6e] font-semibold text-2xl ">
                  Thông tin sự kiện
                </h2>
                <Tag
                  color={
                    contact?.status === "PENDING"
                      ? "yellow"
                      : contact?.status === "ACCEPTED"
                      ? "#87d068"
                      : contact?.status === "REJECTED"
                      ? "#f50"
                      : contact?.status === "SUCCESS"
                      ? "#108ee9"
                      : ""
                  }
                >
                  {contact?.status === "PENDING"
                    ? "ĐANG CHỜ"
                    : contact?.status === "ACCEPTED"
                    ? "CHẤP THUẬN  "
                    : contact?.status === "REJECTED"
                    ? "ĐÃ TỪ CHỐI"
                    : contact?.status === "SUCCESS"
                    ? "THÀNH CÔNG"
                    : ""}
                </Tag>
              </div>

              <div className="w-full flex flex-col justify-start gap-y-4 ">
                {/* time & budget*/}
                <div className="w-full flex flex-row justify-between items-center gap-x-3">
                  <div className="w-1/2 flex flex-col justify-start items-start font-semibold text-[#103f6e] mb-2 gap-y-1 border-b border-gray-200 pb-2">
                    <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                      <span className="text-slate-400">Ngân Sách sự kiện</span>
                    </div>
                    <p className="w-full break-words ">{`${contact?.budget?.toLocaleString()} VND`}</p>
                  </div>

                  <div className="w-1/2 flex flex-col justify-start items-center font-semibold text-[#103f6e] mb-2 gap-y-1 border-b border-gray-200 pb-2">
                    <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                      <span className="text-slate-400">Thời gian diễn ra</span>
                    </div>
                    <p className="w-full  break-words flex flex-row justify-start items-center gap-x-3">
                      <span>
                        {moment(contact?.startDate).format("DD-MM-YYYY")}
                      </span>
                      <SwapRightOutlined />
                      <span>
                        {moment(contact?.endDate).format("DD-MM-YYYY")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-row justify-between items-center h-fit gap-x-3 ">
                  {/* address */}
                  <div className="w-[50%] flex flex-col justify-start items-center font-semibold text-[#103f6e]  gap-y-1  h-full  border-b border-gray-200 pb-2">
                    <div className=" flex flex-row justify-start items-start gap-x-2 text-start w-full">
                      <span className="text-slate-400">Địa điểm sự kiện</span>
                    </div>
                    <p className="w-full break-words">{contact?.address}</p>
                  </div>

                  {/* type */}
                  <div className="w-[50%] flex flex-col justify-start items-start font-semibold text-[#103f6e]  gap-y-1  h-full border-b border-gray-200 pb-2">
                    <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                      <span className="text-slate-400">Loại sự kiện</span>
                    </div>
                    <p className="w-full break-words ">
                      {contact?.eventType?.typeName}
                    </p>
                  </div>
                </div>

                {/* note */}
                <div className="w-full flex flex-col justify-start items-center font-semibold text-[#103f6e] mb-2 gap-y-1 max-h-[40%] overflow-hidden ">
                  <div className=" flex flex-row justify-start items-center gap-x-2 text-start w-full">
                    <span className="text-slate-400">Ghi chú sự kiện</span>
                  </div>
                  <div className="w-full h-full overflow-y-scroll scrollbar-hide">
                    <p
                      className="text-base w-full italic text-[#103f6e]  line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: new QuillDeltaToHtmlConverter(
                          JSON.parse(
                            contact?.note?.startsWith(`[{"`)
                              ? contact?.note
                              : parseJson(contact?.note)
                          )
                        ).convert(),
                      }}
                    ></p>
                  </div>
                </div>

                <div className="w-full flex flex-row justify-end items-center font-semibold text-[#103f6e] mb-2 gap-x-3">
                  <div className="w-full bg-gray-200 h-[1px]"></div>
                  <Popconfirm
                    title="Xác nhân từ chối liên hệ "
                    description="Bạn có chắc chắn từ chối liên hệ này?"
                    onConfirm={confirmReject}
                    onCancel={cancelReject}
                    okText="Đồng ý"
                    cancelText="Không"
                  >
                    <Button type="dashed" icon={<CloseOutlined />}>
                      Từ chối
                    </Button>
                  </Popconfirm>

                  <Popconfirm
                    title="Xác nhận chấp nhận liên hệ"
                    description="Bạn có chắc chắn chấp nhận liên hệ này?"
                    onConfirm={confirmAccepted}
                    onCancel={cancelAccepted}
                    okText="Đồng ý"
                    cancelText="Không"
                  >
                    <Button type="primary" icon={<CheckOutlined />}>
                      Xác nhận
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ContactModal;
