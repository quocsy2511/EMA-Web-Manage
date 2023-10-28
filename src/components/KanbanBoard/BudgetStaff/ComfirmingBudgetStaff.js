import {
  DeleteOutlined,
  ExclamationCircleFilled,
  FormOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { Button, Input, Modal, Space, Table, Tag } from "antd";
import React, { useRef, useState } from "react";
import EditBudget from "./ModalBudget/EditBudget";
import Highlighter from "react-highlight-words";

const ComfirmingBudgetStaff = ({ selectEvent, listBudgetConfirming }) => {
  const [isOpenEditBudget, setIsOpenEditBudget] = useState(false);
  const [isConfirmedBudget, setIsConfirmedBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      key: "budgetName",
      editTable: true,
      width: "22%",
      ...getColumnSearchProps("budgetName"),
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
      editTable: true,
      width: "22%",
    },
    {
      title: "Chi phí ước chừng",
      dataIndex: "estExpense",
      key: "estExpense",
      editTable: true,
      width: "15%",
      sorter: (a, b) => a.estExpense - b.estExpense,
      render: (text) => (
        <div>
          <p className="text-orange-500">{text.toLocaleString()} VND</p>
        </div>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      editTable: true,
      width: "15%",
      ...getColumnSearchProps("supplier"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      editTable: true,
      align: "center",
      width: "15%",
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === 1 ? "green" : "warning"}
            key={record.id}
          >
            {record.status === 1 ? "ACTIVE" : "CHỜ XÁC NHẬN"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <FormOutlined
            className="text-blue-500"
            onClick={() => {
              setSelectedBudget(record);
              setIsOpenEditBudget(true);
              setIsConfirmedBudget(false);
            }}
          />
          <DeleteOutlined
            className="text-red-500"
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  const { confirm } = Modal;
  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá yêu cầu này không?",
      icon: <ExclamationCircleFilled />,
      content: "Xóa một yêu cầu chi tiêu là vĩnh viễn. Không có cách hoàn tác",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        // deletecommentMutate(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div>
      <div className="w-full bg-white p-8 rounded-xl">
        <>
          <Table
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            columns={columns}
            dataSource={listBudgetConfirming}
            // pagination={false}
          />
        </>
        {isOpenEditBudget && (
          <EditBudget
            selectedBudget={selectedBudget}
            isOpenEditBudget={isOpenEditBudget}
            setIsOpenEditBudget={setIsOpenEditBudget}
            setIsConfirmedBudget={setIsConfirmedBudget}
            isConfirmedBudget={isConfirmedBudget}
          />
        )}
      </div>
    </div>
  );
};

export default ComfirmingBudgetStaff;
