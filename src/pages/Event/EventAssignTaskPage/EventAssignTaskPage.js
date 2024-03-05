import React, { Fragment, memo, useEffect, useState } from "react";
import LockLoadingModal from "../../../components/Modal/LockLoadingModal";
import { motion } from "framer-motion";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import viVN from "antd/locale/vi_VN";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
import momenttz from "moment-timezone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TaskSection from "./TaskSection";
import { useMutation } from "@tanstack/react-query";
import { createTask } from "../../../apis/tasks";
import SubTaskSection from "./SubTaskSection";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const Title = memo(({ title }) => (
  <p className="text-lg font-medium">{title}</p>
));

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const EventAssignTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    eventId,
    eventName,
    dateRange,

    // Task only
    listDivision,

    // Subtask only
    taskId,
    taskName,
    taskResponsorId,
    isSubTask,

    // Update data : assignee of task -> [idStaff] | assignee of subtask: [{id->leader, id, id, ...}]
    updateData,
  } = location.state;

  console.log("updateData > ", updateData);

  const [isSelectDate, setIsSelectDate] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const { mutate: taskMutate, isLoading: taskIsLoading } = useMutation(
    (task) => createTask(task),
    {
      onSuccess: (data) => {
        notification.success({
          message: <p className="font-medium">Tạo 1 hạng mục thành công</p>,
          // description: "Hello, Ant Design!!",
          placement: "topRight",
          duration: 3,
        });

        navigate(-1);
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
    // }e

    const taskPayload = {
      eventID: eventId,
      title: values?.title,
      startDate: momenttz(values?.date[0]).format("YYYY-MM-DD"),
      endDate: momenttz(values?.date[1]).format("YYYY-MM-DD"),
      desc: JSON.stringify(values?.desc?.ops),
      priority: values?.priority,
      assignee: values?.assignee ?? [],
      leader: isSubTask ? values?.leader : values?.assignee?.[0] ?? "",

      // Optional
      file: undefined,

      // Subtask only
      parentTask: isSubTask ? taskId : undefined,

      // unexpected
      estimationTime: 1,
    };

    taskMutate(taskPayload);
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <Fragment>
      {contextHolder}

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
          /{" "}
          {!isSubTask ? (
            "Tạo hạng mục"
          ) : (
            <>
              Tạo công việc cho hạng mục [{" "}
              <Link to={`/manager/event/${eventId}/${taskId}`} relative="path">
                {taskName ?? "Công việc"}
              </Link>
              ]
            </>
          )}
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
        <p className="text-3xl font-medium my-3 ml-5">
          Thông Tin {isSubTask ? "Công Việc" : "Hạng Mục"}
        </p>
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
            title: updateData ? updateData?.title : undefined,
            date: updateData ? updateData?.date : undefined,
            priority: updateData ? updateData?.priority : "LOW",
            desc: updateData
              ? {
                  ops: JSON.parse(
                    updateData?.desc?.startsWith(`[{"insert":"`)
                      ? updateData?.desc
                      : parseJson(updateData?.desc)
                  ),
                }
              : undefined,
          }}
        >
          <div className="flex gap-x-10">
            <Form.Item
              className="w-[40%]"
              label={<Title title="Tiêu đề" />}
              name="title"
              rules={[
                {
                  required: true,
                  message: "Nhập tiêu đề !",
                },
              ]}
            >
              <Input placeholder="Tên công việc" size="large" />
            </Form.Item>
            <Form.Item
              className="w-[40%]"
              label={<Title title="Thời gian" />}
              name="date"
              rules={[
                {
                  required: true,
                  message: "chọn ngày thực hiện và kết thúc !",
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <RangePicker
                  size="large"
                  defaultValue={
                    updateData
                      ? [
                          dayjs(updateData?.date?.[0], "YYYY-MM-DD"),
                          dayjs(updateData?.date?.[1], "YYYY-MM-DD"),
                        ]
                      : [dayjs(dateRange?.[0], "YYYY-MM-DD"), null]
                  }
                  onChange={(value) => {
                    if (value) {
                      form.setFieldsValue({
                        date: value?.map((item) => item?.$d),
                      });
                      setIsSelectDate(value?.map((item) => momenttz(item?.$d)));
                    } else setIsSelectDate();
                  }}
                  disabledDate={(current) => {
                    const startDate = momenttz(dateRange[0], "YYYY-MM-DD");
                    const endDate = momenttz(dateRange[1], "YYYY-MM-DD");

                    if (!isSubTask) return current && current < startDate;
                    else
                      return (
                        (current && current < startDate) || current > endDate
                      );
                  }}
                  format={"DD/MM/YYYY"}
                  className="w-full"
                />
              </ConfigProvider>
            </Form.Item>
            <Form.Item
              className="w-[20%]"
              label={<Title title="Độ ưu tiên" />}
              name="priority"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn độ ưu tiên !",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Mức độ"
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

          {isSubTask ? (
            <SubTaskSection
              form={form}
              isSelectDate={isSelectDate}
              taskResponsorId={taskResponsorId}
              updateDataUser={updateData ? updateData?.assignee ?? [] : null}
            />
          ) : (
            <TaskSection
              form={form}
              isSelectDate={isSelectDate}
              eventId={eventId}
              listDivision={listDivision}
              updateDataDivision={
                updateData ? updateData?.assignee ?? [] : null
              }
            />
          )}

          <div className="flex justify-center items-center mt-10">
            <Button
              size="large"
              type="primary"
              onClick={() => {
                form.submit();
              }}
              loading={taskIsLoading}
            >
              Hoàn Thành
            </Button>
          </div>
        </Form>
      </motion.div>
    </Fragment>
  );
};

export default memo(EventAssignTaskPage);
