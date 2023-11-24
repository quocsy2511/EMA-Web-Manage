import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUser, getUserById } from "../../apis/users";
import { createTask } from "../../apis/tasks";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";
import { uploadFile } from "../../apis/files";
import { IoMdAttach } from "react-icons/io";

const { RangePicker } = DatePicker;

const Title = ({ title }) => <p className="text-base font-medium">{title}</p>;

const TaskAdditionModal = ({
  isModalOpen,
  setIsModalOpen,
  eventId,
  date,
  staffs,
  selectedTemplateTask,

  parentTaskId,
  staffId,
}) => {
  const {
    data: staff,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useQuery(["user", staffId], () => getUserById(staffId), {
    enabled: !!parentTaskId && !!staffId,
  });

  const divisionId = staff?.divisionId;

  const {
    data: employees,
    isLoading: employeesIsLoading,
    isError: employeesIsError,
  } = useQuery(
    ["employees", divisionId],
    () =>
      getAllUser({
        divisionId,
        role: "EMPLOYEE",
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        return data.data.map((employee) => ({
          label: employee.fullName,
          value: employee.id,
        }));
      },
      enabled: !!divisionId,
    }
  );

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((task) => createTask(task), {
    onSuccess: () => {
      if (parentTaskId) {
        queryClient.invalidateQueries(["tasks", eventId, parentTaskId]);
      } else {
        queryClient.invalidateQueries(["tasks", eventId]);
        queryClient.invalidateQueries(["filter-tasks", eventId]);
      }

      messageApi.open({
        type: "success",
        content: "Đã tạo 1 hạng mục",
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

  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, task }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        const task = variables.task;
        variables.task = {
          file: [{ fileName: data.fileName, fileUrl: data.downloadUrl }],
          ...task,
        };
        mutate(variables.task);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Không thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  // const [isTime, setIsTime] = useState(false);
  const [fileList, setFileList] = useState();
  const [selectedEmployeesId, setSelectedEmployeesId] = useState();

  useEffect(() => {
    if (selectedTemplateTask) {
      form.setFieldsValue({
        title: selectedTemplateTask.title,
        desc: { ops: JSON.parse(selectedTemplateTask.description) },
      });
    } else {
      form.resetFields();
    }
  }, [selectedTemplateTask]);

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

    values = {
      ...values,
      startDate: moment(values.date[0].$d).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      endDate: moment(values.date[1].$d).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      eventID: eventId,
      estimationTime: +values.estimationTime,
      desc: JSON.stringify(values.desc.ops),
    };

    if (parentTaskId) {
      values = { ...values, parentTask: parentTaskId };
    } else
      values = {
        ...values,
        assignee: [values.assignee],
        leader: values.assignee,
      };

    const { fileUrl, date, ...restValue } = values;

    if (!values.fileUrl || values.fileUrl?.length === 0) {
      console.log("NOOO FILE");

      console.log("Transform data: ", restValue);

      // call api
      mutate(restValue);
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "task");

      console.log("Transform data: ", restValue);

      //call api
      uploadFileMutate({ formData, task: restValue });
    }
  };

  const onFinishFailed = (errorInfo) => {};

  const handleValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "assignee") {
      setSelectedEmployeesId(changedValues[formFieldName]);
    }
  };

  return (
    <Modal
      title={
        <p className="text-center text-4xl border-b pb-5">
          {parentTaskId ? "Thông tin công việc" : "Tạo hạng mục"}
        </p>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading || uploadIsLoading}
      okText="Tạo"
      cancelText="Hủy"
      centered
      width={"50%"}
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
          estimationTime: 1,
          priority: "LOW",
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
            label={<Title title="Thời gian" />}
            name="date"
            rules={[
              {
                validator: async (rule, value) => {
                  if (value && value[0] && value[1]) {
                    console.log("value: ", value);
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
                    // return Promise.resolve();
                  }
                  return Promise.reject("Chọn khoảng thời gian thực hiện");
                },
              },
            ]}
          >
            <ConfigProvider locale={viVN}>
              <RangePicker
                onChange={(value) => {
                  form.setFieldsValue({ date: value });
                }}
                // showTime={{
                //   hideDisabledOptions: true,
                //   defaultValue: [moment(date[0]), moment(date[1])],
                // }}
                showTime
                // showSecond={false}
                disabledDate={(current) => {
                  const startDate = moment(date[0]);
                  const endDate = moment(date[1]);

                  if (parentTaskId) {
                    if (startDate.isSame(endDate, "day"))
                      return !current.isSame(startDate, "day");
                    return (
                      current && (current < startDate || current > endDate)
                    );
                  } else {
                    const today = moment().startOf("day");
                    return current && current < today /*|| current > endDate*/;
                  }
                }}

                
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

        <div className="flex gap-x-10">
          {parentTaskId && staffId ? (
            <>
              {staffIsLoading && employeesIsLoading ? (
                <LoadingComponentIndicator />
              ) : staffIsError || employeesIsError ? (
                <p>Ko thể tải dữ liệu, vui lòng thử lại sau !</p>
              ) : (
                <>
                  <Form.Item
                    className="w-[70%]"
                    label={<Title title="Các nhân viên phù hợp" />}
                    name="assignee"
                    rules={[
                      {
                        required: true,
                        message: "Chưa chọn nhân viên !",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn nhân viên phù hợp"
                      mode="multiple"
                      allowClear
                      options={employees}
                      onChange={(value) => {
                        console.log("Chọn employee group : ", value);
                        form.setFieldsValue({ assignee: value });
                        form.resetFields(["leader"]);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    className="w-[30%]"
                    label={<Title title="Chịu trách nhiệm bởi" />}
                    name="leader"
                    rules={[
                      {
                        required: true,
                        message: "Chưa chọn nhóm trưởng !",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Trưởng nhóm"
                      options={
                        selectedEmployeesId
                          ? employees?.filter((employee) =>
                              selectedEmployeesId.includes(employee.value)
                            )
                          : []
                      }
                      onChange={(value) => {
                        form.setFieldsValue({ leader: value });
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

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
          {/* <div className="w-[30%] flex items-center gap-x-3">
            <Form.Item
              className=""
              label={<Title title="Thời gian ước tính" />}
              name="estimationTime"
              rules={[
                {
                  required: true,
                  message: "Chưa điền thời gian hoặc sai định dạng !",
                },
              ]}
            >
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            Giờ
          </div> */}
        </div>

        <div className="flex gap-x-5">
          <Form.Item
            className="mb-0"
            name="fileUrl"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                validator(_, fileList) {
                  return new Promise((resolve, reject) => {
                    if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( dung lượng < 10MB )");
                    } else {
                      resolve();
                    }
                  });
                },
              },
            ]}
          >
            <Upload
              className="flex items-center gap-x-3"
              maxCount={1}
              listType="picture"
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              showUploadList={{
                showPreviewIcon: false,
              }}
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file && file?.size > 10 * 1024 * 1024) {
                    reject("File quá lớn ( <10MB )");
                    return false;
                  } else {
                    setFileList(file);
                    resolve();
                    return true;
                  }
                });
              }}
            >
              <div className="flex items-center">
                <IoMdAttach className="cursor-pointer" size={20} />
                <p className="text-sm font-medium">Tài liệu đính kèm</p>
              </div>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskAdditionModal;
