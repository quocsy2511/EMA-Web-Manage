import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React, { Fragment, useState } from "react";
import {
  getAllDivision,
  updateDivision,
  updateStatusDivision,
} from "../../apis/divisions";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import { MdOutlineCancel, MdOutlineSave } from "react-icons/md";
import { PiNotePencilBold, PiTrash } from "react-icons/pi";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import CreateDivisionDrawer from "../../components/Drawer/CreateDivisionDrawer";

const DivisionPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery(
    ["divisions"],
    () => getAllDivision({ pageSize: 50, currentPage: page }),
    {
      select: (data) => {
        data.data = data.data.map(({ ...item }) => {
          return {
            key: item.id,
            ...item,
          };
        });
        return data;
      },
    }
  );
  console.log(data);

  const queryClient = useQueryClient();
  const { mutate, isLoading: updateDivisionIsLoading } = useMutation(
    (division) => updateDivision(division),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["divisions"]);
        onCancelEditing();
        messageApi.open({
          type: "success",
          content: "Cập nhật thành công",
        });
      },
      onError: (error) => {
        if (
          error.response.data.statusCode === 500 &&
          error.response.data.message ===
            "Division is being used. Please modify the account first"
        )
          messageApi.open({
            type: "error",
            content: "Bộ phận đang được sử dụng, không thể vô hiệu!",
          });
        else
          messageApi.open({
            type: "error",
            content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
          });
        onCancelEditing();
      },
    }
  );
  const {
    mutate: updateDivisionStatusMutate,
    isLoading: updateDivisionStatusIsLoading,
  } = useMutation((divisionId) => updateStatusDivision(divisionId), {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["divisions"], (oldValue) => {
        const updatedOldData = oldValue.data.map((item) => {
          if (item.id === variables) return { ...item, status: 0 };
          return item;
        });
        oldValue = { ...oldValue, data: updatedOldData };
        return oldValue;
      });
    },
    onError: (error) => {
      if (
        error.response.data.statusCode === 500 &&
        error.response.data.message ===
          "Division is being used. Please modify the account first"
      )
        messageApi.open({
          type: "error",
          content: "Bộ phận đang được sử dụng, không thể vô hiệu!",
        });
      else
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
    },
  });

  const [editingRowKey, setEditingRowKey] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const checkEditing = (record) => {
    return record.key === editingRowKey;
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const divisionId = form.getFieldValue("id");
    values = {
      ...values,
      divisionId,
      status: values.status === 1 ? true : false,
    };

    console.log("Modified value: ", values);
    mutate(values);
  };

  const handleDeleteAction = (record) => {
    // record : whole data of 1 selected row
    updateDivisionStatusMutate(record.key);
  };

  const onCancelEditing = () => {
    setEditingRowKey("");
  };
  const onSaveEditing = () => {
    form.submit();
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
      title: "Tên bộ phận",
      dataIndex: "divisionName",
      editTable: true,
      width: 150,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      editTable: true,
      width: 300,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      editTable: true,
      align: "center",
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === 1 ? "green" : "volcano"}
            key={record.id}
          >
            {record.status === 1 ? "kích hoạt" : "vô hiệu"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
      align: "center",
      // fixed: "right",
      width: 100,
      render: (_, record) => {
        const editable = checkEditing(record);
        return (
          data.data.length >= 1 && (
            <div className="flex items-center justify-center">
              {editable ? (
                <Space size="middle">
                  <MdOutlineSave
                    className=" cursor-pointer"
                    size={25}
                    onClick={onSaveEditing}
                  />
                  <Popconfirm
                    title="Hủy việc cập nhật ?"
                    onConfirm={onCancelEditing}
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
  const mergedColumns = columns.map((col) => {
    if (!col.editTable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "status" ? "selection" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: checkEditing(record),
      }),
    };
  });
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "selection" ? (
        <Select
          defaultValue={dataIndex && record[dataIndex]}
          onChange={(value) => {
            form.setFieldsValue({ [dataIndex]: value });
          }}
          options={[
            { value: 1, label: "kích hoạt" },
            { value: 0, label: "vô hiệu" },
          ]}
          size="small"
        />
      ) : (
        <Input size="small" allowClear />
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Nhập dữ liệu đi!`,
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
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-10">
        <div className="bg-white min-h rounded-xl p-8">
          <div className="flex mb-8">
            <p className="text-2xl font-medium">Quản lý bộ phận</p>
            <div className="flex-1 text-end">
              <Button
                type="primary"
                className=""
                onClick={() => setShowDrawer(true)}
              >
                Thêm bộ phận
              </Button>
              <CreateDivisionDrawer
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
              />
            </div>
          </div>
          {!isLoading ? (
            isError ? (
              <AnErrorHasOccured />
            ) : (
              <Form form={form} onFinish={onFinish} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  columns={mergedColumns}
                  dataSource={data?.data}
                  bordered
                  pagination={false}
                />
              </Form>
            )
          ) : (
            <LoadingComponentIndicator />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default DivisionPage;
