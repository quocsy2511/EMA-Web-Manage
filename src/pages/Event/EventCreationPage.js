import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Table,
} from "antd";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Title = ({ title }) => <p className="text-base font-medium">{title}</p>;

const EventCreationPage = () => {
  const [form] = Form.useForm();
  //   form.resetFields()
  //   form.setFieldsValue({})

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "staff",
      // width: 100,
    },
    { title: "Phòng ban", dataIndex: "division" },
    Table.SELECTION_COLUMN,
  ];

  const dataSource = [
    {
      key: 1,
      staff: "Sy",
      division: "Phong ban",
    },
    {
      key: 2,
      staff: "Vu",
      division: "Phong ban",
    },
    {
      key: 3,
      staff: "Sy",
      division: "Thiet ke",
    },
  ];

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to=".." relative="path">
            Sự kiện{" "}
          </Link>
          / Tạo mới
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white p-8 rounded-2xl mt-6"
      >
        <Form
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
          <div className="flex justify-between">
            <Form.Item
              className="w-[30%]"
              label={<Title title="Tiêu đề" />}
              name="title"
              rules={[
                {
                  required: true,
                  message: "Nhập điii!",
                },
              ]}
            >
              <Input placeholder="Nhập tên sự kiện" />
            </Form.Item>

            <Form.Item
              className="w-[40%]"
              label={<Title title="Địa điểm" />}
              name="location"
              rules={[
                {
                  required: true,
                  message: "Nhập điii!",
                },
              ]}
            >
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>

            <Form.Item
              className="w-[25%]"
              label={<Title title="Thời gian tổ chức" />}
              name="date"
              rules={[
                {
                  validator: (rule, value) => {
                    console.log("range picker");
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
                  onChange={(value) => {
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
            className="h-56"
            label={<Title title="Mô tả" />}
            name="description"
            rules={[
              {
                required: true,
                message: "Nhập điii!",
              },
            ]}
          >
            <ReactQuill
              className="h-36 mb-11"
              theme="snow"
              placeholder="Nhập mô tả"
            />
          </Form.Item>

          <div className="flex gap-x-10">
            <Form.Item
              className="w-[30%]"
              label={<Title title="Bộ phận tham gia" />}
              name="divisions"
              rules={[
                {
                  validator: (rule, value) => {
                    if (value && value.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Chọn phòng ban phù hợp");
                  },
                },
              ]}
            >
              <Table
                className="border border-slate-300 rounded-lg p-2"
                size="small"
                columns={columns}
                dataSource={dataSource}
                rowSelection={{
                  type: "checkbox",
                  onChange: (selectedRowKeys, selectedRows) => {
                    console.log(
                      `selectedRowKeys: ${selectedRowKeys}`,
                      "selectedRows: ",
                      selectedRows
                    );
                    form.setFieldsValue({ divisions: selectedRows });
                  },
                  hideSelectAll: true,
                }}
                pagination={false}
              />
            </Form.Item>

            <div className="w-[%]">
              <Form.Item
                className="w-full"
                label={<Title title="Ước lượng ngân sách" />}
                name="budget"
                rules={[
                  {
                    required: true,
                    message: "Nhập điii!",
                  },
                ]}
              >
                <div className="flex items-center gap-x-2">
                  <InputNumber
                    className="w-full"
                    placeholder="0"
                    min={500000}
                    step={100000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => {
                      form.setFieldsValue({ budget: value.replace(/,/g, "") });
                      return `${value}`.replace(/,/g, "");
                    }}
                    onStep={(value) => {
                      console.log(value);
                      form.setFieldsValue({ budget: value });
                    }}
                    /*stringMode*/
                  />
                  <p>VNĐ</p>
                </div>
              </Form.Item>

              <Form.Item
                className="w-full"
                label={<Title title="Ngày bắt đầu" />}
                name="startDate"
                dependencies={["date"]}
                rules={[
                  {
                    required: true,
                    message: "Chọn 1 ngày để bắt đầu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        moment(getFieldValue("date")?.[0].$d).isAfter(
                          moment(value.$d)
                        )
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Không thể trễ hơn ngày diễn ra!")
                      );
                    },
                  }),
                ]}
              >
                <ConfigProvider locale={viVN}>
                  <DatePicker
                    onChange={(value) => {
                      form.setFieldsValue({ startDate: value });
                    }}
                    disabled={false}
                    disabledDate={(current) => {
                      const endDate = form.getFieldValue("date")?.[0]; // Get the end date from the range picker
                      return (
                        current &&
                        (current < moment().startOf("day") ||
                          (endDate && current > endDate))
                      );
                    }}
                  />
                </ConfigProvider>
              </Form.Item>
            </div>

            <div className="flex-1 flex items-end justify-end gap-x-5 mb-0">
              <Form.Item className="0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="bg-red-200 text-red-500 text-base font-medium px-8 py-2 rounded-lg"
                  type="submit"
                >
                  <Link className="hover:text-red-500" to=".." relative="path">
                    Trở về
                  </Link>
                </motion.button>
              </Form.Item>
              <Form.Item className="">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="bg-[#1677ff] text-white text-base font-medium px-8 py-2 rounded-lg"
                  type="submit"
                >
                  Tạo
                </motion.button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </motion.div>
    </Fragment>
  );
};

export default EventCreationPage;
