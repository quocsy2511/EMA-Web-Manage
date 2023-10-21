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

  parentTaskId,
  staffId,
}) => {
  console.log("parentTaskId: ", parentTaskId);
  console.log("staffId: ", staffId);

  const {
    data: staff,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useQuery(["user", staffId], () => getUserById(staffId), {
    enabled: !!parentTaskId && !!staffId,
  });
  console.log("STAFF: ", staff);

  const divisionId = staff?.divisionId;
  console.log("divisionId: ", divisionId);

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
  console.log("employees: ", employees);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((task) => createTask(task), {
    onSuccess: () => {
      if (parentTaskId)
        queryClient.invalidateQueries(["tasks", eventId, parentTaskId]);
      else queryClient.invalidateQueries(["tasks", eventId]);

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

  const [isTime, setIsTime] = useState(false);
  const [fileList, setFileList] = useState();
  console.log("fileList: ", fileList);
  const [selectedEmployeesId, setSelectedEmployeesId] = useState();

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
      assignee: [values.assignee],
      desc: JSON.stringify(values.desc.ops)
    };

    if(parentTaskId) values = {...values, parentTask: parentTaskId}

    const { fileUrl, date, ...restValue } = values;

    if (!values.fileUrl || values.fileUrl?.length === 0) {
      console.log("NOOO FILE");

      console.log("Transform data: ", restValue);
      mutate(restValue);
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "task");

      console.log("Transform data: ", restValue);
      uploadFileMutate({ formData, task: restValue });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleValuesChange = (changedValues) => {
    console.log("changedValues: ", changedValues);

    const formFieldName = Object.keys(changedValues)[0];
    console.log("formFieldName: ", formFieldName);

    if (formFieldName === "assignee") {
      console.log("ASSIGNEE CHANGE");

      console.log("setState assignee: ", changedValues[formFieldName]);
      setSelectedEmployeesId(changedValues[formFieldName]);
      // form.set
    }
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
      confirmLoading={isLoading || uploadIsLoading}
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
        onValuesChange={handleValuesChange}
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
          <ReactQuill
            className="h-20 mb-10"
            theme="snow"
            placeholder="Mô tả về công việc"
            onChange={(content, delta, source, editor) => {
              form.setFieldsValue({ desc: editor.getContents() });
            }}
          />
        </Form.Item>

        <div className="flex gap-x-8">
          {parentTaskId && staffId ? (
            <>
              {staffIsLoading && employeesIsLoading ? (
                <LoadingComponentIndicator />
              ) : staffIsError || employeesIsError ? (
                <p>Ko thể tải dữ liệu, vui lòng thử lại</p>
              ) : (
                <>
                  <Form.Item
                    className="w-[50%]"
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
                        message: "Chưa chọn nhóm trưởng !",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Trưởng nhóm"
                      options={
                        selectedEmployeesId
                          ? employees.filter((employee) =>
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
                className="w-[40%]"
                label={<Title title="Chịu trách nhiệm bởi" />}
                name="assignee"
                // rules={[
                //   {
                //     required: true,
                //     message: "Chọn 1 trưởng phòng !",
                //   },
                // ]}
              >
                <Select
                  placeholder="Bộ phận"
                  onChange={(value) => {
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
              <Input type="number" min={1} />
              Giờ
            </div>
          </Form.Item>
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
