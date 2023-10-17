import { Form, Tag, message } from "antd";
import React, { useState } from "react";

const ConfirmedBudget = () => {
  const [editingRowKey, setEditingRowKey] = useState("");

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onEditing = (record) => {
    form.setFieldsValue({
      fullName: "",
      phoneNumber: "",
      dob: "",
      role: "",
      divisionName: "",
      status: "",
      ...record,
    });
    setEditingRowKey(record.key);
  };

  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      editTable: true,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
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
  return <div></div>;
};

export default ConfirmedBudget;
