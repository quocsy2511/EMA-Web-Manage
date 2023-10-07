import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import React, { Fragment, useState } from "react";
import { PiTrash, PiNotePencilBold } from "react-icons/pi";
import { MdOutlineCancel, MdOutlineSave } from "react-icons/md";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import { BsSearch } from "react-icons/bs";
import Highlighter from "react-highlight-words";

// Transform id to key
const dummydata = [
  {
    role: "EMPLOYEE",
    id: "392467bc-ee9c-417c-81d7-a56cf46100a8",
    fullName: "Felix Dietrich",
    email: "Marjolaine.Hayes@hotmail.com",
    phoneNumber: "+84 06918521",
    dob: "2024-06-18",
    nationalId: "111",
    gender: "MALE",
    address: "Nat Mount",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "4141e970-a0ea-49ac-b80c-1761dc93d914",
    fullName: "Dr. Elizabeth Breitenberg",
    email: "Rupert61@hotmail.com",
    phoneNumber: "463-652-1609 x968",
    dob: "2023-03-22T03:17:55.000Z",
    nationalId: "111",
    gender: "MALE",
    address: "Kshlerin Drives",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "570bafd2-d8ef-4b7a-a3c7-6c0f9248178d",
    fullName: "Crystal Wisoky",
    email: "Pearlie.Hills27@hotmail.com",
    phoneNumber: "1-336-664-4911 x0906",
    dob: "2024-03-10T09:03:29.000Z",
    nationalId: "111",
    gender: "FEMALE",
    address: "Predovic Cliffs",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "7d989b9d-439e-4a7f-aba2-6e70f9c9767e",
    fullName: "Maria Padberg Jr.",
    email: "Stephanie25@yahoo.com",
    phoneNumber: "(504) 863-3147 x900",
    dob: "2024-04-27T09:37:38.000Z",
    nationalId: "111",
    gender: "FEMALE",
    address: "Garrick Shore",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "826e9918-7856-4e96-a3c9-11e7f206726d",
    fullName: "Sergio Ullrich",
    email: "Marlee_Nader@hotmail.com",
    phoneNumber: "509-618-1376 x69058",
    dob: "2024-03-30T17:31:37.000Z",
    nationalId: "111",
    gender: "MALE",
    address: "Harber Centers",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "INACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "914c15d4-2a0b-4f50-a9ee-b2d040547aac",
    fullName: "Terence Thiel III",
    email: "Sage3@yahoo.com",
    phoneNumber: "890.908.1164",
    dob: "2023-03-09T13:41:00.000Z",
    nationalId: "111",
    gender: "MALE",
    address: "Retha Heights",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "INACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "a0219a8d-918e-4c52-a7c5-511ce8ba6245",
    fullName: "Jake Kovacek",
    email: "Leland_Witting@yahoo.com",
    phoneNumber: "782.464.9571 x84098",
    dob: "2023-02-01T01:29:34.000Z",
    nationalId: "111",
    gender: "MALE",
    address: "Sanford Mews",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "b0022218-4161-47ea-84e1-af702db91470",
    fullName: "Edward Harber",
    email: "Emilie.Kshlerin68@hotmail.com",
    phoneNumber: "1-784-573-6688 x47195",
    dob: "2024-04-21T16:09:33.000Z",
    nationalId: "111",
    gender: "FEMALE",
    address: "Pfannerstill Path",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "EMPLOYEE",
    id: "c21eea62-8ca2-487e-8e28-1ebf53dad369",
    fullName: "Sean Keebler",
    email: "Mavis74@gmail.com",
    phoneNumber: "(706) 880-5882",
    dob: "2024-08-25T09:27:29.000Z",
    nationalId: "111",
    gender: "MALE",
    address: "Alek Wall",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "ACTIVE",
  },
  {
    role: "STAFF",
    id: "fca2d31f-9759-4673-bfbb-ed8d0e86150e",
    fullName: "Orlando Grant",
    email: "Lura.Wilderman@hotmail.com",
    phoneNumber: "(620) 593-4887 x393",
    dob: "2024-06-15T14:53:10.000Z",
    nationalId: "111",
    gender: "FEMALE",
    address: "O'Reilly Estates",
    avatar: "https://picsum.photos/200/300",
    divisionName: "Hậu Cần 1",
    status: "INACTIVE",
  },
];

