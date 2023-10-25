import React, { useEffect, useState } from "react";
import {
  Checkbox,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import ReactQuill from "react-quill";
import moment from "moment";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../apis/tasks";

const { RangePicker } = DatePicker;

const Title = ({ title }) => <p className="text-base font-medium">{title}</p>;

const TaskUpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  eventID,
  task,
  isSubTask,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [isTime, setIsTime] = useState(true);
  const [fileList, setFileList] = useState();
  //   const [selectedEmployeesId, setSelectedEmployeesId] = useState();

  useEffect(() => {
    form.setFieldsValue({
      title: task.title,
      date: [task.startDate, task.endDate],
      description: { ops: JSON.parse(task.description) },
      priority: task.priority ?? null,
      estimationTime: task.estimationTime,
    });
  }, [task]);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((task) => updateTask(task), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks", eventID, task.id]);
      handleCancel();
      messageApi.open({
        type: "success",
        content: "Cập nhật sự kiện thành công.",
      });
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    console.log("Success: ", values);

    values = {
      ...values,
      startDate: values.date[0],
      endDate: values.date[1],
      description: JSON.stringify(values.description.ops),

      eventID,
      taskID: task.id,
      parentTask: isSubTask ? task.id : null,
    };

    const { date, ...restValues } = values;
    console.log("transfer data : ", restValues);
    // mutate(restValues);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("errorInfo: ", errorInfo);
  };

  const handleValuesChange = (changedValues) => {
    // const formFieldName = Object.keys(changedValues)[0];
    // if (formFieldName === "assignee") {
    //   setSelectedEmployeesId(changedValues[formFieldName]);
    //   // form.set
    // }
  };

  return (
    <Modal
      title={
        <p className="text-center text-2xl">
          {isSubTask ? "Cập nhật công việc" : "Cập nhật hạng mục"}
        </p>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading /* || uploadIsLoading*/}
      centered
      width={"50%"}
      okText="Cập nhật"
      cancelText="Hủy"
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
        onValuesChange={handleValuesChange}
        initialValues={{
          title: task.title,
          date: [task.startDate, task.endDate],
          description: { ops: JSON.parse(task.description) },

          priority: task.priority ?? null,
          estimationTime: task.estimationTime,
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
                  form.setFieldsValue({
                    date: value.map((item) => moment.utc(item.$d).format()),
                  });
                }}
                disabledDate={(current) => {
                  const parseStartDate = moment(task.startDate);
                  const parseEndDate = moment(task.endDate);

                  if (parseStartDate.isSame(parseEndDate, "day"))
                    return !current.isSame(parseStartDate, "day");

                  return (
                    current &&
                    (current < parseStartDate || current > parseEndDate)
                  );
                }}
                defaultValue={[
                  dayjs(task.startDate, "YYYY-MM-DD HH:mm:ss"),
                  dayjs(task.endDate, "YYYY-MM-DD HH:mm:ss"),
                ]}
                format={isTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY"}
                className="w-full"
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
              message: "Nhập mô tả!",
            },
          ]}
        >
          <ReactQuill
            className="h-20 mb-10"
            theme="snow"
            placeholder="Mô tả về công việc"
            onChange={(content, delta, source, editor) => {
              form.setFieldsValue({ description: editor.getContents() });
            }}
          />
        </Form.Item>

        {/* <div className="flex gap-x-10">
          <Form.Item
            className="w-[50%]"
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
                console.log("Chọn staff - division : ", value);
                form.setFieldsValue({ assignee: value });
              }}
              options={staffs.map((staff) => ({
                value: staff.userId,
                label: (
                  <p>
                    {staff.fullName} - {staff.divisionName}
                  </p>
                ),
              }))}
            />
          </Form.Item>
        </div> */}

        <div className="flex gap-x-10">
          <Form.Item
            className="w-[30%]"
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
          <Form.Item
            className="w-[30%]"
            label={<Title title="Thời gian ước tính" />}
            name="estimationTime"
            rules={[
              {
                required: true,
                message: "Chưa điền thời gian hoặc sai định dạng !",
              },
            ]}
          >
            <div className="flex gap-x-3 items-center">
              <InputNumber defaultValue={1} min={1} />
              Giờ
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskUpdateModal;
