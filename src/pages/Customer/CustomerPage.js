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
  BarsOutlined,
  BookOutlined,
  CarryOutOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  CopyOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  ExclamationCircleOutlined,
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
  const [isContract, setIsContract] = useState(false);
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

      {/* header */}
      <div className="flex flex-row w-full  py-2">
        <div className="flex flex-row w-full justify-between items-center mb-2 ">
          <div className="w-full flex flex-col justify-center items-start  py-2">
            <h3 className="font-bold text-3xl text-blueBudget mb-2">
              Danh sách liên hệ
            </h3>
            <p className="text-blueSecondBudget font-semibold">
              Quản lí thông tin liên hệ khách hàng
            </p>
          </div>
          <div className="w-[50%] flex justify-end text-end items-end h-full">
            <ul className="pl-0 list-none inline-block mt-2">
              <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                <span
                  className="cursor-pointer hover:text-blue-500 text-blueBudget font-bold"
                  onClick={() => navigate("/manager")}
                >
                  Trang chủ
                </span>
                <DoubleRightOutlined />
              </li>
              <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                <span className="cursor-pointer hover:text-blueBudget">
                  <span className="font-bold">Khách hàng</span>
                </span>
                <DoubleRightOutlined />
              </li>
              <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                <span className="cursor-pointer hover:text-blueBudget">
                  <span className="font-bold">Danh Sách liên hệ</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* filterContact */}
      <div className="w-full  flex flex-row gap-x-4  items-center">
        <div className="w-[25%] bg-[#fb3e7a] rounded-lg px-2 py-2">
          <div className="w-full h-full flex flex-row justify-center items-start gap-x-2">
            <BookOutlined className="mt-[2px] text-white text-base" />
            <Spin spinning={isLoading}>
              <p className="flex flex-col text-white ">
                <span className="font-medium text-sm">Tổng số liên hệ</span>
                <b className="font-bold text-lg">{contacts?.length} liên hệ</b>
              </p>
            </Spin>
          </div>
        </div>
        <div className="w-[75%] flex justify-between items-center bg-white px-2 py-2 rounded-lg">
          <div>
            {sort !== "DESC" ? (
              <Button
                icon={<SortAscendingOutlined />}
                onClick={() => handleSort("DESC")}
                // type="primary"
                className="w-fit h-fit py-4 px-6 font-semibold border-green-700 text-green-700"
              >
                Liên hệ mới nhất
              </Button>
            ) : (
              <Button
                // type="default"
                icon={<SortDescendingOutlined />}
                onClick={() => handleSort("ASC")}
                className="w-fit h-fit py-4 px-6 font-semibold border-green-700 text-green-700"
              >
                Liên hệ sớm nhất
              </Button>
            )}
          </div>
          <Segmented
            size="large"
            options={[
              {
                label: "TẤT CẢ",
                value: "ALL",
                icon: <BarsOutlined />,
              },
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
