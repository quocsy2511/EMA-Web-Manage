import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";
import React, { useState } from "react";

const ComfirmingBudgetStaff = ({ selectEvent }) => {
  const [data, setdata] = useState([1, 2, 3, 4]);
  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      key: "budgetName",
      editTable: true,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
      editTable: true,
    },
    {
      title: "Chi phí ước chừng",
      dataIndex: "estExpense",
      key: "estExpense",
      editTable: true,
    },
    {
      title: "Thực chi",
      dataIndex: "realExpense",
      key: "realExpense",
      editTable: true,
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
            color={record.status === 1 ? "green" : "#faad14"}
            key={record.id}
          >
            {record.status === 1 ? "ACTIVE" : "PENDING"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <FormOutlined className="text-blue-500" />
          <DeleteOutlined className="text-red-500" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="w-full bg-[#F0F6FF] p-8 rounded-xl">
        <Table
          bordered
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default ComfirmingBudgetStaff;
