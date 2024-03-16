import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Button,
  Empty,
  FloatButton,
  Popconfirm,
  Popover,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerContacts,
  updateCustomerContacts,
} from "../../apis/contact";
import momenttz from "moment-timezone";
import ContactUpdateModal from "../../components/Modal/ContactUpdateModal";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import {
  DeleteOutlined,
  EyeOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapRightOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
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
  const [isSortASC, setIsSortASC] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: contacts,
    isLoading,
    isError,
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

  const handleChangeStatus = (value) => {
    console.log("🚀 ~ handleChangeStatus ~ value:", value);
    setContactStatus(value);
  };

  const handleSort = (value) => {
    console.log("🚀 ~ handleSort ~ value:", value);
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
      width: "20%",
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
      title: "Ngân sách",
      dataIndex: "budget",
      key: "budget",
      width: "15%",
      sorter: (a, b) => a.budget - b.budget,
      render: (text) => <p>{`${text?.toLocaleString()} VND`}</p>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      align: "center",
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
              : "red"
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
      {contextHolder}

      <ContactModal
        contact={selectedContact}
        isOpenContactModal={isOpenContactModal}
        setIsOpenContactModal={setIsOpenContactModal}
        setisOpenRejectConfirm={setisOpenRejectConfirm}
        handleUpdateContact={handleUpdateContact}
        updateContactStatusIsLoading={updateContactStatusIsLoading}
      />

      <ContactUpdateModal
        isModalOpen={isOpenRejectConfirm}
        setIsModalOpen={setisOpenRejectConfirm}
        handleUpdateContact={handleUpdateContact}
        selectedContactId={selectedContact?.id}
        updateIsLoading={updateContactStatusIsLoading}
      />

      <div className="w-full h-full ">
        <div className=" mt-6 w-full flex justify-between items-center bg-white px-2 py-4 rounded-lg">
          <div>
            {sort !== "DESC" ? (
              <Button
                icon={<SortAscendingOutlined />}
                onClick={() => handleSort("DESC")}
                type="primary"
              >
                Liên hệ mới nhất
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SortDescendingOutlined />}
                onClick={() => handleSort("ASC")}
              >
                Liên hệ sớm nhất
              </Button>
            )}
          </div>
          <Segmented
            options={[
              {
                label: "TẤT CẢ",
                value: "ALL",
              },
              {
                label: "ĐANG CHỜ",
                value: "PENDING",
              },
              {
                label: "CHẤP NHẬN",
                value: "ACCEPTED",
              },
              {
                label: "TỪ CHỐI",
                value: "REJECTED",
              },
              {
                label: "THÀNH CÔNG",
                value: "SUCCESS",
              },
            ]}
            onChange={(value) => handleChangeStatus(value)}
            className="bg-slate-200"
          />
        </div>
      </div>

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
                <Empty
                  description={
                    <span>Đang xảy ra lỗi bạn vui lòng chờ trong giây lát</span>
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
                      className=" mt-3"
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

export default memo(CustomerPage);
