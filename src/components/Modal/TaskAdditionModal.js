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

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const Title = ({ title }) => <p className="text-base font-medium">{title}</p>;

const TaskAdditionModal = ({ isModalOpen, setIsModalOpen, parentTaskId }) => {
  const [isTime, setIsTime] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

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
    values.status = "Pending";
    console.log("Success:", values);
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
        initialValues={{
          status: "Chưa giải quyết",
        }}
      >
        <div className="flex gap-x-10">
          <Form.Item
            className="w-[50%]"
            label={<Title title="Tiêu đề" />}
            name="title"
            rules={[
              {
                required: true,
                message: "Nhập điii!",
              },
            ]}
          >
            <Input placeholder="Tên công việc" />
          </Form.Item>
          <Form.Item
            className="w-[25%]"
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
                  return Promise.reject("Please select a range of dates");
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
          name="description"
          rules={[
            {
              required: true,
              message: "Nhập điii!",
            },
          ]}
        >
          {/* <TextArea rows={3} /> */}
          <ReactQuill
            className="h-36 mb-11"
            theme="snow"
            placeholder="Nhập mô tả"
          />
        </Form.Item>

        {parentTaskId ? (
          <div className="flex gap-x-8">
            <Form.Item
              className="w-[40%]"
              label={<Title title="Giao cho nhân viên" />}
              name="assignee"
              rules={[
                {
                  required: true,
                  message: "Chọn điii!",
                },
              ]}
            >
              <CheckboxGroup
                options={[
                  "Apple",
                  "Pear",
                  "Orange",
                  "Pear",
                  "Orange",
                  "Pear",
                  "Orange",
                  "Pear",
                  "Orange",
                  "Pear",
                  "Orange",
                ]}
                onChange={(value) => {
                  setCheckedList(value);
                  form.setFieldsValue({ assignee: value });
                }}
              />
            </Form.Item>
            <Form.Item
              className=""
              label={<Title title="Chịu trách nhiệm bởi" />}
              name="leader"
              rules={[
                {
                  required: true,
                  message: "Chọn điii!",
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
          </div>
        ) : (
          <Form.Item
            className="w-[25%]"
            label={<Title title="Chịu trách nhiệm bởi" />}
            name="assignee"
            rules={[
              {
                required: true,
                message: "Chọn điii!",
              },
            ]}
          >
            <Select
              placeholder="Bộ phận"
              onChange={(value) => {
                console.log(value);
                form.setFieldsValue({ assignee: value });
              }}
              options={[
                {
                  value: 1,
                  label: "Thiết kế",
                },
                {
                  value: 2,
                  label: "Hậu cần",
                },
                {
                  value: 3,
                  label: "Ngu",
                },
              ]}
            />
          </Form.Item>
        )}

        <div className="flex gap-x-5">
          <Form.Item
            className="w-[15%]"
            label={<Title title="Độ ưu tiên" />}
            name="priority"
            rules={[
              {
                required: true,
                message: "Chọn điii!",
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

          {/* <Form.Item
            className="w-[15%]"
            label={<Title title="Giao cho trưởng phòng" />}
            name="assignee"
            rules={[
              {
                required: true,
                message: "Chọn điii!",
              },
            ]}
          >
            <Select
              placeholder="Bộ phận"
              onChange={(value) => {
                console.log(value);
                form.setFieldsValue({ assignee: value });
              }}
              options={[
                {
                  value: 1,
                  label: "Thiết kế",
                },
                {
                  value: 2,
                  label: "Hậu cần",
                },
                {
                  value: 3,
                  label: "Ngu",
                },
              ]}
            />
          </Form.Item> */}

          <Form.Item label={<Title title="Trạng thái" />} name="status">
            <Input disabled />
          </Form.Item>
        </div>

        {/* <Form.Item
          label={<Title title="Tài liệu đính kèm" />}
          name="attachment"
          valuePropName="fileList"
          getValueFromEvent={(event) => {
            return event?.fileList;
          }}
          // rules={[
          //   {
          //     validator(rule, fileList) {
          //       console.log("validator: " + fileList);
          //       return new Promise((resolve, reject) => {
          //         if (fileList[0] && fileList[0].size > 2)
          //           reject("File size excceeded");
          //         else resolve("Success");
          //       });
          //     },
          //   },
          // ]}
        >
          <Upload
            maxCount={1}
            beforeUpload={(file) => {
              return new Promise((resolve, reject) => {
                if (file.size > 2) reject("File size excceeded");
                else resolve("Success");
              });
            }}
            progress={{
              strokeColor: {
                "0%": "#108ee9",
                "100%": "#87d068",
              },
              strokeWidth: 3,
              format: (percent) =>
                percent && `${parseFloat(percent.toFixed(2))}%`,
            }}
          >
            upload
          </Upload>
        </Form.Item> */}

        {/* <Form.Item>
          <UploadTask />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default TaskAdditionModal;
