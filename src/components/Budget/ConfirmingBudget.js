import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FloatButton,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from "antd";
import moment from "moment";
import React, { useState } from "react";
import { getBudget, updateStatusBudget } from "../../apis/budgets";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";
import emptyBudget from "../../assets/images/empty_budget.jpg";
import AnErrorHasOccured from "../Error/AnErrorHasOccured";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

const ConfirmingBudget = ({ eventId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState();

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: budgets,
    isLoading: budgetsIsLoading,
    isError: budgetsIsError,
  } = useQuery(["confirming-budgets", eventId, currentPage, pageSize], () =>
    getBudget({
      eventID: eventId,
      pageSize: pageSize,
      currentPage: currentPage,
      mode: 1,
    })
  );
  console.log("budgets: ", budgets);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    ({ budgetsId, status }) => updateStatusBudget({ budgetsId, status }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "confirming-budgets",
          eventId,
          // currentPage,
          // pageSize,
        ]);
        queryClient.invalidateQueries(["confirmed-budgets", eventId]);
        messageApi.open({
          type: "success",
          content: `Đã ${
            variables.status === "REJECT" ? "từ chối" : "chấp thuận"
          } 1 khoản chi.`,
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const searchGlobal = () => {
    if (searchText) {
      const filterSearchedData = budgets.data.filter(
        (value) =>
          value.budgetName.toLowerCase().includes(searchText.toLowerCase()) ||
          value.userName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filterSearchedData);
    }
  };

  const onConfirmBudget = (status, budgetsId) => {
    mutate({ budgetsId, status });
  };

  const handleTableChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setSortedInfo({ columnKey: field, order });
  };

  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      key: "budgetName",
      fixed: "left",
      render: (_, record) => <p className="font-medium">{record.budgetName}</p>,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chi phí ước chừng",
      dataIndex: "estExpense",
      key: "estExpense",
      align: "center",
      sorter: (a, b) => {
        return a.estExpense - b.estExpense;
      },
      sortOrder: sortedInfo.columnKey === "estExpense" && sortedInfo.order,
      render: (_, record) => <p>{record.estExpense.toLocaleString()} VNĐ</p>,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Người gửi",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (_, record) => (
        <p>{moment(record.createAt).format("DD/MM/YYYY")}</p>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={"middle"}>
          <Popconfirm
            title="Bạn muốn từ chối khoản chi này ?"
            onConfirm={() => onConfirmBudget("REJECT", record.id)}
            okText="OK"
            cancelText="Không"
          >
            <Button loading={isLoading} danger size="small">
              Từ chối
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bạn đang chấp thuận khoản chi này ?"
            onConfirm={() => onConfirmBudget("ACCEPT", record.id)}
            okText="OK"
            cancelText="Không"
          >
            <Button loading={isLoading} type="primary" size="small">
              Chấp thuận
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (budgetsIsLoading) return <LoadingComponentIndicator />;

  if (budgetsIsError) return <AnErrorHasOccured />;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
    >
      {contextHolder}
      {budgets.data.length === 0 ? (
        <div className="mx-auto flex flex-col items-center py-5">
          <img src={emptyBudget} />
          <p className="text-xl">Không có thu chi cần được duyệt !</p>
        </div>
      ) : (
        <div className="w-full bg-[#F0F6FF] p-8 rounded-xl space-y-5">
          <div className="flex gap-x-5">
            <Input
              className="w-[30%]"
              placeholder="Tìm kiếm theo tên thu chi hoặc người gửi"
              value={searchText}
              allowClear
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value === "") {
                  setFilteredData();
                }
              }}
              onPressEnter={searchGlobal}
            />
            <Button type="primary" onClick={searchGlobal}>
              Tìm kiếm
            </Button>

            <div className="flex-1 text-right">
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 10, label: "10 / trang" },
                  { value: 20, label: "20 / trang" },
                  { value: 50, label: "50 / trang" },
                ]}
              />
            </div>
          </div>

          <Table
            bordered
            columns={columns}
            dataSource={filteredData ? filteredData : budgets.data}
            onChange={handleTableChange}
            pagination={false}
            scroll={{
              x: "150%",
              // y: "100%",
              scrollToFirstRowOnChange: true,
            }}
          />

          <AnimatePresence>
            {(budgets.nextPage || budgets.prevPage) && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className="flex items-center justify-center gap-x-3 mt-8"
              >
                <MdOutlineKeyboardArrowLeft
                  className={`text-slate-500 ${
                    budgets.prevPage
                      ? "cursor-pointer hover:text-blue-600"
                      : "cursor-not-allowed"
                  }`}
                  onClick={() =>
                    budgets.prevPage && setCurrentPage((prev) => prev - 1)
                  }
                  size={25}
                />
                <AnimatePresence>
                  {Array.from({ length: budgets.lastPage }, (_, index) => (
                    <motion.div
                      layout
                      key={index}
                      className={`border border-slate-300 rounded-xl px-4 py-2 text-base font-medium cursor-pointer hover:bg-blue-200 ${
                        currentPage === index + 1 &&
                        "text-blue-600 border-blue-800 bg-blue-100"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <MdOutlineKeyboardArrowRight
                  className={`text-slate-500 ${
                    budgets.nextPage
                      ? "cursor-pointer hover:text-blue-600"
                      : "cursor-not-allowed"
                  }`}
                  onClick={() =>
                    budgets.nextPage && setCurrentPage((prev) => prev + 1)
                  }
                  size={25}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <FloatButton.BackTop />
    </motion.div>
  );
};

export default ConfirmingBudget;
