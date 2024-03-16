import React, { Fragment, memo, useEffect, useState } from "react";
import { Empty, Spin, Table, Tag, Tooltip, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerContacts,
  updateCustomerContacts,
} from "../../apis/contact";
import momenttz from "moment-timezone";
import ContactUpdateModal from "../../components/Modal/ContactUpdateModal";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { EyeOutlined, SwapRightOutlined } from "@ant-design/icons";
import ContactModal from "../../components/Modal/ContactModal";
import { motion } from "framer-motion";

const CustomerPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("DESC");
  const [sizePage, setSizePage] = useState(50);
  const [contactStatus, setContactStatus] = useState("ALL");
  const [selectedContact, setSelectedContact] = useState();

  const [isOpenRejectConfirm, setisOpenRejectConfirm] = useState(false);
  const [isOpenContactModal, setIsOpenContactModal] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: contacts,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["contact", currentPage, sort, contactStatus, sizePage],
    () =>
      getCustomerContacts({
        currentPage,
        sort,
        status: contactStatus,
        sizePage,
      }),
    {
      select: (data) => data?.data,
      refetchOnWindowFocus: false,
    }
  );

  const queryClient = useQueryClient();
  const {
    mutate: updateContactStatusMutate,
    isLoading: updateContactStatusIsLoading,
  } = useMutation(
    ({ contactId, status, rejectNote }) =>
      updateCustomerContacts({ contactId, status, rejectNote }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "contact",
          currentPage,
          sort,
          contactStatus,
          sizePage,
        ]);

        messageApi.open({
          type: "success",
          content:
            variables.status === "ACCEPTED"
              ? "Chấp nhận 1 sự kiện từ khách hàng thành công"
              : "Đã từ chối 1 sự kiện từ khách hàng",
        });

        if (variables.status === "ACCEPTED") setIsOpenContactModal(false);

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

  const handleUpdateContact = (contactId, status, rejectNote) => {
    updateContactStatusMutate({
      contactId,
      status,
      rejectNote: rejectNote ? rejectNote : undefined,
    });
  };

  const handleOpenContactModal = (value) => {
    setSelectedContact(value);
    setIsOpenContactModal(true);
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
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Loại sự kiện",
      dataIndex: "eventType",
      key: "eventType",
      render: (_, record) => (
        <span className="text-blue-400">{record?.eventType?.typeName}</span>
      ),
    },
    {
      title: "Địa điểm",
      dataIndex: "address",
      key: "address",
      render: (text) => <span className="text-blue-400">{text}</span>,
    },
    {
      title: "Thời gian",
      key: "timeRange",
      width: 220,
      render: (_, record) => (
        <p>
          {moment(record?.startDate).format("DD-MM-YYYY")} <SwapRightOutlined />{" "}
          {moment(record?.endDate).format("DD-MM-YYYY")}
        </p>
      ),
    },
    {
      title: "Ngân sách",
      dataIndex: "budget",
      key: "budget",
      render: (text) => <p>{`${text?.toLocaleString()} VND`}</p>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Tag
          className="ml-2"
          color={
            record.status === "ACCEPTED"
              ? "green"
              : record.status === "PENDING"
              ? "yellow"
              : record.status === "REJECTED"
              ? "red"
              : record.status === "SUCCESS"
              ? "blue"
              : ""
          }
          key={record.id}
        >
          {record.status === "ACCEPTED"
            ? "CHẤP NHẬN"
            : record.status === "PENDING"
            ? "ĐANG CHỜ"
            : record.status === "REJECTED"
            ? "TỪ CHỐI"
            : record.status === "SUCCESS"
            ? "THÀNH CÔNG"
            : "ĐÃ XOÁ"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
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
      {contextHolder}

      <ContactUpdateModal
        isModalOpen={isOpenRejectConfirm}
        setIsModalOpen={setisOpenRejectConfirm}
        handleUpdateContact={handleUpdateContact}
        selectedContactId={selectedContact?.id}
        updateIsLoading={updateContactStatusIsLoading}
      />

      <ContactModal
        contact={selectedContact}
        isOpenContactModal={isOpenContactModal}
        setIsOpenContactModal={setIsOpenContactModal}
        setisOpenRejectConfirm={setisOpenRejectConfirm}
        handleUpdateContact={handleUpdateContact}
        updateContactStatusIsLoading={updateContactStatusIsLoading}
      />

      <motion.div
        initial={{ x: 75 }}
        animate={{ x: 0 }}
        className="w-full h-full"
      >
        <div className="mt-20">
          {isLoading ? (
            <div className="w-full min-h-[calc(100vh/2)] flex items-center">
              <Spin spinning={isLoading} className="w-full" />
            </div>
          ) : (
            <>
              {isError ? (
                <Empty />
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
                    <Empty />
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

export default memo(CustomerPage);
