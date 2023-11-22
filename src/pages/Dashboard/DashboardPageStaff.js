import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Radio, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import HeadingTitle from "../../components/common/HeadingTitle";
import { useQuery } from "@tanstack/react-query";
import { getStatistic } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";

const DashboardPageStaff = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [type, setType] = useState("ALL");

  const {
    data: dataStatistic,
    refetch,
    isLoading,
    isError,
  } = useQuery(["data-statistic"], () => getStatistic({ type }), {
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
  });

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
      title: "Tên sự kiện",
      dataIndex: "eventName",
      key: "eventName",
      width: "14%",
      ...getColumnSearchProps("eventName"),
    },
    // {
    //   title: "Số người tham gia",
    //   dataIndex: "description",
    //   key: "description",
    //   // width: "12%",
    //   // sorter: (a, b) => a.estExpense - b.estExpense,
    // },
    {
      title: "Số công việc",
      dataIndex: "tasks",
      key: "total",
      render: (tasks) => tasks.total,
      // width: "14%",
      sorter: (a, b) => a.tasks.total - b.tasks.total,
    },
    {
      title: "Công việc hoàn thành",
      dataIndex: "tasks",
      key: "done",
      render: (tasks) => tasks.done,
      // width: "14%",
      sorter: (a, b) => a.tasks.done - b.tasks.done,
    },
    // {
    //   title: "Công việc đang diễn ra",
    //   dataIndex: "tasks",
    //   key: "processing,
    //   render: (tasks) => tasks.processing,
    //   // width: "14%",
    //   // sorter: (a, b) => a.tasks.processing - b.tasks.processing,
    // },
    // {
    //   title: "Công việc đã xác nhận,
    //   dataIndex: "tasks",
    //   key: "processing,
    //   render: (tasks) => tasks.processing,
    //   // width: "14%",
    //   // sorter: (a, b) => a.tasks.processing - b.tasks.processing,
    // },
    {
      title: "Công việc đã huỷ",
      dataIndex: "tasks",
      key: "cancel",
      render: (tasks) => tasks.cancel,
      // width: "12%",
      sorter: (a, b) => a.tasks.cancel - b.tasks.cancel,
    },
    {
      title: "Công việc quá hạn",
      dataIndex: "tasks",
      key: "overdue",
      render: (tasks) => tasks.overdue,
      // width: "12%",
      sorter: (a, b) => a.tasks.overdue - b.tasks.overdue,
    },
    {
      title: "Công việc chuẩn bị",
      dataIndex: "tasks",
      key: "pending",
      render: (tasks) => tasks.pending,
      // width: "12%",
      sorter: (a, b) => a.tasks.pending - b.tasks.pending,
    },
    // {
    //   title: "Chi phí",
    //   dataIndex: "estExpense",
    //   key: "estExpense",
    //   width: "10%",
    //   // sorter: (a, b) => a.estExpense - b.estExpense,
    //   render: (text) => (
    //     <div>
    //       <p className="text-orange-500">{text.toLocaleString()} VND</p>
    //     </div>
    //   ),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      // width: "20%",
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === "PENDING" ? "warning" : "green"}
            key={record.id}
          >
            {record.status === "PENDING" ? "CHUẨN BỊ" : "HOÀN THÀNH"}
          </Tag>
        </div>
      ),
    },
  ];

  const onChange = (e) => {
    setType(e.target.value);
  };
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className="w-full bg-transparent p-8 rounded-xl h-full">
      <div className="flex flex-row justify-between">
        <HeadingTitle>Bảng thông kê</HeadingTitle>
        <Radio.Group onChange={onChange} value={type} disabled={isLoading}>
          <Radio value={"ALL"}>Tất cả</Radio>
          <Radio value={"PROCESSING"}>Đang diễn ra</Radio>
        </Radio.Group>
      </div>
      {!isLoading ? (
        !isError ? (
          <Table
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            columns={columns}
            dataSource={dataStatistic}
          />
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </div>
  );
};

export default DashboardPageStaff;
