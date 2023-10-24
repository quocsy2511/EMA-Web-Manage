import { Table, Tag } from "antd";
import React, { useState } from "react";

const ConfirmedBudgetStaff = ({ selectEvent }) => {
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
            color={record.status === 1 ? "green" : "volcano"}
            key={record.id}
          >
            {record.status === 1 ? "ACTIVE" : "INACTIVE"}
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="w-full bg-white p-8 rounded-xl">
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

export default ConfirmedBudgetStaff;
