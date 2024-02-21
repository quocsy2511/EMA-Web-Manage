import React, { Fragment, memo } from "react";
import LockLoadingModal from "../../../components/Modal/LockLoadingModal";
import { motion } from "framer-motion";
import { ConfigProvider, DatePicker, Form, Input, message } from "antd";
import viVN from "antd/locale/vi_VN";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TaskSection from "./TaskSection";

const { RangePicker } = DatePicker;

const Title = memo(({ title }) => (
  <p className="text-lg font-medium">{title}</p>
));

const EventAssignTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId, eventName } = location.state;

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // console.log("Success:", values);
    // values = {
    //   ...values,
    //   startDate: moment(values.date[0].$d).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    //   endDate: moment(values.date[1].$d).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    //   eventID: eventId,
    //   estimationTime: +values.estimationTime,
    //   desc: JSON.stringify(values.desc.ops),
    // };
    // if (parentTaskId) {
    //   values = { ...values, parentTask: parentTaskId };
    // } else
    //   values = {
    //     ...values,
    //     assignee: [values.assignee],
    //     leader: values.assignee,
    //   };
    // const { fileUrl, date, ...restValue } = values;
    // if (!values.fileUrl || values.fileUrl?.length === 0) {
    //   console.log("NOOO FILE");
    //   console.log("Transform data: ", restValue);
    //   // call api
    //   mutate(restValue);
    // } else {
    //   console.log("HAS FILE");
    //   const formData = new FormData();
    //   formData.append("file", fileList);
    //   formData.append("folderName", "task");
    //   console.log("Transform data: ", restValue);
    //   //call api
    //   uploadFileMutate({ formData, task: restValue });
    // }
  };

  const onFinishFailed = (errorInfo) => {};

  const handleValuesChange = (changedValues) => {
    // const formFieldName = Object.keys(changedValues)[0];
    // if (formFieldName === "assignee") {
    //   setSelectedEmployeesId(changedValues[formFieldName]);
    // }
  };

  return (
    <Fragment>
      {contextHolder}
      <LockLoadingModal
        // isModalOpen={isLoading}
        label="Đang tạo đề mục ..."
      />

      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400 truncate">
          <Link to="/manager/event" relative="path">
            Sự kiện{" "}
          </Link>
          /{" "}
          <Link to=".." relative="path">
            {eventName}{" "}
          </Link>
          / Tạo đề mục
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={clsx(
          "bg-white rounded-2xl mt-6 p-5 overflow-hidden min-h-[calc(100vh-64px-7rem)]",
          {}
        )}
      >
        <p>Tạo Hạng Mục</p>
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
          onValuesChange={handleValuesChange}
          //   initialValues={{
          //     estimationTime: 1,
          //     priority: "LOW",
          //   }}
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
              <Input placeholder="Tên công việc" size="large" />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label={<Title title="Thời gian" />}
              name="date"
              rules={[
                {
                  validator: async (rule, value) => {
                    if (value && value[0] && value[1]) {
                      const startDate = moment(value[0].$d);
                      const endDate = moment(value[1].$d);

                      // Calculate the difference in minutes
                      const diffInMinutes = endDate.diff(startDate, "minutes");

                      if (diffInMinutes >= 15) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          "Khoảng thời gian phải ít nhất là 15 phút"
                        );
                      }
                    }
                    return Promise.reject("Chọn khoảng thời gian thực hiện");
                  },
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <RangePicker
                  size="large"
                  onChange={(value) => {
                    form.setFieldsValue({ date: value });
                  }}
                  // showTime={{
                  //   hideDisabledOptions: true,
                  //   defaultValue: [moment(date[0]), moment(date[1])],
                  // }}
                  showTime
                  // showSecond={false}
                  //   disabledDate={(current) => {
                  //     const startDate = moment(date[0]);
                  //     const endDate = moment(date[1]);

                  //     if (parentTaskId) {
                  //       if (startDate.isSame(endDate, "day"))
                  //         return !current.isSame(startDate, "day");
                  //       return (
                  //         current && (current < startDate || current > endDate)
                  //       );
                  //     } else {
                  //       const today = moment().startOf("day");
                  //       return (
                  //         current && current < today /*|| current > endDate*/
                  //       );
                  //     }
                  //   }}
                  format={"DD/MM/YYYY HH:mm:ss"}
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
            <ReactQuill
              className="h-28 mb-10"
              theme="snow"
              placeholder="Mô tả về công việc"
              onChange={(content, delta, source, editor) => {
                form.setFieldsValue({ desc: editor.getContents() });
              }}
            />
          </Form.Item>

          <TaskSection form={form} />
        </Form>
      </motion.div>
    </Fragment>
  );
};

export default EventAssignTaskPage;
