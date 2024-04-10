import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Button,
  Empty,
  Image,
  Segmented,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerContacts } from "../../apis/contact";
import ContactUpdateModal from "../../components/Modal/ContactUpdateModal";
import moment from "moment/moment";
import {
  BarsOutlined,
  BookOutlined,
  CarryOutOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { IoRemoveOutline } from "react-icons/io5";
import { BsImages } from "react-icons/bs";
import ContactModal from "../../components/Modal/ContactModal";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const ContactTab = ({
  currentPage,
  setCurrentPage,
  sort,
  setSort,
  contactStatus,
  setContactStatus,

  contacts,
  contactsIsLoading,
  contactsIsError,

  contracts,
  contractsIsLoading,
  contractsIsError,

  messageApi,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedContact, setSelectedContact] = useState();
  const [isOpenRejectConfirm, setisOpenRejectConfirm] = useState(false);
  const [isOpenContactModal, setIsOpenContactModal] = useState(false);

  useEffect(() => {
    if (contracts && contacts && location.state?.contractId) {
      const findContract = contracts?.find(
        (contract) => contract?.id === location.state?.contractId
      );

      const findContact = contacts?.find(
        (contact) => contact?.id === findContract?.customerContactId
      );

      handleOpenContactModal(findContact);
    }
  }, [location, contracts, contacts]);

  const queryClient = useQueryClient();
  const {
    mutate: updateContactStatusMutate,
    isLoading: updateContactStatusIsLoading,
  } = useMutation(
    ({ contactId, status, rejectNote, eventTypeId }) =>
      updateCustomerContacts({ contactId, status, rejectNote }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "contact",
          currentPage,
          sort,
          contactStatus,
          20,
        ]);

        messageApi.open({
          type: "success",
          content:
            variables.status === "ACCEPTED"
              ? "Chấp nhận 1 sự kiện từ khách hàng thành công"
              : "Đã từ chối 1 sự kiện từ khách hàng",
        });

        // if (variables.status === "ACCEPTED") setIsOpenContactModal(false);
        if (variables.status === "ACCEPTED")
          navigate("planning", {
            state: {
              contactId: variables?.contactId,
              eventType: variables?.eventTypeId,
            },
          });

        if (variables.status === "REJECTED") setisOpenRejectConfirm(false);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const handleUpdateContact = (contactId, status, rejectNote, eventTypeId) => {
    updateContactStatusMutate({
      contactId,
      status,
      rejectNote: rejectNote ? rejectNote : undefined,
      eventTypeId,
    });
  };

  const handleOpenContactModal = (value) => {
    setSelectedContact(value);
    setIsOpenContactModal(true);
  };

  const handleChangeStatus = (value) => {
    setContactStatus(value);
  };

  const handleSort = (value) => {
    setSort(value);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 50,
      align: "center",
    },
    {
      title: "Loại sự kiện",
      dataIndex: "eventType",
      key: "eventType",
      width: "15%",
      render: (_, record) => (
        <span className="text-blue-400">{record?.eventType?.typeName}</span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      width: "12%",
    },
    {
      title: "Địa điểm",
      dataIndex: "address",
      key: "address",
      width: "20%",
      render: (text) => <span className="text-blue-400">{text}</span>,
    },
    {
      title: "Thời gian",
      key: "timeRange",
      width: "18%",
      render: (_, record) => (
        <p>
          {moment(record?.startDate).format("DD-MM-YYYY")} <SwapRightOutlined />{" "}
          {moment(record?.endDate).format("DD-MM-YYYY")}
        </p>
      ),
    },
    {
      title: "Ngân sách (VNĐ)",
      dataIndex: "budget",
      key: "budget",
      width: "10%",
      sorter: (a, b) => a.budget - b.budget,
      render: (text) => (
        <p className="font-medium">{`${text?.toLocaleString()}`}</p>
      ),
      align: "center",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      align: "center",
      width: "10%",
      render: (_, record) => {
        switch (record?.status ?? "PENDING") {
          case "PENDING":
            return (
              <p className="text-xs font-medium text-orange-500 border border-orange-400 rounded-lg px-2 py-1">
                CHỜ DUYỆT
              </p>
            );
          case "REJECTED":
            return (
              <p className="text-xs font-medium text-red-500 border border-red-500 rounded-lg px-2 py-1">
                ĐÃ TỪ CHỐI
              </p>
            );
          case "SUCCESS":
            return (
              <p className="text-xs font-medium text-blue-500 border border-blue-500 rounded-lg px-2 py-1">
                ĐÃ TẠO SỰ KIỆN
              </p>
            );

          case "ACCEPTED":
            return (
              <p className="text-xs font-medium text-green-500 border border-green-500 rounded-lg px-2 py-1">
                ĐÃ CHẤP NHẬN
              </p>
            );

          default:
            <p className="text-xs font-medium text-orange-500 border border-orange-400 rounded-lg px-2 py-1">
              CHỜ DUYỆT
            </p>;
        }
      },
    },
    {
      title: "Trạng thái hợp đồng",
      dataIndex: "",
      key: "recognizer",
      width: "15%",
      align: "center",
      render: (_, record) => {
        const hasContract = contracts?.find(
          (item) => item?.customerContactId === record?.id
        );

        if (record?.status === "ACCEPTED") {
          if (hasContract) {
            if (hasContract?.files?.[0]?.status === "REJECTED")
              return (
                <p className="text-xs font-medium text-red-500 border border-red-500 rounded-lg px-2 py-1">
                  HỢP ĐỒNG BỊ TỪ CHỐI
                </p>
              );
            else if (hasContract?.status === "PENDING")
              return (
                <p className="text-xs font-medium text-orange-500 border border-orange-400 rounded-lg px-2 py-1">
                  CHỜ XÁC NHẬN HỢP ĐỒNG
                </p>
              );
            // else if (hasContract?.status === "SUCCESS")
            else if (hasContract?.status === "PAID")
              return (
                <p className="text-xs font-medium text-green-500 border border-green-500 rounded-lg px-2 py-1">
                  ĐÃ XÁC NHẬN HỢP ĐỒNG
                </p>
              );
            else
              return (
                <p className="text-xs font-medium text-orange-500 border border-orange-400 rounded-lg px-2 py-1">
                  CHỜ XÁC NHẬN HỢP ĐỒNG
                </p>
              );
          } else {
            return (
              <p className="text-xs font-medium text-blue-500 border border-blue-500 rounded-lg px-2 py-1">
                ĐANG LÊN KẾ HOẠCH
              </p>
            );
          }
        } else if (record?.status === "SUCCESS") {
          if (hasContract && !!hasContract?.files?.length) {
            return (
              <div className="flex justify-center cursor-pointer">
                <div className="relative">
                  <BsImages className="text-blue-500 text-2xl" />
                </div>
                <div className="absolute left-0 right-0 opacity-0">
                  <Image.PreviewGroup>
                    {hasContract?.files?.map((file, index) => (
                      <Image
                        key={file?.id}
                        width={index === 0 ? "1.5rem" : 0}
                        src={file?.contractFileUrl}
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </div>
            );
          } else {
            return (
              <div className="flex justify-center">
                <IoRemoveOutline className="text-2xl text-black/30" />
              </div>
            );
          }
        } else {
          return (
            <div className="flex justify-center">
              <IoRemoveOutline className="text-2xl text-black/30" />
            </div>
          );
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <EyeOutlined
            className="hover:scale-125 transition-transform text-blue-400 text-xl"
            onClick={() => handleOpenContactModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Fragment>
      <ContactModal
        contact={selectedContact}
        isOpenContactModal={isOpenContactModal}
        setIsOpenContactModal={setIsOpenContactModal}
        setisOpenRejectConfirm={setisOpenRejectConfirm}
        handleUpdateContact={handleUpdateContact}
        updateContactStatusIsLoading={updateContactStatusIsLoading}
        contracts={contracts}
      />

      <ContactUpdateModal
        isModalOpen={isOpenRejectConfirm}
        setIsModalOpen={setisOpenRejectConfirm}
        handleUpdateContact={handleUpdateContact}
        selectedContactId={selectedContact?.id}
        updateIsLoading={updateContactStatusIsLoading}
      />

      {/* header */}
      <div className="flex w-full py-2">
        <div className="w-full flex flex-col justify-center items-start  py-2">
          <h3 className="font-bold text-3xl text-blueBudget mb-2">
            Danh sách liên hệ
          </h3>
          <p className="text-blueSecondBudget font-mediu text-sm">
            Quản lí thông tin liên hệ khách hàng
          </p>
        </div>
      </div>

      {/* filterContact */}
      <div className="w-full  flex flex-row gap-x-4 items-center">
        <div className="w-[25%] bg-blue-500 rounded-lg px-2 py-5">
          <div className="w-full h-full flex flex-row justify-center items-center gap-x-2">
            <BookOutlined className="text-white text-xl" />

            <p className="flex items-center text-white space-x-3">
              <span className="font-medium text-lg">Tổng số liên hệ</span>
              <b className="font-bold text-xl">{contacts?.length ?? 0}</b>
            </p>
          </div>
        </div>
        <div className="w-[75%] flex justify-between items-center bg-white px-2 py-2 rounded-lg">
          <div>
            {sort !== "DESC" ? (
              <Button
                icon={<SortAscendingOutlined className="text-xl" />}
                onClick={() => handleSort("DESC")}
                // type="primary"
                className="text-lg w-fit h-fit py-4 px-6 font-semibold border-green-700 text-green-700"
              >
                Liên hệ mới nhất
              </Button>
            ) : (
              <Button
                // type="default"
                icon={<SortDescendingOutlined className="text-xl" />}
                onClick={() => handleSort("ASC")}
                className="text-lg w-fit h-fit py-4 px-6 font-semibold border-green-700 text-green-700"
              >
                Liên hệ sớm nhất
              </Button>
            )}
          </div>
          <Segmented
            size="large"
            value={contactStatus}
            options={[
              {
                label: "ĐANG CHỜ",
                value: "PENDING",
                icon: <ExclamationCircleOutlined className="text-yellow-500" />,
              },
              {
                label: "CHẤP NHẬN",
                value: "ACCEPTED",
                icon: <CheckSquareOutlined className="text-green-500" />,
              },
              {
                label: "TỪ CHỐI",
                value: "REJECTED",
                icon: <CloseSquareOutlined className="text-red-500" />,
              },
              {
                label: "THÀNH CÔNG",
                value: "SUCCESS",
                icon: <CarryOutOutlined className="text-blue-500" />,
              },
              {
                label: "TẤT CẢ",
                value: "ALL",
                icon: <BarsOutlined />,
              },
            ]}
            onChange={(value) => handleChangeStatus(value)}
            className="bg-slate-200 font-semibold py-2 p-2"
          />
        </div>
      </div>
      {/* tableContact */}
      <motion.div
        initial={{ x: 75 }}
        animate={{ x: 0 }}
        className="w-full h-full"
      >
        <div className="mt-4">
          {contactsIsLoading || contractsIsLoading ? (
            <div className="w-full min-h-[calc(100vh/2)] flex items-center">
              <Spin spinning className="w-full" />
            </div>
          ) : (
            <>
              {contactsIsError || contractsIsError ? (
                <Empty
                  description={
                    <p className="text-lg font-medium">
                      Đang xảy ra lỗi bạn vui lòng chờ trong giây lát
                    </p>
                  }
                />
              ) : (
                <>
                  {contacts?.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={contacts}
                      rowKey="id"
                      bordered={false}
                      pagination={{ pageSize: 10 }}
                    />
                  ) : (
                    <Empty
                      description={<span>không có dữ liệu</span>}
                      className="mt-3"
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </Fragment>
  );
};

export default memo(ContactTab);
