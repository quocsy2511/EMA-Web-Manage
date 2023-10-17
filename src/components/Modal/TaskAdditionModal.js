import React, { useState } from "react";
import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadTask from "../Upload/UploadTask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUser } from "../../apis/users";
import { createTask } from "../../apis/tasks";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Title = ({ title }) => <p className="text-base font-medium">{title}</p>;

const TaskAdditionModal = ({
  isModalOpen,
  setIsModalOpen,
  parentTaskId,
  eventId,
  divisionId,
  date,
}) => {
  const {
    data: staffs,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useQuery(
    ["staffs"],
    () => getAllUser({ role: "STAFF", pageSize: 50, currentPage: 1 }),
    {
      select: (data) => {
        return data.data;
      },
      enabled: !parentTaskId,
    }
  );
  // console.log("staffs: ", staffs);

  const {
    data: employees,
    isLoading: employeeIsLoading,
    isError: employeeIsError,
  } = useQuery(
    ["employees"],
    () =>
      getAllUser({
        divisionId,
        role: "EMPLOYEE",
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        return data.data;
      },
      enabled: !!parentTaskId,
    }
  );
  // console.log("employees: ", employees);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((task) => createTask(task), {
    onSuccess: () => {
      console.log("API SUCCESS");
      queryClient.invalidateQueries(["tasks", eventId]);
      messageApi.open({
        type: "success",
        content: "Đã tạo 1 đề mục",
      });
      form.resetFields();
      setIsModalOpen(false);
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const [isTime, setIsTime] = useState(false);
  const [fileList, setFileList] = useState();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "task");

    values = {
      ...values,
      startDate: moment(values.date[0].$d).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      endDate: moment(values.date[1].$d).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      eventID: eventId,
      estimationTime: +values.estimationTime,
      assignee: [values.assignee],
    };

    console.log("Transform data: ", values);
    mutate(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title={
        <p className="text-center text-2xl">
          {parentTaskId ? "Thông tin công việc" : "Thông tin hạng mục"}
        </p>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      // confirmLoading={loading}
      okText="Tạo"
      cancelText="Hủy"
      centered
      width={"50%"}
      style={{
        header: {
          borderBottom: `5px solid red`,
          borderRadius: 0,
          paddingInlineStart: 5,
        },
      }}
    >
      {contextHolder}
      <Form
        className="p-5"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="flex gap-x-10">
          <Form.Item
            className="w-[55%]"
            label={<Title title="Tiêu đề" />}
            name="title"
            rules={[
              {
                required: true,
                message: "Nhập tiêu đề!",
              },
            ]}
          >
            <Input placeholder="Tên công việc" />
          </Form.Item>
          <Form.Item
            className="w-[45%]"
            label={
              <div className="flex gap-x-5 items-center">
                <Title title="Thời gian" />
                <Checkbox
                  checked={isTime}
                  onChange={() => setIsTime((prev) => !prev)}
                >
                  Giờ cụ thể
                </Checkbox>
              </div>
            }
            name="date"
            rules={[
              {
                validator: (rule, value) => {
                  if (value && value[0] && value[1]) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Chọn khoảng thời gian thực hiện");
                },
              },
            ]}
          >
            <ConfigProvider locale={viVN}>
              <RangePicker
                showTime={isTime}
                onChange={(value) => {
                  form.setFieldsValue({ date: value });
                }}
                disabledDate={(current) => {
                  const startDate = moment(date[0]);
                  const endDate = moment(date[1]);

                  if (startDate.isSame(endDate, "day"))
                    return !current.isSame(startDate, "day");

                  return current && (current < startDate || current > endDate);
                }}
                className="w-full"
              />
            </ConfigProvider>
          </Form.Item>
        </div>

        <Form.Item
          label={<Title title="Mô tả" />}
          name="desc"
          rules={[
            {
              required: true,
              message: "Nhập mô tả!",
            },
          ]}
        >
          {/* <TextArea rows={3} /> */}
          <ReactQuill
            className="h-20 mb-10"
            theme="snow"
            placeholder="Mô tả về công việc"
          />
        </Form.Item>

        <div className="flex gap-x-8">
          {parentTaskId ? (
            <>
              <Form.Item
                className="w-[40%]"
                label={<Title title="Giao cho nhân viên" />}
                name="assignee"
                rules={[
                  {
                    required: true,
                    message: "Chưa chọn nhân viên !",
                  },
                ]}
              >
                <Checkbox.Group
                  className="flex flex-wrap gap-x-5"
                  onChange={(value) => {
                    form.setFieldsValue({ assignee: value });
                  }}
                >
                  <Checkbox className="w-[30%] truncate" value="A">
                    A asd asdas das das das d
                  </Checkbox>
                  <Checkbox className="w-[30%]" value="A">
                    A
                  </Checkbox>
                  <Checkbox className="w-[30%]" value="A">
                    A
                  </Checkbox>
                  <Checkbox className="w-[30%]" value="A">
                    A
                  </Checkbox>
                  <Checkbox className="w-[30%]" value="A">
                    A
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                className=""
                label={<Title title="Chịu trách nhiệm bởi" />}
                name="leader"
                rules={[
                  {
                    required: true,
                    message: "Chưa điền !",
                  },
                ]}
              >
                {/* <Select
                placeholder="Nhân viên"
                onChange={(value) => {
                  console.log(value);
                  form.setFieldsValue({ assignee: value });
                }}
                options={checkedList.map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              /> */}
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                className="w-[25%]"
                label={<Title title="Chịu trách nhiệm bởi" />}
                name="assignee"
                rules={[
                  {
                    required: true,
                    message: "Chọn 1 trưởng phòng !",
                  },
                ]}
              >
                <Select
                  placeholder="Bộ phận"
                  onChange={(value) => {
                    form.setFieldsValue({ assignee: value });
                  }}
                  loading={staffIsLoading}
                  options={
                    !staffIsError && !staffIsLoading
                      ? staffs.map((staff) => ({
                          value: staff.id,
                          label: (
                            <p>
                              {staff.fullName} - {staff.divisionName}
                            </p>
                          ),
                        }))
                      : []
                  }
                />
              </Form.Item>
              <Form.Item
                className="w-[25%]"
                label={<Title title="Thời gian ước tính" />}
                name="estimationTime"
                rules={[
                  {
                    required: true,
                    message: "Chưa điền !",
                  },
                ]}
              >
                <div className="flex gap-x-3 items-center">
                  <Input type="number" min={0} />
                  Tiếng
                </div>
              </Form.Item>
            </>
          )}
          <Form.Item
            className="w-[25%]"
            label={<Title title="Độ ưu tiên" />}
            name="priority"
            rules={[
              {
                required: true,
                message: "Chưa điền !",
              },
            ]}
          >
            <Select
              placeholder="Mức độ"
              onChange={(value) => {
                form.setFieldsValue({ priority: value });
              }}
              options={[
                {
                  value: "LOW",
                  label: "Thấp",
                },
                {
                  value: "MEDIUM",
                  label: "Bình thường",
                },
                {
                  value: "HIGH",
                  label: "Cao",
                },
              ]}
            />
          </Form.Item>
        </div>

        <div className="flex gap-x-5"></div>
      </Form>
    </Modal>
  );
};

export default TaskAdditionModal;
