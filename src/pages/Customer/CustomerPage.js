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
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerContacts,
  updateCustomerContacts,
} from "../../apis/contact";
import momenttz from "moment-timezone";
import { AnimatePresence, motion } from "framer-motion";
import { GrAscend, GrDescend } from "react-icons/gr";
import { GoPerson, GoMail, GoCalendar, GoLocation } from "react-icons/go";
import { LuSmartphone } from "react-icons/lu";
import {
  LiaCalendarDaySolid,
  LiaCalendarCheckSolid,
  LiaMoneyBillSolid,
} from "react-icons/lia";
import { TbCategory } from "react-icons/tb";
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5";
import {
  MdOutlineNewLabel,
  MdOutlinePending,
  MdCheckCircleOutline,
} from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import LoadingItemIndicator from "../../components/Indicator/LoadingItemIndicator";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
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

const CustomerPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("DESC");
  const [sizePage, setSizePage] = useState(50);
  const [contactStatus, setContactStatus] = useState("ALL");
  const [selectedContact, setSelectedContact] = useState();
  const [isOpenContactModal, setIsOpenContactModal] = useState(false);
  const [isSortASC, setIsSortASC] = useState(false);

  const {
    data: contacts,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["contact", currentPage, sort, contactStatus],
    () =>
      getCustomerContacts({
        currentPage,
        sort,
        status: contactStatus,
        sizePage,
      }),
    {
      select: (data) => {
        const listContact = data?.data;
        return listContact;
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleOpenContactModal = (value) => {
    setIsOpenContactModal(true);
    setSelectedContact(value);
  };
  const confirm = (e) => {
    console.log(e);
  };
  const cancel = (e) => {
    console.log(e);
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
      title: "#No",
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
          {moment(record.startDate).format("DD-MM-YYYY")} <SwapRightOutlined />{" "}
          {moment(record.endDate).format("DD-MM-YYYY")}
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
      title: "Hoạt động",
      key: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            className="hover:text-blue-600 text-blue-300"
            onClick={() => handleOpenContactModal(record)}
          />
          {/* <Popconfirm
            placement="topLeft"
            title="Xác nhận xoá liên lạc "
            description="Bạn có chắc chắn muốn xoá liên lạc này ?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Đồng ý"
            cancelText="Không"
          >
            <DeleteOutlined className="text-red-300 hover:text-red-600" />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="w-full h-full ">
        <div className=" mt-6 w-full flex justify-between items-center">
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
        <div className="mt-2">
          {isLoading ? (
            <Spin spinning={isLoading} />
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
          {isOpenContactModal && (
            <ContactModal
              contact={selectedContact}
              isOpenContactModal={isOpenContactModal}
              setIsOpenContactModal={setIsOpenContactModal}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default memo(CustomerPage);
