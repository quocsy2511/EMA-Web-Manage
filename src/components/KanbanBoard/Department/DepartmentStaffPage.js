import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import {
  getAllUser,
  getRoles,
  updateStatusUser,
  updateUser,
} from "../../../apis/users";
import moment from "moment";
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
import { BsSearch } from "react-icons/bs";
import Highlighter from "react-highlight-words";
import { PiNotePencilBold, PiTrash } from "react-icons/pi";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import CreateUserDrawer from "../../Drawer/CreateUserDrawer";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import clsx from "clsx";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";

const DepartmentStaffPage = () => {
  const [page, setPage] = useState(1);
  const divisionId = useRouteLoaderData("staff").divisionID;
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState("");
  const [editingRowKey, setEditingRowKey] = useState("");
  const [filteredData, setFilteredData] = useState();
  const [showDrawer, setShowDrawer] = useState(false);
  const { data, isError, isLoading } = useQuery(
    ["users", page],
    () =>
      getAllUser({
        divisionId,
        pageSize: 7,
        currentPage: page,
        role: "Nhân Viên",
      }),
    {
      select: (data) => {
        data.data = data?.data.map((item) => {
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
  // console.log("🚀 ~ DepartmentStaffPage ~ users:", data);

  const {
    data: roleEmployee,
    isLoading: rolesIsLoading,
    isError: rolesIsError,
  } = useQuery(["roles-Employee"], getRoles, {
    select: (data) => {
      const findRole = data?.find((role) => role?.roleName === "Nhân Viên");
      return findRole;
    },
    refetchOnWindowFocus: false,
  });

  const handleTableChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setSortedInfo({ columnKey: field, order });
    setFilteredInfo(filter);
  };

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
  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  const onCancelEditing = () => {
    setEditingRowKey("");
  };
  const onSaveEditing = () => {
    form.submit();
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

      message.open({
        type: "success",
        content: "Cập nhật trạng thái thành công",
      });
    },
    onError: () => {
      message.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const handleDeleteAction = (record) => {
    // console.log("🚀 ~ handleDeleteAction ~ record:", record);
    updateUserStatusMutate({ userId: record?.id, status: "INACTIVE" });
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

  const { mutate, isLoading: updateUserIsLoading } = useMutation(
    (user) => updateUser(user),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", page]);
        onCancelEditing();
        message.open({
          type: "success",
          content: "Cập nhật thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );
  const onFinish = (values) => {
    // console.log("Success:", values);
    const userId = form.getFieldValue("id");
    const avatar = form.getFieldValue("avatar");
    const { role, ...data } = values;

    const updateData = {
      ...data,
      userId,
      avatar,
      divisionId,
      roleId: roleEmployee?.id,
    };
    // console.log("🚀 ~ onFinish ~ updateData:", updateData);
    mutate(updateData);
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
      render: (_, record) => <p>{moment(record.dob).format("DD-MM-YYYY")}</p>,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
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
    let options;
    switch (dataIndex) {
      case "status":
        options = [
          { value: "ACTIVE", label: "kích hoạt" },
          { value: "INACTIVE", label: "vô hiệu" },
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
        <Input size="small" allowClear />
      ) : inputType === "date" ? (
        <ConfigProvider locale={viVN}>
          <DatePicker
            defaultValue={dayjs(record?.dob,)}
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
            form.setFieldsValue({ [dataIndex]: value });
            if (dataIndex === "role") form.resetFields(["divisionName"]);
          }}
          options={options}
          size="small"
          // defaultValue={}
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
              inputType === "date" && {
                validator: (rule, value) => {
                  if (value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Chưa chọn ngày !");
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

  useEffect(() => {
    document.title = "Trang quản lí nhân sự";
  }, []);

  return (
    <>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-8">
        <div className="bg-white min-h rounded-xl p-8">
          <p className="text-2xl font-medium mb-5">Quản lý nhân sự</p>
          {!isLoading ? (
            isError ? (
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

                    {page !== 1 && page !== 2 ? (
                      <div>. . .</div>
                    ) : (
                      <div
                        className={clsx(
                          "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                          { "border-slate-300": page !== 2 },
                          { "border-blue-500 text-blue-500": page === 2 }
                        )}
                        onClick={() => setPage(2)}
                      >
                        2
                      </div>
                    )}

                    {page !== 1 &&
                      page !== 2 &&
                      page !== data?.lastPage &&
                      page !== data?.lastPage - 1 && (
                        <div
                          className={clsx(
                            "px-4 py-2 border rounded-md text-base font-medium cursor-default",
                            { "border-slate-300": page !== page },
                            {
                              "border-blue-500 text-blue-500": page === page,
                            }
                          )}
                        >
                          {page}
                        </div>
                      )}

                    {data?.lastPage > 3 && (
                      <>
                        {page !== data?.lastPage &&
                        page !== data?.lastPage - 1 ? (
                          <div>. . .</div>
                        ) : (
                          <div
                            className={clsx(
                              "px-4 py-2 border rounded-md text-base font-medium cursor-pointer",
                              {
                                "border-slate-300": page !== data?.lastPage - 1,
                              },
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
                      </>
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
    </>
  );
};

export default DepartmentStaffPage;
