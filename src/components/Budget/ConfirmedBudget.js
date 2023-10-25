import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React, { Fragment, useState } from "react";
import { BiEdit } from "react-icons/bi";

const dummyData = [
  {
    "id": "0a160c2b-1188-4da9-8126-b2a7b3eb56a4",
    "budgetName": "Tiền thuê mic 123",
    "estExpense": 200000,
    "realExpense": 400000,
    "status": "ACCEPT",
    "eventID": "2e361780-2d0c-481d-b541-fbe646521052",
    "eventName": "Sự kiện 10 năm thành lập FBT",
    "createBy": "332767d3-b77e-49ec-a595-b8c77f5d53f2",
    "createAt": "2023-10-24T14:47:26.000Z",
    "approveBy": "568c4cd7-4f68-46b7-bcc4-90ac9f11740e",
    "approveDate": "2023-10-24T17:24:12.000Z",
    "urlImage": "url image hóa đơn 1",
    "supplier": "Saigon LED 1",
    "description": "Thuê sảnh từ 8h00 - 12h00 ",
    "userName": "test"
  },
  {
    "id": "0a160c2b-1188-4da9-8126-b2a7b3eb56a5",
    "budgetName": "Tiền thuê mic 123",
    "estExpense": 200000,
    "realExpense": 400000,
    "status": "ACCEPT",
    "eventID": "2e361780-2d0c-481d-b541-fbe646521052",
    "eventName": "Sự kiện 10 năm thành lập FBT",
    "createBy": "332767d3-b77e-49ec-a595-b8c77f5d53f2",
    "createAt": "2023-10-24T14:47:26.000Z",
    "approveBy": "568c4cd7-4f68-46b7-bcc4-90ac9f11740e",
    "approveDate": "2023-10-24T17:24:12.000Z",
    "urlImage": "url image hóa đơn 1",
    "supplier": "Saigon LED 1",
    "description": "Thuê sảnh từ 8h00 - 12h00 ",
    "userName": "test"
  },
  {
    "id": "0a160c2b-1188-4da9-8126-b2a7b3eb56a6",
    "budgetName": "Tiền thuê mic 123",
    "estExpense": 200000,
    "realExpense": 400000,
    "status": "ACCEPT",
    "eventID": "2e361780-2d0c-481d-b541-fbe646521052",
    "eventName": "Sự kiện 10 năm thành lập FBT",
    "createBy": "332767d3-b77e-49ec-a595-b8c77f5d53f2",
    "createAt": "2023-10-24T14:47:26.000Z",
    "approveBy": "568c4cd7-4f68-46b7-bcc4-90ac9f11740e",
    "approveDate": "2023-10-24T17:24:12.000Z",
    "urlImage": "url image hóa đơn 1",
    "supplier": "Saigon LED 1",
    "description": "Thuê sảnh từ 8h00 - 12h00 ",
    "userName": "test"
  },
  {
    "id": "0a160c2b-1188-4da9-8126-b2a7b3eb56a7",
    "budgetName": "Tiền thuê mic 123",
    "estExpense": 200000,
    "realExpense": 400000,
    "status": "ACCEPT",
    "eventID": "2e361780-2d0c-481d-b541-fbe646521052",
    "eventName": "Sự kiện 10 năm thành lập FBT",
    "createBy": "332767d3-b77e-49ec-a595-b8c77f5d53f2",
    "createAt": "2023-10-24T14:47:26.000Z",
    "approveBy": "568c4cd7-4f68-46b7-bcc4-90ac9f11740e",
    "approveDate": "2023-10-24T17:24:12.000Z",
    "urlImage": "url image hóa đơn 1",
    "supplier": "Saigon LED 1",
    "description": "Thuê sảnh từ 8h00 - 12h00 ",
    "userName": "test"
  },
  {
    "id": "0a160c2b-1188-4da9-8126-b2a7b3eb56a8",
    "budgetName": "Tiền thuê mic 123",
    "estExpense": 200000,
    "realExpense": 400000,
    "status": "ACCEPT",
    "eventID": "2e361780-2d0c-481d-b541-fbe646521052",
    "eventName": "Sự kiện 10 năm thành lập FBT",
    "createBy": "332767d3-b77e-49ec-a595-b8c77f5d53f2",
    "createAt": "2023-10-24T14:47:26.000Z",
    "approveBy": "568c4cd7-4f68-46b7-bcc4-90ac9f11740e",
    "approveDate": "2023-10-24T17:24:12.000Z",
    "urlImage": "url image hóa đơn 1",
    "supplier": "Saigon LED 1",
    "description": "Thuê sảnh từ 8h00 - 12h00 ",
    "userName": "test"
  },
  {
    "id": "0a160c2b-1188-4da9-8126-b2a7b3eb56a9",
    "budgetName": "Tiền thuê mic 123",
    "estExpense": 200000,
    "realExpense": 400000,
    "status": "ACCEPT",
    "eventID": "2e361780-2d0c-481d-b541-fbe646521052",
    "eventName": "Sự kiện 10 năm thành lập FBT",
    "createBy": "332767d3-b77e-49ec-a595-b8c77f5d53f2",
    "createAt": "2023-10-24T14:47:26.000Z",
    "approveBy": "568c4cd7-4f68-46b7-bcc4-90ac9f11740e",
    "approveDate": "2023-10-24T17:24:12.000Z",
    "urlImage": "url image hóa đơn 1",
    "supplier": "Saigon LED 1",
    "description": "Thuê sảnh từ 8h00 - 12h00 ",
    "userName": "test"
  },
]

