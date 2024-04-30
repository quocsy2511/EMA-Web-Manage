import React, { Fragment, useEffect, useState } from "react";
import {
  getAllUser,
  getRoles,
  updateStatusUser,
  updateUser,
} from "../../apis/users";
import { getAllDivision } from "../../apis/divisions";
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
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PiTrash, PiNotePencilBold } from "react-icons/pi";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import { BsSearch } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Highlighter from "react-highlight-words";
import moment from "moment";
import TEXT from "../../constants/string";
import clsx from "clsx";
import CreateUserDrawer from "../../components/Drawer/CreateUserDrawer";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";

const ManagerPersonnelPage = () => {
  const [page, setPage] = useState(1);
  const [divisionMode, setDivisionMode] = useState(1);

  useEffect(() => {
    document.title = "Trang nhân sự";
  }, []);

  const { data, isLoading, isError } = useQuery(
    ["users", page],
    () => getAllUser({ pageSize: 10, currentPage: page }),
    {
      select: (data) => {
        data.data = data?.data.map((item) => {
          if (item.dob) item.dob = moment(item?.dob).format("YYYY-MM-DD");
          return {
            key: item?.id,
            ...item,
          };
        });
        return data;
      },
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: divisionsData,
    isLoading: divisionsIsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["divisions", 1],
    () => getAllDivision({ pageSize: 20, currentPage: 1, mode: 1 }),
    {
      select: (data) => data?.filter((division) => division?.status),
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: divisionsWithoutStaff,
    isLoading: divisionsWithoutStaffIsLoading,
    isError: divisionsWithoutStaffIsError,
  } = useQuery(
    ["divisions", 2],
    () => getAllDivision({ pageSize: 20, currentPage: 1, mode: 2 }),
    {
      select: (data) => data?.filter((division) => division?.status),
      refetchOnWindowFocus: false,
    }
  );

  const { data: roles } = useQuery(["roles"], getRoles, {
    select: (data) => {
      return data
        ?.map((role) => ({
          value: role?.id,
          label: role?.roleName,
        }))
        .filter(
          (item) =>
            item?.label !== TEXT.ADMINISTRATOR &&
            item?.label !== TEXT.CUSTOMER &&
            item?.label !== TEXT.MANAGER
        );
    },
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading: updateUserIsLoading } = useMutation(
    (user) => updateUser(user),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", page]);
        onCancelEditing();
        messageApi.open({
          type: "success",
          content: "Cập nhật thành công",
        });
      },
      onError: (error) => {
        onCancelEditing();
        messageApi.open({
          type: "error",
          content:
            error?.response?.status === 500
              ? error?.response?.data?.message ??
                "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau"
              : "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );
  const {
    mutate: updateUserStatusMutate,
    isLoading: updateUserStatusIsLoading,
  } = useMutation((user) => updateStatusUser(user), {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["users", page], (oldValue) => {
        const updateOldData = oldValue?.data?.map((item) => {
          if (item.id === variables.userId)
            return { ...item, status: variables.status };
          return item;
        });
        oldValue = { ...oldValue, data: updateOldData };

        return oldValue;
      });

      messageApi.open({
        type: "success",
        content: "Cập nhật trạng thái thành công",
      });
    },
    onError: (error) => {
      onCancelEditing();
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const [editingRowKey, setEditingRowKey] = useState(""); // Tracking which row is editing - contain key of selected row
  const [sortedInfo, setSortedInfo] = useState({}); // Tracking which field (col) is being sorted - contain columnKey and order (asc/desc)
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState(""); // Tracking which col is being searched
  const [showDrawer, setShowDrawer] = useState(false);

  const [filteredData, setFilteredData] = useState(); // Contain the global data after search

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Check if the row is editing or not
  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  // Submit form
  const onFinish = (values) => {
    const userId = form.getFieldValue("id");
    const avatar = form.getFieldValue("avatar");

    const dataDivisionForm = form.getFieldValue("divisionName");

    const divisionId = divisionsData?.filter((item) => {
      if (
        dataDivisionForm === item?.id ||
        dataDivisionForm === item?.divisionName
      ) {
        return item;
      }
    })[0].id;

    const tranformValues = {
      ...values,
      userId,
      avatar,
      divisionId,
      roleId: values?.roleId,
    };
    const { divisionName, role, ...payload } = tranformValues;

    mutate(payload);
  };

  // Handle delete 1 record
  const handleDeleteAction = (record) => {
    updateUserStatusMutate({ userId: record?.id, status: "INACTIVE" });
  };

  const handleTableChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setSortedInfo({ columnKey: field, order });
    setFilteredInfo(filter);
  };

  const searchGlobal = () => {
    if (searchText) {
      const filterSearchedData = data?.data?.filter(
        (value) =>
          value?.fullName?.toLowerCase().includes(searchText?.toLowerCase()) ||
          value?.email?.toLowerCase().includes(searchText?.toLowerCase()) ||
          value?.phoneNumber?.includes(searchText?.toLowerCase())
      );
      setFilteredData(filterSearchedData);
    }
  };

  const handleResetTable = () => {
    setSortedInfo({});
    setFilteredInfo({});
    setSearchText("");
  };

  //  =========================================================================
  const onCancelEditing = () => {
    setEditingRowKey("");
  };
  const onSaveEditing = () => {
    form.submit();
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
      dataIndex: "avatar123",
      key: "avatar123",
      width: 0,
      align: "center",
      fixed: "left",
      render: (_, record) => {
        if (!record?.avatar123) return;

        return <Avatar src={record?.avatar123} />;
      },
    },
    {
      // title: "Họ và tên",
      dataIndex: "avatar",
      key: "avatar",
      width: 50,
      align: "center",
      fixed: "left",
      render: (_, record) => <Avatar src={record?.avatar} />,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 160,
      editTable: true,
      ...getColumnSearchProps("fullName"),
      filteredValue: null,
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 160,
      editTable: true,
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
        <p className="text-center">{record?.phoneNumber}</p>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 120,
      editTable: true,
      filteredValue: null,
      align: "center",
      render: (_, record) => (
        <p>
          {record?.dob ? (
            moment(record?.dob, "YYYY-MM-DD").format("DD-MM-YYYY")
          ) : (
            <Tag />
          )}
        </p>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      editTable: true,
      filteredValue: null,
      align: "center",
      render: (_, record) => <p>{record.gender === "MALE" ? "Nam" : "Nữ"}</p>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 150,
      editTable: true,
      filters: roles?.map((role) => ({
        text: role?.label,
        value: role?.label,
      })),
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role?.includes(value),
      align: "center",
      render: (_, record) => <p className="text-base">{record?.role}</p>,
    },
    {
      title: "Loại",
      dataIndex: "typeEmployee",
      key: "typeEmployee",
      width: 100,
      editTable: true,
      filters: [
        { text: "Toàn thời gian", value: "FULL_TIME" },
        { text: "Bán thời gian", value: "PART_TIME" },
      ],
      filteredValue: filteredInfo.typeEmployee || null,
      onFilter: (value, record) => record?.typeEmployee?.includes(value),
      align: "center",
      render: (_, record) => (
        <Tag
          color={
            record?.typeEmployee === "FULL_TIME"
              ? "cyan"
              : record?.typeEmployee === "PART_TIME" && "orange"
          }
        >
          {record?.typeEmployee === "FULL_TIME"
            ? "Toàn thời gian"
            : record?.typeEmployee === "PART_TIME" && "Bán thời gian"}
        </Tag>
      ),
    },
    {
      title: "Bộ phận",
      dataIndex: "divisionName",
      key: "divisionName",
      width: 150,
      editTable: true,
      filters:
        divisionsData?.map((division) => ({
          text: division?.divisionName,
          value: division?.id,
        })) ?? [],
      filteredValue: filteredInfo?.divisionName || null,
      onFilter: (value, record) => {
        return record?.divisionId === value;
      },
      render: (_, record) => (
        <p className={`text-base ${!record.divisionName && "text-red-400"}`}>
          {record.divisionName ?? <Tag />}
        </p>
      ),
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
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
            {record.status === "ACTIVE" ? "Kích hoạt" : "Vô hiệu"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
      width: 120,
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
                  <Button
                    loading={updateUserIsLoading}
                    type="primary"
                    size="small"
                    onClick={onSaveEditing}
                  >
                    Cập nhật
                  </Button>
                  <Popconfirm
                    title="Hủy việc cập nhật ?"
                    onConfirm={onCancelEditing}
                    okText="OK"
                    cancelText="Không"
                  >
                    {/* <MdOutlineCancel
                      className="text-red-700 cursor-pointer"
                      size={25}
                    /> */}
                    <Button danger size="small">
                      Hủy
                    </Button>
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
                    title="Bạn đang vô hiệu tài khoản này?"
                    onConfirm={() => handleDeleteAction(record)}
                    okText="Có"
                    cancelText="Hủy"
                    okButtonProps={{
                      loading: updateUserStatusIsLoading,
                    }}
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
              col.dataIndex === "status" ||
              col.dataIndex === "gender" ||
              col.dataIndex === "typeEmployee"
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
    const role = roles?.find(
      (role) =>
        role?.value === form.getFieldValue("role") ||
        role?.label === form.getFieldValue("role")
    );

    setDivisionMode(role?.label === TEXT.STAFF ? 2 : 1);

    let options;
    switch (dataIndex) {
      case "role":
        options = roles ?? [];
        break;
      case "divisionName":
        options =
          divisionMode === 1
            ? divisionsData?.map((division) => ({
                value: division?.id,
                label: division?.divisionName,
              }))
            : divisionsWithoutStaff?.map((division) => ({
                value: division?.id,
                label: division?.divisionName,
              }));
        break;
      case "status":
        options = [
          { value: "ACTIVE", label: "Kích hoạt" },
          { value: "INACTIVE", label: "Vô hiệu" },
        ];
        break;
      case "gender":
        options = [
          { value: "MALE", label: "Nam" },
          { value: "FEMALE", label: "Nữ" },
        ];
        break;
      case "typeEmployee":
        options = [
          { value: "FULL_TIME", label: "Toàn thời gian" },
          { value: "PART_TIME", label: "Bán thời gian" },
        ];
        break;

      default:
        options = [];
        break;
    }
    // Input field type
    const inputNode =
      inputType === "text" ? (
        <Input
          size="small"
          allowClear
          maxLength={dataIndex === "nationalId" && 12}
        />
      ) : inputType === "date" ? (
        <ConfigProvider locale={viVN}>
          <DatePicker
            defaultValue={dayjs(record?.dob, "YYYY-MM-DD")}
            onChange={(value) => {
              const formattedDate = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              form.setFieldsValue({ [dataIndex]: formattedDate });
            }}
            size="small"
            format={"DD-MM-YYYY"}
          />
        </ConfigProvider>
      ) : (
        <Select
          onChange={(value) => {
            if (dataIndex === "role") {
              form.resetFields(["divisionName"]);
              form.setFieldsValue({ roleId: value });
            } else {
              form.setFieldsValue({ [dataIndex]: value });
            }
          }}
          options={options}
          size="small"
          // defaultValue={}
        />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <>
            <div className="h-0 d-none">
              <Form.Item name="roleId" className="h-0 d-none" />
            </div>
            <Form.Item
              className="m-0"
              name={dataIndex}
              rules={[
                (inputType === "text" || inputType === "selection") && {
                  required: true,
                  message: `Chưa nhập dữ liệu !`,
                },
                inputType === "date" && {
                  validator: (rule, value) => {
                    if (value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Chưa chọn ngày !");
                  },
                },
                dataIndex === "nationalId" && {
                  pattern: /^[0-9]{12}$/,
                  message: "CCCD / CMND cần bao gồm 12 số!",
                },
              ]}
            >
              {inputNode}
            </Form.Item>
          </>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <Fragment>
      {contextHolder}
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-8">
        <div className="bg-white min-h rounded-xl p-8">
          <p className="text-2xl font-medium mb-5">Quản lý nhân sự</p>
          {!isLoading &&
          !divisionsIsLoading &&
          !divisionsWithoutStaffIsLoading ? (
            isError || divisionsIsError || divisionsWithoutStaffIsError ? (
              <div className="min-h-[calc(100vh-64px-12rem)]">
                <AnErrorHasOccured />
              </div>
            ) : (
              <>
                <div className="flex gap-x-4 mb-8">
                  <Input
                    className="w-[30%]"
                    placeholder="Tìm kiếm theo tên, email, sđt"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      if (e.target.value === "") {
                        setFilteredData();
                      }
                    }}
                    onPressEnter={searchGlobal}
                  />
                  <Button type="primary" onClick={searchGlobal}>
                    Tìm kiếm
                  </Button>
                  {/* <Button danger onClick={handleResetTable}>
                    Đặt lại
                  </Button> */}
                  <div className="flex-1 text-end">
                    <Button
                      type="primary"
                      className=""
                      onClick={() => setShowDrawer(true)}
                    >
                      Thêm nhân viên
                    </Button>
                    <CreateUserDrawer
                      showDrawer={showDrawer}
                      setShowDrawer={setShowDrawer}
                      page={page}
                    />
                  </div>
                </div>
                <Form form={form} onFinish={onFinish} component={false}>
                  <Table
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    columns={mergedColumns}
                    dataSource={filteredData ? filteredData : data.data}
                    onChange={handleTableChange}
                    pagination={false}
                    scroll={{
                      x: "150%",
                      scrollToFirstRowOnChange: true,
                    }}
                  />
                </Form>
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-x-3">
                    <MdOutlineKeyboardArrowLeft
                      className={`text-slate-500 ${
                        data?.prevPage
                          ? "cursor-pointer hover:text-blue-600"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() =>
                        data?.prevPage && setPage((prev) => prev - 1)
                      }
                      size={25}
                    />

                    <div
                      className={clsx(
                        "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                        { "border-slate-300": page !== 1 },
                        {
                          "border-blue-500 text-blue-500": page === 1,
                        }
                      )}
                      onClick={() => setPage(1)}
                    >
                      1
                    </div>

                    {page !== 1 && page !== 2 && <div>. . .</div>}

                    {page === 2 && (
                      <div
                        className={clsx(
                          "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                          { "border-slate-300": page !== 2 },
                          {
                            "border-blue-500 text-blue-500": page === 2,
                          }
                        )}
                        onClick={() => setPage(2)}
                      >
                        2
                      </div>
                    )}

                    {page - 1 !== 1 && page - 1 !== 0 && (
                      <div
                        className={clsx(
                          "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                          { "border-slate-300": page !== page - 1 },
                          {
                            "border-blue-500 text-blue-500": page === page - 1,
                          }
                        )}
                        onClick={() => setPage(page - 1)}
                      >
                        {page - 1}
                      </div>
                    )}

                    {page !== 1 &&
                      page !== 2 &&
                      page !== data?.lastPage &&
                      page !== data?.lastPage - 1 && (
                        <div
                          className={clsx(
                            "px-4 py-2 border rounded-md text-base font-medium cursor-point",
                            { "border-slate-300": page !== page },
                            {
                              "border-blue-500 text-blue-500": page === page,
                            }
                          )}
                        >
                          {page}
                        </div>
                      )}

                    {page + 1 !== data?.lastPage &&
                      page + 1 !== data?.lastPage + 1 && (
                        <div
                          className={clsx(
                            "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                            { "border-slate-300": page !== page + 1 },
                            {
                              "border-blue-500 text-blue-500":
                                page === page + 1,
                            }
                          )}
                          onClick={() => setPage(page + 1)}
                        >
                          {page + 1}
                        </div>
                      )}

                    {page === data?.lastPage - 1 && (
                      <div
                        className={clsx(
                          "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                          { "border-slate-300": page !== data?.lastPage - 1 },
                          {
                            "border-blue-500 text-blue-500":
                              page === data?.lastPage - 1,
                          }
                        )}
                        onClick={() => setPage(data?.lastPage - 1)}
                      >
                        {data?.lastPage - 1}
                      </div>
                    )}

                    {page !== data?.lastPage && page !== data?.lastPage - 1 && (
                      <div>. . .</div>
                    )}

                    <div
                      className={clsx(
                        "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                        { "border-slate-300": page !== data?.lastPage },
                        {
                          "border-blue-500 text-blue-500":
                            page === data?.lastPage,
                        }
                      )}
                      onClick={() => setPage(data?.lastPage)}
                    >
                      {data?.lastPage}
                    </div>

                    <MdOutlineKeyboardArrowRight
                      className={`text-slate-500 ${
                        data.nextPage
                          ? "cursor-pointer hover:text-blue-600"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() =>
                        data.nextPage && setPage((prev) => prev + 1)
                      }
                      size={25}
                    />
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="min-h-[calc(100vh-64px-12rem)] flex items-center">
              <LoadingComponentIndicator />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ManagerPersonnelPage;
