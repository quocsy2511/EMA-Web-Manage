import React, { useRef, useState } from "react";
import { Avatar, Button, Input, Space, Table, Tag, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import {
  DeleteOutlined,
  SearchOutlined,
  SwapRightOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const data = [
  {
    key: "1",
    task: "Lau bàn ghế",
    event: { eventName: "sự kiện 10 năm", status: "processing" },
    age: 32,
    description: "anh Không xong không về 1",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["processing"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "2",
    task: "Đi mua nước",
    event: { eventName: "sự kiện 20 năm", status: "processing" },
    age: 42,
    description: "cho Không xong không về  2",
    priority: ["Medium"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["confirmed"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "3",
    task: "Bê bục giảng",
    event: { eventName: "sự kiện 20 năm", status: "processing" },
    age: 35,
    description: "đi Không xong không về 4",
    priority: ["Low"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["pending"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "4",
    task: "Đánh lz Vũ",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "bánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "5",
    task: "Đánh lz Vũ 2",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "cánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "6",
    task: "Đánh lz Vũ 2",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "cánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "7",
    task: "Đánh lz Vũ 2",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "cánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "8",
    task: "Đánh lz Vũ 2",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "cánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "9",
    task: "Đánh lz Vũ 2",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "cánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
  {
    key: "10",
    task: "Đánh lz Vũ 2",
    event: { eventName: "sự kiện 30 năm", status: "done" },
    age: 40,
    description: "cánh Không xong không về 3",
    priority: ["High"],
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    status: ["done"],
    createBy: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  },
];
const statusFilter = [
  {
    value: "processing",
    text: "Processing",
  },
  {
    value: "done",
    text: "Done",
  },
  {
    value: "pending",
    text: "Pending",
  },
  {
    value: "confirmed",
    text: "Confirmed",
  },
];
const priorityFilter = [
  {
    value: "High",
    text: "High",
  },
  {
    value: "Medium",
    text: "Medium",
  },
  {
    value: "Low",
    text: "Low",
  },
];

const MyTaskPageStaff = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const getColorStatus = (status) => {
    const colorMapping = {
      done: "success",
      pending: "warning",
      confirmed: "cyan",
      processing: "processing",
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[status];
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (confirm, clearFilters) => {
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
            onClick={() => clearFilters && handleReset(confirm, clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
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

  const formattedDate = (value) => {
    const date = new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return date;
  };

  const columns = [
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      width: "15%",
      ...getColumnSearchProps("task"),
      ellipsis: true,
      sorter: (a, b) => {
        return a.task.localeCompare(b.task);
      },
      render: (_, { event, task }) => (
        <Tooltip key="event" title={task} placement="topLeft">
          <p
            className={
              event.status === "done"
                ? "line-through decoration-red-700 decoration-2 opacity-30 text-blue-500 font-medium"
                : "text-blue-500 font-medium"
            }
          >
            {task.toUpperCase()}
          </p>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // width: "30%",
      // ...getColumnSearchProps("task"),
      align: "center",
      render: (_, { event, startDate, endDate }) => {
        return (
          <p
            className={
              event.status === "done"
                ? "line-through decoration-red-700 decoration-2 opacity-30"
                : ""
            }
          >
            {formattedDate(startDate)} <SwapRightOutlined />{" "}
            {formattedDate(endDate)}
          </p>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center",
      filters: priorityFilter,
      onFilter: (value, record) => record.priority.indexOf(value) === 0,
      render: (_, { event, priority }) => (
        <>
          {priority.map((item) => {
            let color = item === "Medium" ? "text-blue-400" : "text-yellow-500";
            if (item === "High") {
              color = "text-orange-400";
            }
            return (
              <p
                key={item}
                className={
                  event.status === "done"
                    ? `line-through decoration-red-700 decoration-2 opacity-30 ${color}`
                    : `${color}`
                }
              >
                {item.toUpperCase()}
              </p>
            );
          })}
        </>
      ),
    },
    {
      title: "Create By",
      dataIndex: "createBy",
      key: "createBy",
      width: 150,
      // ...getColumnSearchProps("task"),
      ellipsis: true,
      align: "center",
      render: (_, { event, createBy }) => (
        <div
          className={
            event.status === "done"
              ? "opacity-30 flex flex-row gap-x-2 justify-start items-center bg-slate-50  rounded-md p-1 cursor-pointer"
              : "flex flex-row gap-x-2 justify-start items-center bg-slate-50  rounded-md p-1 cursor-pointer"
          }
        >
          <Tooltip key="avatar" title={createBy.name} placement="top">
            <Avatar src={createBy.avatar} size="small" />
          </Tooltip>
          <p className="w-10 flex-1  text-sm font-semibold">{createBy.name}</p>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: 120,
      align: "center",
      filters: statusFilter,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (_, { event, status }) => (
        <>
          {status.map((item) => {
            return (
              <Tag
                color={getColorStatus(item)}
                key={item}
                className={event.status === "done" ? "opacity-30" : ""}
              >
                {item.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      align: "center",
      ellipsis: true,
      width: "20%",
      render: (_, { event }) => (
        <Tooltip key="event" title={event.eventName} placement="top">
          <p
            className={
              event.status === "done"
                ? "line-through decoration-red-700 decoration-2 opacity-30"
                : ""
            }
          >
            {event.eventName.toUpperCase()}
          </p>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
      ...getColumnSearchProps("description"),
      sorter: (a, b) => {
        return a.description.localeCompare(b.description);
      },
      render: (_, { event, description }) => (
        <p
          className={
            event.status === "done"
              ? "line-through decoration-red-700 decoration-2 opacity-30"
              : ""
          }
        >
          {description}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      align: "center",
      render: (_, { event }, record) => (
        <Space
          size="middle"
          className={event.status === "done" && "opacity-30"}
        >
          <Button
            disabled={event.status === "done" && true}
            type="text"
            className="flex justify-center items-center"
          >
            <ToolOutlined className="text-blue-600" />
          </Button>
          <Button
            disabled={event.status === "done" && true}
            type="text"
            className="flex justify-center items-center"
          >
            <DeleteOutlined className="text-red-600" />
          </Button>
        </Space>
      ),
    },
  ];

  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div className="h-screen pt-[90px] bg-bgBoard px-10 ">
      <div className=" pb-5">
        <div className=" px-10  ">
          <Table
            title={() => {
              return (
                <div className="flex flex-row justify-end">
                  <Search
                    placeholder="input search text"
                    onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                  />
                </div>
              );
            }}
            columns={columns}
            dataSource={data}
            className="shadow-xl rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MyTaskPageStaff;
