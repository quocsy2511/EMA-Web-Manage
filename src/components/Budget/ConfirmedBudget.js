import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { getBudget, updateBudget, updateStatusBudget } from "../../apis/budget";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";
import emptyBudget from "../../assets/images/empty_budget.jpg";
import AnErrorHasOccured from "../Error/AnErrorHasOccured";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const ConfirmedBudget = ({ eventId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingRowKey, setEditingRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: budgets,
    isLoading: budgetsIsLoading,
    isError: budgetsIsError,
  } = useQuery(
    ["confirmed-budgets", eventId, currentPage, pageSize],
    () =>
      getBudget({
        eventID: eventId,
        pageSize: pageSize,
        currentPage: currentPage,
        mode: 2,
      }),
    {
      select: (data) => {
        data.data = data.data.map((item) => ({ ...item, key: item.id }));
        return data;
      },
    }
  );
  console.log("budgets: ", budgets);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((budget) => updateBudget(budget), {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["confirmed-budgets", eventId, currentPage, pageSize],
        (oldValue) => {
          const index = oldValue.data.findIndex(
            (item) => item.id === variables.budgetsId
          );
          console.log("index : ", index);
          oldValue.data[index] = {
            ...oldValue.data[index],
            budgetName: variables.budgetName,
            description: variables.description,
            estExpense: variables.estExpense,
            realExpense: variables.realExpense,
            supplier: variables.supplier,
            status: variables.status,
          };

          return oldValue;
        }
      );
      onCancelEditing();
      messageApi.open({
        type: "success",
        content: "Cập nhật sự kiện thành công.",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const { mutate: updateStatusMutate, isLoading: updateStatusIsLoading } =
    useMutation(
      ({ budgetsId, status, ...budget }) =>
        updateStatusBudget({ budgetsId, status }),
      {
        onSuccess: (data, variables) => {
          // const { status, ...budgetVariables } = variables;
          mutate(variables);
        },
        onError: (error) => {
          messageApi.open({
            type: "error",
            content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
          });
        },
      }
    );

  const onFinish = (values) => {
    console.log("Success:", values);

    const eventID = form.getFieldValue("eventID");
    const budgetsId = form.getFieldValue("id");
    const urlImage = form.getFieldValue("urlImage");

    values = {
      ...values,
      eventID,
      budgetsId,
      urlImage,
      estExpense: +values.estExpense,
      realExpense: +values.realExpense,
    };

    console.log("Transform data: ", values);

    // const { status, ...updatedBudget } = values;
    updateStatusMutate(values);
  };

  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  const searchGlobal = () => {
    if (searchText) {
      const filterSearchedData = data.data.filter(
        (value) =>
          value.budgetName.toLowerCase().includes(searchText.toLowerCase()) ||
          value.userName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filterSearchedData);
    }
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
      realExpense: `${record.realExpense}`,
      estExpense: `${record.estExpense}`,
    });
    setEditingRowKey(record.key);
  };

  const columns = [
    {
      title: "Tên thu chi",
      dataIndex: "budgetName",
      key: "budgetName",
      editTable: true,
      width: 180,
      fixed: "left",
      render: (_, record) => <p className="font-medium">{record.budgetName}</p>,
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
      align: "center",
      sorter: (a, b) => {
        return a.estExpense - b.estExpense;
      },
      sortOrder: sortedInfo.columnKey === "estExpense" && sortedInfo.order,
      render: (_, record) => <p>{record.estExpense.toLocaleString()} VNĐ</p>,
    },
    {
      title: "Thực chi",
      dataIndex: "realExpense",
      key: "realExpense",
      editTable: true,
      align: "center",
      sorter: (a, b) => {
        return a.realExpense - b.realExpense;
      },
      sortOrder: sortedInfo.columnKey === "realExpense" && sortedInfo.order,
      render: (_, record) => {
        if (!record.realExpense || record.realExpense === 0)
          return <p>Chưa có</p>;
        else return <p>{record.realExpense.toLocaleString()} VNĐ</p>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      editTable: true,
    },
    {
      title: "Hóa đơn",
      dataIndex: "urlImage",
      key: "urlImage",
      align: "center",
      render: (_, record) => {
        if (record.urlImage) return <Image width={100} src={record.urlImage} />;
        else return <p>Chưa có</p>;
      },
    },
    {
      title: "Người gửi",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (_, record) => (
        <p>{moment(record.createAt).format("DD/MM/YYYY")}</p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      editTable: true,
      align: "center",
      fixed: "right",
      sorter: (a, b) => {
        if (a.status === "ACCEPT" && b.status !== "ACCEPT") {
          return -1; // a should come before b
        }
        if (a.status !== "ACCEPT" && b.status === "ACCEPT") {
          return 1; // b should come before a
        }
        return 0; // no change in order
      },
      sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order,
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === "ACCEPT" ? "green" : "volcano"}
            key={record.id}
          >
            {record.status === "ACCEPT" ? "Chấp thuận" : "Từ chối"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "action",
      key: "action",
      align: "center",
      // width: 100,
      fixed: "right",
      render: (_, record) => {
        const editable = checkEditing(record);
        return (
          <div className="flex flex-col items-center">
            {editable ? (
              <Space size={"middle"}>
                <Button
                  loading={updateStatusIsLoading || isLoading}
                  type="primary"
                  size="small"
                  onClick={onSaveEditing}
                >
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
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editTable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        title: col.title,
        dataIndex: col.dataIndex,

        editing: checkEditing(record),
        inputType:
          col.dataIndex === "status"
            ? "selection"
            : col.dataIndex === "estExpense" || col.dataIndex === "realExpense"
            ? "number"
            : "text",
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
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => {
            form.setFieldsValue({
              [dataIndex]: value.replace(/,/g, ""),
            });
            return `${value}`.replace(/,/g, "");
          }}
          min={0}
          size="small"
          step={null}
        />
      ) : (
        <Select
          options={[
            { value: "ACCEPT", label: "Chấp thuận" },
            { value: "REJECT", label: "Từ chối" },
          ]}
          size="small"
        />
      );

    return (
      <td {...restProps}>
        {editing && dataIndex ? (
          <Form.Item
            className="m-0"
            name={dataIndex}
            rules={[
              (inputType === "text" || inputType === "selection") && {
                required: true,
                message: `Chưa nhập dữ liệu !`,
              },
              // record.estExpense  && {
              //   required: true,
              //   message: `Chưa nhập dữ liệu !`,
              // },
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

  if (budgetsIsLoading) return <LoadingComponentIndicator />;

  if (budgetsIsError) return <AnErrorHasOccured />;

  return (
    <Fragment>
      {contextHolder}
      {budgets.data.length === 0 ? (
        <div className="mx-auto flex flex-col items-center py-5">
          <img src={emptyBudget} />
          <p className="text-xl">Không có thu chi đã được duyệt !</p>
        </div>
      ) : (
        <div className="w-full bg-[#F0F6FF] p-8 rounded-xl space-y-5">
          <div className="flex gap-x-5">
            <Input
              className="w-[30%]"
              placeholder="Tìm kiếm theo tên thu chi hoặc người gửi"
              value={searchText}
              allowClear
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

            <div className="flex-1 text-right">
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 10, label: "10 / trang" },
                  { value: 20, label: "20 / trang" },
                  { value: 50, label: "50 / trang" },
                ]}
              />
            </div>
          </div>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={(err) => {
              console.log("ERROR: ", err);
            }}
            component={false}
          >
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              columns={mergedColumns}
              dataSource={filteredData ? filteredData : budgets.data}
              onChange={handleTableChange}
              pagination={false}
              scroll={{
                x: "120%",
                // y: "100%",
                scrollToFirstRowOnChange: true,
              }}
            />
          </Form>

          {(budgets.nextPage || budgets.prevPage) && (
            <div className="flex items-center justify-center gap-x-3 mt-8">
              <MdOutlineKeyboardArrowLeft
                className={`text-slate-500 ${
                  budgets.prevPage
                    ? "cursor-pointer hover:text-blue-600"
                    : "cursor-not-allowed"
                }`}
                onClick={() =>
                  budgets.prevPage && setCurrentPage((prev) => prev - 1)
                }
                size={25}
              />
              {Array.from({ length: budgets.lastPage }, (_, index) => (
                <div
                  key={index}
                  className={`border border-slate-300 rounded-xl px-4 py-2 text-base font-medium cursor-pointer hover:bg-blue-200 ${
                    currentPage === index + 1 &&
                    "text-blue-600 border-blue-800 bg-blue-100"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </div>
              ))}
              <MdOutlineKeyboardArrowRight
                className={`text-slate-500 ${
                  budgets.nextPage
                    ? "cursor-pointer hover:text-blue-600"
                    : "cursor-not-allowed"
                }`}
                onClick={() =>
                  budgets.nextPage && setCurrentPage((prev) => prev + 1)
                }
                size={25}
              />
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ConfirmedBudget;