const PersonnelPage = () => {
  const [data, setData] = useState(
    dummydata.map(({ ...item }) => ({ key: item.id, ...item }))
  );
  const [editingRowKey, setEditingRowKey] = useState(""); // Tracking which row is editing - contain key of selected row
  const [sortedInfo, setSortedInfo] = useState({}); // Tracking which field (col) is being sorted - contain columnKey and order (asc/desc)
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState(""); // Tracking which col is being searched

  let [filteredData] = useState(); // Contain the global data after search

  const [form] = Form.useForm();

  // Handle delete 1 record
  const handleDeleteAction = (record) => {
    // record : whole data of 1 selected row
    setData((prev) => prev.filter((item) => item.id !== record.id));
  };

  // Check if the row is editing or not
  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  // Submit form
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleTableChange = (_, filter, sorter) => {
    console.log(sorter);
    console.log(filter);

    const { order, field } = sorter;
    setSortedInfo({ columnKey: field, order });

    setFilteredInfo(filter);
  };

  const handleResetTable = () => {
    setSortedInfo({});
    setFilteredInfo({});
    setSearchText("");

    // reset table by call api again
    // load()
  };

  //  =========================================================================

  const onCancelEditing = (record) => {
    setEditingRowKey("");
  };
  const onSaveEditing = async (recordKey) => {
    form.submit();
    // try {
    //   // Check if all validation is successful => return value of form data => row = { data-of-form }
    //   const row = await form.validateFields();
    //   console.log();
    //   // Get the existed data
    //   const newData = [...data];
    //   // Get the item that match the selectedKey / selectedRow
    //   const index = newData.findIndex((item) => recordKey === item.key);

    //   if (index > -1) {
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //       ...item,
    //       ...row,
    //     });
    //     setData(newData);
    //     setEditingRowKey("");
    //   } else {
    //     newData.push(row);
    //     setData(newData);
    //     setEditingRowKey("");
    //   }
    // } catch (error) {
    //   console.log("Validate Form Failed: ", error);
    // }
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

    // Specify which row is being edited
    setEditingRowKey(record.key);
  };

  //  =========================================================================

  //  =========================================================================

  const handleSearchCol = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchColText(selectedKeys[0]);
    setSearchedCol(dataIndex);
  };
  const handleResetCol = (clearFilters, selectedKeys, confirm, dataIndex) => {
    clearFilters();
    handleSearchCol(selectedKeys, confirm, dataIndex);
    setSearchColText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          className="mb-3 w-full block"
          placeholder={`Tìm theo ký tự ...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
        />
        <Space>
          <Button
            className=""
            type="primary"
            onClick={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
            size="small"
            icon={<BsSearch size={12} />}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() =>
              handleResetCol(clearFilters, selectedKeys, confirm, dataIndex)
            }
            size="small"
          >
            Reset
          </Button>
          <Button
            className="text-red-400 hover:text-red-400"
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Hủy
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => {
      return (
        <BsSearch
          className={`${filtered ? "text-blue-500" : undefined}`}
          size={15}
        />
      );
    },
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedCol === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchColText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //  =========================================================================

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 300,
      editTable: true,
      ...getColumnSearchProps("fullName"),
      filteredValue: null,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 260,
      ...getColumnSearchProps("email"),
      filteredValue: null,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 130,
      editTable: true,
      filteredValue: null,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 130,
      editTable: true,
      filteredValue: null,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      editTable: true,
      filters: [
        { text: "Nhân viên", value: "EMPLOYEE" },
        { text: "Trưởng phòng", value: "STAFF" },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role.includes(value),
    },
    {
      title: "Bộ phận",
      dataIndex: "divisionName",
      key: "divisionName",
      width: 130,
      editTable: true,
      filters: [
        { text: "Hậu cần", value: "1" },
        { text: "Kế toán", value: "2" },
      ],
      filteredValue: filteredInfo.divisionName || null,
      onFilter: (value, record) => record.divisionName.includes(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "auto",
      align: "center",
      editTable: true,
      filteredValue: null,
      sorter: (a, b) => {
        if (a.status === "ACTIVE" && b.status !== "ACTIVE") {
          return -1; // a should come before b
        }
        if (a.status !== "ACTIVE" && b.status === "ACTIVE") {
          return 1; // b should come before a
        }
        return 0; // no change in order
      },
      sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order, // Indicate order 'ascend' or 'descend'
      render: (_, record) => {
        return (
          <Tag
            className="mr-0 mx-auto"
            color={record.status === "ACTIVE" ? "green" : "volcano"}
            key={record.id}
          >
            {record.status}
          </Tag>
        );
      },
    },
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
      width: 110,
      align: "center",
      filteredValue: null,
      fixed: "right",
      render: (_, record) => {
        // checkEditing is a method to check if we are editing this row or not to rendr save-cancel button
        const editable = checkEditing(record);

        return (
          data.length >= 1 && (
            <div className="flex items-center justify-center">
              {editable ? (
                <Space size="middle">
                  <MdOutlineSave
                    className=" cursor-pointer"
                    size={25}
                    onClick={() => onSaveEditing(record.key)}
                  />
                  {/* <Button onClick={() => onSaveEditing(record.key)}>
                    Save
                  </Button> */}
                  <Popconfirm
                    title="Hủy việc cập nhật ?"
                    onConfirm={() => onCancelEditing(record)}
                  >
                    <MdOutlineCancel
                      className="text-red-700 cursor-pointer"
                      size={25}
                    />
                    {/* <Button>Cancel</Button> */}
                  </Popconfirm>
                </Space>
              ) : (
                <Space size="middle">
                  <PiNotePencilBold
                    className="text-[#624DE3] cursor-pointer"
                    size={25}
                    onClick={() => {
                      onEditing(record);
                    }}
                  />
                  <Popconfirm
                    title="Bạn có thực sự muốn xóa ?"
                    onConfirm={() => handleDeleteAction(record)}
                  >
                    <PiTrash
                      className="text-[#A30D11] cursor-pointer"
                      size={25}
                    />
                  </Popconfirm>
                </Space>
              )}
            </div>
          )
        );
      },
    },
  ];

  // To indicate which col can be edited
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
          col.dataIndex === "dob"
            ? "date"
            : col.dataIndex === "role" ||
              col.dataIndex === "divisionName" ||
              col.dataIndex === "status"
            ? "selection"
            : "text",
      }),
    };
  });

  // Handle render what in CELL in col in mergedColumns
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    children,
    ...restProps
  }) => {
    // Setup input field type

    // const options =
    //   dataIndex === "role"
    //     ? dataRole
    //     : dataIndex === "divisionName"
    //     ? dataDivision
    //     : [];

    // const loading = dataIndex === "role"
    //     ? loadingRole
    //     : dataIndex === "divisionName"
    //     ? loadingDivision
    //     : null;

    // Input field type
    const inputNode =
      inputType === "text" ? (
        <Input size="small" allowClear />
      ) : inputType === "date" ? (
        <ConfigProvider locale={viVN}>
          <DatePicker
            defaultValue={dayjs(record.dob)}
            onChange={(value) => {
              const formattedDate = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              form.setFieldsValue({ [dataIndex]: formattedDate });
            }}
            size="small"
          />
        </ConfigProvider>
      ) : (
        <Select
          defaultValue={dataIndex && record[dataIndex]}
          onChange={(value) => {
            form.setFieldsValue({ [dataIndex]: value });
          }}
          // loading={loading}
          // options={options}
          size="small"
        />
      );

    return (
      <td>
        {editing ? (
          <Form.Item
            className="m-0"
            name={dataIndex}
            rules={[
              (inputType === "text" || inputType === "selection") && {
                required: true,
                message: `Nhập dữ liệu đi!`,
              },
              inputType === "date" && {
                validator: (rule, value) => {
                  if (value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Chọn 1 ngày đi");
                },
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
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-8">
        <div className="bg-white min-h rounded-xl p-5">
          <div className="flex gap-x-4 mb-5">
            <Input
              className="w-[30%]"
              placeholder="Tìm kiếm theo tên"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value === "") {
                  // loadData()
                }
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                // Logic for filtering the data globally
                filteredData = data.filter((value) =>
                  value.fullName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                );
                setData(filteredData);
              }}
            >
              Tìm kiếm
            </Button>
            <Button danger onClick={handleResetTable}>
              Đặt lại
            </Button>
            <div className="flex-1 text-end">
              <Button type="primary" className="">
                Thêm nhân viên
              </Button>
            </div>
          </div>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            component={false}
          >
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={mergedColumns}
              dataSource={
                filteredData && filteredData.length ? filteredData : data
              }
              onChange={handleTableChange}
              bordered
              pagination={false}
              scroll={{
                x: "150%",
                // y: 500,
                scrollToFirstRowOnChange: true,
              }}
              // loading
              // pagination={{
              //   onChange: cancel,
              // }}
            />
          </Form>
        </div>
      </div>
    </Fragment>
  );
};

export default PersonnelPage;
