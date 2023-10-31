import { Image, Space, Table, Tag, Input, Button } from "antd";
import React, { useRef, useState } from "react";
import HeadingTitle from "../../../components/common/HeadingTitle";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import EditBudget from "./ModalBudget/EditBudget";
import Highlighter from "react-highlight-words";
const ConfirmedBudgetStaff = ({ selectEvent, listBudgetConfirmed }) => {
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
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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

  const checkEditing = (record) => {
    if (record.urlImage === null || record.realExpense === 0) {
      return true;
    } else {
      return false;
    }
  };

  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      key: "budgetName",
      editTable: true,
      width: "20%",
      ...getColumnSearchProps("budgetName"),
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
      editTable: true,
      width: "20%",
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
      title: "Thực chi",
      dataIndex: "realExpense",
      key: "realExpense",
      editTable: true,
      width: "15%",
      sorter: (a, b) => a.realExpense - b.realExpense,
      render: (text) => (
        <div>
          <p className="text-green-500">{text.toLocaleString()} VND</p>
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
      title: "Hoá đơn",
      dataIndex: "urlImage",
      key: "urlImage",
      editTable: true,
      width: "10%",
      render: (urlImage) => (
        <Image
          width={100}
          className="w-full object-cover overflow-hidden rounded-lg"
          src={urlImage === null ? "" : urlImage}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      editTable: true,
      align: "center",
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === 1 ? "green" : "success"}
            key={record.id}
          >
            {record.status === 1 ? "ACTIVE" : "ĐÃ XÁC NHẬN"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = checkEditing(record);
        return (
          <div className="flex">
            <Button
              type="link"
              disabled={!editable}
              className={!editable ? "opacity-30" : ""}
            >
              <FormOutlined
                className="text-blue-500"
                onClick={() => {
                  setSelectedBudget(record);
                  setIsOpenEditBudget(true);
                  setIsConfirmedBudget(true);
                }}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  // const { confirm } = Modal;
  // const showDeleteConfirm = () => {
  //   confirm({
  //     title: "Bạn có chắc chắn muốn xoá yêu cầu này không?",
  //     icon: <ExclamationCircleFilled />,
  //     content: "Xóa một yêu cầu chi tiêu là vĩnh viễn. Không có cách hoàn tác",
  //     okText: "Xác nhận",
  //     okType: "danger",
  //     cancelText: "Huỷ",
  //     onOk() {
  //       // deletecommentMutate(id);
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // };

  return (
    <div>
      <div className="w-full bg-white p-8 rounded-xl">
        <>
          <HeadingTitle>Bảng chờ chi phí đã xác nhận</HeadingTitle>
          <Table
            rowKey="id"
            bordered
            columns={columns}
            dataSource={listBudgetConfirmed}
            pagination={{ pageSize: 10 }}
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

export default ConfirmedBudgetStaff;
