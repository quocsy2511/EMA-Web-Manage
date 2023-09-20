import React, { useRef, useState } from "react";
import HeadingTitle from "../../components/common/HeadingTitle";
import {
  SearchOutlined,
  EyeTwoTone,
  DeleteTwoTone,
  HeartTwoTone,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Tag } from "antd";

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    status: "active",
  },
  {
    key: "2",
    name: "Joe Black",
    age: 42,
    address: "London No. 1 Lake Park",
    status: "active",
  },
  {
    key: "3",
    name: "Jim Green",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    status: "active",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "5",
    name: "Jim Red",
    age: 30,
    address: "LA No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "6",
    name: "Jim brown",
    age: 31,
    address: "LA No. 2 Lake Park",
    status: "done",
  },
  {
    key: "7",
    name: "Jim Green",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    status: "active",
  },
  {
    key: "8",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "9",
    name: "Jim Red",
    age: 30,
    address: "LA No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "21",
    name: "Jim brown",
    age: 31,
    address: "LA No. 2 Lake Park",
    status: "done",
  },
  {
    key: "10",
    name: "Jim Green",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    status: "active",
  },
  {
    key: "11",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "12",
    name: "Jim Red",
    age: 30,
    address: "LA No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "13",
    name: "Jim brown",
    age: 31,
    address: "LA No. 2 Lake Park",
    status: "done",
  },
  {
    key: "14",
    name: "Jim Green",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    status: "active",
  },
  {
    key: "15",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "16",
    name: "Jim Red",
    age: 30,
    address: "LA No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "17",
    name: "Jim brown",
    age: 31,
    address: "LA No. 2 Lake Park",
    status: "done",
  },
  {
    key: "18",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "19",
    name: "Jim Red",
    age: 30,
    address: "LA No. 2 Lake Park",
    status: "cancel",
  },
  {
    key: "20",
    name: "Jim brown",
    age: 31,
    address: "LA No. 2 Lake Park",
    status: "done",
  },
];

const PersonnelDepartmentPage = () => {
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

  //Dropdown search filter chứa hàm xử lí và render cái popup
  //Search nó khác thăng filter 1 chỗ là nó search nó xác định đc input trả ra ds và đóng popUp còn filter thì có thể nhiều input nhưng ko đóng cái popUp
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      //Popup
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()} // hiểu đơn giản là nó ngăn chặn mình dùng bàn phím để điều khiển thành phần bên trong
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
            onClick={() => clearFilters && handleReset(clearFilters)}
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
              //confirm của antd để xác nhận 1 action
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),

    //đơn giản forcus icon mà mình chọn theo bảng
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),

    //kiểm tra xem cái input m search nó có trong bảng hay không
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    //set thời gian mở popUp search
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    // này render bảng và để bôi màu thằng có cùng input mà mình search
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

  //đây là cột title
  const columns = [
    {
      title: "No",
      dataIndex: "",
      width: 50,
      render: (_, __, index) => index + 1, // Return the index of each row plus one
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
      // render: (_, { name }) => {
      //   return <span className="text-[#1d39c4]">{name}</span>;
      // },
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: "20%",
      ...getColumnSearchProps("age"),
      sorter: (a, b) => a.age - b.age,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "20%",
      ...getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      ...getColumnSearchProps("status"),
      render: (_, { status }) => {
        let color = "geekblue";
        if (status === "active") {
          color = "green";
        } else if (status === "done") {
          color = "volcano";
        } else {
          color = "geekblue";
        }
        return (
          <>
            <Tag color={color}>{status.toUpperCase()}</Tag>
          </>
        );
      },
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      // width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <EyeTwoTone
            twoToneColor="#1d39c4"
            className="cursor-pointer text-lg"
          />
          <DeleteTwoTone
            twoToneColor="#eb2f96"
            className="cursor-pointer text-lg"
          />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <div className="p-10 min-h-screen bg-blue-300 min-w-full ">
        <div className="flex-1">
          <HeadingTitle> Danh sách phòng ban</HeadingTitle>
          <div className="mt-10 px-4 ">
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={{
                // pageSize: 5,
                total: data.length, // số trang tối đa hiện data
                showSizeChanger: true,
                pageSizeOptions: [1, 2, 3, 4, 10, 20, 30, 50, 100],
                defaultPageSize: 5,
                jumpPrevIcon: () => {
                  return (
                    <>
                      <HeartTwoTone twoToneColor="#eb2f96" />
                    </>
                  );
                },
              }}
              size="large"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonnelDepartmentPage;
