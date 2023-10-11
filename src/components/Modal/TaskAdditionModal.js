import React, { useState } from "react";
import {
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
import { useMutation, useQuery } from "@tanstack/react-query";
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
}) => {
  const {
    data: staffs,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useQuery(
    ["staff"],
    () => getAllUser({ role: "STAFF", pageSize: 50, currentPage: 1 }),
    {
      select: (data) => {
        console.log(data);
        return data.data;
      },
    }
  );
  console.log("staffs: ", staffs);

  const {
    data: employees,
    isLoading: employeeIsLoading,
    isError: employeeIsError,
  } = useQuery(
    ["employee"],
    () =>
      getAllUser({
        divisionId,
        role: "EMPLOYEE",
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        console.log(data);
        return data.data;
      },
    }
  );
  console.log("employees: ", employees);

  const { mutate } = useMutation((task) => createTask(task), {
    onSuccess: () => {
      console.log("SUCCESS")
    },
    onError: () => {
      console.log("ERROR")
    },
  });

  const [isTime, setIsTime] = useState(false);
  const [fileList, setFileList] = useState();
  console.log("fileList state: ", fileList);
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();

    // Close modal when success
    // setIsModalOpen(false);
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
      startDate: moment(values.date[0]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      endDate: moment(values.date[1]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      eventId,
      assignee: [values.assignee],
    };
    // const { date, ...restValue } = values;
    // restValue = {
    //   ...restValue,
    //   startDate: moment(date[0]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    //   endDate: moment(date[1]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    // };

    console.log("Transform data: ", values);
    mutate(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      //   confirmLoading={loading}
      okText="Tạo"
      cancelText="Hủy"
      centered
      width={"70%"}
    >
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
        // initialValues={{
        //   status: "Chưa giải quyết",
        // }}
      >
        <div className="flex gap-x-8">
          <Form.Item
            className="w-[50%]"
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
            className="w-[40%]"
            label={
              <div className="flex gap-x-5 items-center">
                <Title title="Thời gian tổ chức" />
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
                  console.log(value);
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
                  console.log(value);
                  form.setFieldsValue({ date: value });
                }}
                disabledDate={(current) => {
                  return current && current < moment().startOf("day");
                }}
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
            className="h-36 mb-11"
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
                    console.log(value);
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
                label={<Title title="estimationTime" />}
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
                console.log(value);
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

        <div className="flex gap-x-5">
          {/* <Form.Item
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
                console.log(value);
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
          </Form.Item> */}

          {/* <Form.Item label={<Title title="Trạng thái" />} name="status">
            <Input disabled />
          </Form.Item> */}
        </div>
      </Form>
    </Modal>
  );
};

export default TaskAdditionModal;
