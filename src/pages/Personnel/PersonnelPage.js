import {
  Avatar,
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
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import { getAllDivision, getAllUser } from "../../apis/users";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import moment from "moment";

const PersonnelPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(
    ["users", page],
    () => getAllUser({ pageSize: 10, currentPage: page }),
    {
      select: (data) => {
        data.data.result.data = data.data.result.data.map(({ ...item }) => {
          item.dob = moment(item.dob).format("YYYY-MM-DD");
          return {
            key: item.id,
            ...item,
          };
        });
        return data.data.result;
      },
    }
  );
  console.log("userData: ", data);

  const { data: divisionsData, isLoading: divisionsIsLoading } = useQuery(
    ["division"],
    () => getAllDivision({ pageSize: 20, currentPage: 1 }),
    {
      select: (data) =>
        data.data.result.data.filter((division) => division.status === 1),
    }
  );
  console.log("divisionsData: ", divisionsData);

  const [editingRowKey, setEditingRowKey] = useState(""); // Tracking which row is editing - contain key of selected row
  const [sortedInfo, setSortedInfo] = useState({}); // Tracking which field (col) is being sorted - contain columnKey and order (asc/desc)
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState(""); // Tracking which col is being searched

  const [filteredData, setFilteredData] = useState(); // Contain the global data after search

  const [form] = Form.useForm();

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

  // Handle delete 1 record
  const handleDeleteAction = (record) => {
    // record : whole data of 1 selected row
    // setData((prev) => prev.filter((item) => item.id !== record.id));
  };

  const handleTableChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setSortedInfo({ columnKey: field, order });

    setFilteredInfo(filter);
  };

  const searchGlobal = () => {
    if (searchText) {
      const filterSearchedData = data.data.filter((value) =>
        value.fullName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filterSearchedData);
    }
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
  // Editing mode
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
            className="text-red-700 hover:text-red-700"
            type="link"
            size="small"
            danger
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
  // address - gender - nationalId

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 160,
      editTable: true,
      ...getColumnSearchProps("fullName"),
      filteredValue: null,
      render: (_, record) => {
        return (
          <div className="flex items-center gap-x-3">
            <Avatar src={record.avatar} alt="avatar" />
            <p className="text-sm">{record.fullName}</p>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 160,
      ...getColumnSearchProps("email"),
      filteredValue: null,
    },
    {
      title: "CMND",
      dataIndex: "nationalId",
      key: "nationalId",
      width: 120,
      editTable: true,
      filteredValue: null,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 200,
      editTable: true,
      filteredValue: null,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 100,
      editTable: true,
      filteredValue: null,
      align: "center",
      render: (_, record) => (
        <p className="text-center">{record.phoneNumber}</p>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 90,
      editTable: true,
      filteredValue: null,
      align: "center",
      render: (_, record) => <p>{record.dob}</p>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 80,
      filteredValue: null,
      align: "center",
      render: (_, record) => <p>{record.gender === "MALE" ? "Nam" : "Nữ"}</p>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 80,
      editTable: true,
      filters: [
        { text: "Nhân viên", value: "EMPLOYEE" },
        { text: "Trưởng phòng", value: "STAFF" },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role?.includes(value),
      align: "center",
      render: (_, record) => (
        <p className="text-base">
          {record.role === "STAFF" ? "Trưởng phòng" : "Nhân viên"}
        </p>
      ),
    },
    {
      title: "Bộ phận",
      dataIndex: "divisionName",
      key: "divisionName",
      width: 100,
      editTable: true,
      filters: [
        { text: "Hậu Cần", value: "Hậu Cần" },
        { text: "Kế Toán", value: "Kế Toán" },
      ],
      filteredValue: filteredInfo.divisionName || null,
      onFilter: (value, record) => record.divisionName?.includes(value),
      render: (_, record) => (
        <p className={`text-base ${!record.divisionName && "text-red-400"}`}>
          {record.divisionName ? record.divisionName : "Chưa phân quyền"}
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 70,
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
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === "ACTIVE" ? "green" : "volcano"}
            key={record.id}
          >
            {record.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
      width: 80,
      align: "center",
      filteredValue: null,
      fixed: "right",
      render: (_, record) => {
        // checkEditing is a method to check if we are editing this row or not to rendr save-cancel button
        const editable = checkEditing(record);

        return (
          data.data.length >= 1 && (
            <div className="flex items-center justify-center">
              {editable ? (
                <Space size="middle">
                  <MdOutlineSave
                    className=" cursor-pointer"
                    size={25}
                    onClick={() => onSaveEditing(record.key)}
                  />
                  <Popconfirm
                    title="Hủy việc cập nhật ?"
                    onConfirm={() => onCancelEditing(record)}
                    okText="OK"
                    cancelText="Hủy"
                  >
                    <MdOutlineCancel
                      className="text-red-700 cursor-pointer"
                      size={25}
                    />
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
                    okText="Có"
                    cancelText="Hủy"
                    okButtonProps={
                      {
                        // loading: confirmLoading,
                      }
                    }
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

    const options =
      dataIndex === "role"
        ? [
            { value: "STAFF", label: "Trường phòng" },
            { value: "EMPLOYEE", label: "Nhân viên" },
          ]
        : dataIndex === "divisionName"
        ? divisionsData.map((division) => ({
            value: division.id,
            label: division.divisionName,
          })) /*dataDivision*/
        : [
            { value: "ACTIVE", label: "kích hoạt" },
            { value: "INACTIVE", label: "vô hiệu" },
          ];

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
          options={options}
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
        <div className="bg-white min-h rounded-xl p-8">
          <p className="text-2xl font-medium mb-5">Quản lý nhân sự</p>
          <div className="flex gap-x-4 mb-8">
            <Input
              className="w-[30%]"
              placeholder="Tìm kiếm theo tên"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value === "") {
                  // loadData()
                  setFilteredData();
                }
              }}
              onPressEnter={searchGlobal}
            />
            <Button type="primary" onClick={searchGlobal}>
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
          {!isLoading && !divisionsIsLoading ? (
            <>
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
                    filteredData /* && filteredData.length*/
                      ? filteredData
                      : data.data
                  }
                  onChange={handleTableChange}
                  pagination={false}
                  scroll={{
                    x: "150%",
                    // y: "100%",
                    scrollToFirstRowOnChange: true,
                  }}
                />
              </Form>
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-x-3">
                  <MdOutlineKeyboardArrowLeft
                    className={`text-slate-500 ${
                      data.prevPage
                        ? "cursor-pointer hover:text-blue-600"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => data.prevPage && setPage((prev) => prev - 1)}
                    size={25}
                  />
                  <div className="px-4 py-2 border border-slate-300 rounded-md text-base font-medium cursor-default">
                    {page}
                  </div>
                  <MdOutlineKeyboardArrowRight
                    className={`text-slate-500 ${
                      data.nextPage
                        ? "cursor-pointer hover:text-blue-600"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => data.nextPage && setPage((prev) => prev + 1)}
                    size={25}
                  />
                </div>
              </div>
            </>
          ) : (
            <LoadingComponentIndicator />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default PersonnelPage;