const ConfirmedBudget = () => {
  const [editingRowKey, setEditingRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setdata] = useState(dummyData);

  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const handleTableChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setSortedInfo({ columnKey: field, order });
  };

  const onCancelEditing = () => {
    setEditingRowKey("");
  };
  const onSaveEditing = () => {
    form.submit();
  };
  const onEditing = (record) => {
    form.setFieldsValue({
      budgetName: "",
      description: "",
      estExpense: "",
      realExpense: "",
      status: "",
      ...record,
    });
    setEditingRowKey(record.key);
  };

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
      title: "Ngày tạo",
      // dataIndex: "realExpense",
      // key: "realExpense",
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
            {record.status === 1 ? "Đã duyệt" : "Từ chối"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 150,
      align: "center",
      render: (_, record) => {
        const editable = checkEditing(record);
        return (
          data.length > 0 && (
            <div className="flex flex-col items-center">
              {editable ? (
                <Space size={"middle"}>
                  <Button type="primary" size="small" onClick={onSaveEditing}>
                    Xác nhận
                  </Button>
                  <Popconfirm
                    title="Hủy việc cập nhật ?"
                    onConfirm={onCancelEditing}
                    okText="OK"
                    cancelText="Không"
                  >
                    <Button danger size="small">
                      Hủy
                    </Button>
                  </Popconfirm>
                </Space>
              ) : (
                <BiEdit
                  className="cursor-pointer"
                  size={25}
                  onClick={() => {
                    onEditing(record);
                  }}
                />
              )}
            </div>
          )
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    // col = {title: 'Họ và tên', dataIndex: 'fullName', editTable: true}
    if (!col.editTable) return col;

    return {
      ...col,
      onCell: (record) => ({
        // Additional props
        record,

        // Old props
        title: col.title,
        dataIndex: col.dataIndex,

        //
        editing: checkEditing(record),
        inputType:
          col.dataIndex === "status"
            ? "selection"
            : col.dataIndex === "budgetName" || col.dataIndex === "description"
            ? "text"
            : "number",
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "text" ? (
        <Input size="small" allowClear />
      ) : inputType === "number" ? (
        <InputNumber size="small" allowClear />
      ) : (
        <Select
          onChange={(value) => {
            console.log("dataIndex: ", dataIndex);
            console.log("value: ", value);
            form.setFieldsValue({ [dataIndex]: value });
            if (dataIndex === "role") form.resetFields(["divisionName"]);
          }}
          // options={options}
          size="small"
        />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            className="m-0"
            name={dataIndex}
            rules={[
              (inputType === "text" || inputType === "selection") && {
                required: true,
                message: `Chưa nhập dữ liệu !`,
              },
              inputType === "number" && {
                required: true,
                message: `Chưa nhập dữ liệu !`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <Fragment>
      {contextHolder}
      <div className="w-full bg-[#F0F6FF] p-8 rounded-xl">
        <Form form={form} onFinish={onFinish} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            columns={mergedColumns}
            dataSource={data}
            onChange={handleTableChange}
            pagination={false}
          />
        </Form>
      </div>
    </Fragment>
  );
};

export default ConfirmedBudget;
