import { Image, Table, Tag } from "antd";
import React, { useState } from "react";

const ConfirmedBudgetStaff = ({ selectEvent, listBudgetConfirmed }) => {
  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      key: "budgetName",
      editTable: true,
      width: "20%",
      render: (text) => (
        <div>
          <p className="text-blue-500">{text} </p>
        </div>
      ),
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
      render: (text) => (
        <div>
          <p>{text.toLocaleString()} VND</p>
        </div>
      ),
    },
    {
      title: "Thực chi",
      dataIndex: "realExpense",
      key: "realExpense",
      editTable: true,
      width: "15%",
      render: (text) => (
        <div>
          <p>{text.toLocaleString()} VND</p>
        </div>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      editTable: true,
      width: "15%",
    },
    {
      title: "Hoá đơn",
      dataIndex: "urlImage",
      key: "urlImage",
      editTable: true,
      width: "10%",
      render: () => (
        <Image
          width={100}
          className="w-full object-cover overflow-hidden rounded-lg"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
  ];

  return (
    <div>
      <div className="w-full bg-white p-8 rounded-xl">
        <Table
          rowKey="id"
          bordered
          columns={columns}
          dataSource={listBudgetConfirmed}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ConfirmedBudgetStaff;
