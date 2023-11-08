import React, { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Table,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUser } from "../../apis/users";
import { createEvent, getTemplateEvent } from "../../apis/events";
import { uploadFile } from "../../apis/files";
import { createTask, getTemplateTask } from "../../apis/tasks";

const { RangePicker } = DatePicker;

const Title = ({ title }) => <p className="text-base font-medium">{title}</p>;

const EventCreationPage = () => {
  const navigate = useNavigate();
  const {
    data: staffs,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useQuery(
    ["staffs"],
    () => getAllUser({ role: "STAFF", pageSize: 50, currentPage: 1 }),
    {
      select: (data) => {
        return data.data.map((staff) => ({
          key: staff.divisionId,
          staff: staff.fullName,
          division: staff.divisionName,
        }));
      },
    }
  );

  const {
    data: templateEvent,
    isLoading: templateEventIsLoading,
    isError: templateEventIsError,
  } = useQuery(["template-event"], getTemplateEvent);
  console.log("templateEvent: ", templateEvent);

  const {
    data: templateTask,
    isLoading: templateTaskIsLoading,
    isError: templateTaskIsError,
  } = useQuery(["template-tasks"], () => getTemplateTask(templateEvent?.id), {
    enabled: !!templateEvent?.id,
    select: (data) => {
      return data.map((item) => ({
        description: item.description,
        title: item.title,
      }));
    },
  });

  const { mutate, isLoading } = useMutation(
    ({ autoTask, ...event }) => createEvent(event),
    {
      onSuccess: (data, variables) => {
        if (!variables.autoTask) {
          messageApi.open({
            type: "success",
            content: "Đã tạo 1 sự kiện",
          });
          form.resetFields();
          navigate("/manager/event");
        } else {
          createTemplateTask({
            index: 0,
            eventID: data,
            task: {
              ...templateTask[0],
              startDate: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
              endDate: moment()
                .add(15, "minutes")
                .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
              eventID: data,
            },
          });
        }
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, event }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        variables.event = { coverUrl: data.downloadUrl, ...variables.event };
        console.log("EVENT: ", variables.event);
        mutate(variables.event);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: createTemplateTask, isLoading: createTemplateTaskIsLoading } =
    useMutation(
      ({ index, eventID, task }) => createTask({ ...task, eventID }),
      {
        onSuccess: (data, variables) => {
          if (variables.index === 4) {
            messageApi.open({
              type: "success",
              content: "Đã tạo 1 sự kiện",
            });
            form.resetFields();
            navigate("/manager/event");
          } else {
            createTemplateTask({
              index: variables.index + 1,
              task: {
                ...templateTask[variables.index + 1],
                startDate: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                endDate: moment()
                  .add(15, "minutes")
                  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                eventID: variables.eventID,
              },
              eventID: variables.eventID,
            });
          }
        },
        onError: () => {
          messageApi.open({
            type: "error",
            content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
          });
        },
      }
    );

  const [fileList, setFileList] = useState();
  const [useTemplateEvent, setUseTemplateEvent] = useState(false);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: "Trưởng phòng",
      dataIndex: "staff",
      // width: 100,
    },
    { title: "Phòng ban", dataIndex: "division" },
    Table.SELECTION_COLUMN,
  ];

  const useTemplate = () => {
    if (!useTemplateEvent) {
      form.setFieldsValue({
        eventName: templateEvent.eventName,
        location: templateEvent.location,
        description: { ops: JSON.parse(templateEvent.description) },
      });
      setUseTemplateEvent(true);
    } else {
      form.resetFields(["eventName", "location", "description"]);
      setUseTemplateEvent(false);
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "event");

    values = {
      eventName: values.eventName,
      description: JSON.stringify(values.description.ops),
      startDate: moment(values.date[0].$d).format("YYYY-MM-DD"),
      endDate: moment(values.date[1].$d).format("YYYY-MM-DD"),
      location: values.location,
      estBudget: +values.estBudget,
      divisionId: values.divisions.map((division) => division.key),
      autoTask: values.autoTask,
    };

    console.log("TRANSORM: ", values);

    uploadFileMutate({ formData, event: values });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      {contextHolder}
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
          initialValues={{ estBudget: 500000 }}
        >
          <div className="flex justify-between">
            <Form.Item
              className="w-[30%]"
              label={<Title title="Tên sự kiện" />}
              name="eventName"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập tên sự kiện!",
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
                  message: "Chưa nhập địa điểm!",
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
                    return Promise.reject("Chưa chọn thời gian tổ chức");
                  },
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <RangePicker
                  onChange={(value) => {
                    console.log(value);
                    form.setFieldsValue({ date: value });
                  }}
                  disabledDate={(current) => {
                    return current && current < moment().startOf("day");
                  }}
                  format={"DD/MM/YYYY"}
                />
              </ConfigProvider>
            </Form.Item>
          </div>

          <Form.Item
            // className="h-56"
            label={<Title title="Mô tả" />}
            name="description"
            rules={[
              {
                required: true,
                message: "Chưa nhập mô tả!",
              },
            ]}
          >
            <ReactQuill
              className="h-36 mb-10"
              theme="snow"
              placeholder="Nhập mô tả"
              onChange={(content, delta, source, editor) => {
                form.setFieldsValue({ description: editor.getContents() });
              }}
            />
          </Form.Item>

          <div className="flex gap-x-10">
            <Form.Item
              className="w-[25%]"
              label={<Title title="Bộ phận tham gia" />}
              name="divisions"
              rules={[
                {
                  validator: (rule, value) => {
                    if (value && value.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Hãy chọn bộ phận phù hợp");
                  },
                },
              ]}
            >
              <Table
                className="border border-slate-300 rounded-lg "
                size="small"
                scroll={{ y: 150 }}
                columns={columns}
                dataSource={!staffIsLoading || !staffIsError ? staffs : []}
                loading={staffIsLoading}
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

            <Form.Item
              className="w-[20%]"
              name="coverUrl"
              label={<Title title="Ảnh về sự kiện" />}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  required: true,
                  message: "Chưa chọn ảnh đại diện",
                },
                {
                  validator(_, fileList) {
                    return new Promise((resolve, reject) => {
                      if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                        reject("File quá lớn ( <10MB )");
                      } else {
                        resolve();
                      }
                    });
                  },
                },
              ]}
            >
              <Upload.Dragger
                className="h-40"
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
                  console.log("file: ", file);
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
                Kéo tập tin vào đây
              </Upload.Dragger>
            </Form.Item>

            <Form.Item
              className="w-[15%]"
              label={<Title title="Ước lượng ngân sách" />}
              name="estBudget"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập ngân sách!",
                },
              ]}
            >
              <div className="flex items-center gap-x-2">
                <InputNumber
                  className="w-full"
                  defaultValue={500000}
                  min={500000}
                  step={100000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => {
                    form.setFieldsValue({
                      estBudget: value.replace(/,/g, ""),
                    });
                    return `${value}`.replace(/,/g, "");
                  }}
                  onStep={(value) => {
                    console.log(value);
                    form.setFieldsValue({ estBudget: value });
                  }}
                  /*stringMode*/
                />
                <p>VNĐ</p>
              </div>
            </Form.Item>

            <div className="flex-1 flex items-end justify-end gap-x-5 mb-0">
              <div>
                <Form.Item className="0">
                  <Button
                    disabled={templateEventIsLoading || templateEventIsError}
                    size={"middle"}
                    type={!useTemplateEvent ? "default" : "primary"}
                    onClick={useTemplate}
                  >
                    Dùng sự kiện kiểu mẫu
                  </Button>
                </Form.Item>
                <div className="flex justify-between">
                  {/* <Form.Item className="0">
                    <Button danger size="large">
                      <Link to=".." relative="path">
                        Trở về
                      </Link>
                    </Button>
                  </Form.Item>
                  <Form.Item className="0">
                    <Button danger size="large">
                      <Link to=".." relative="path">
                        Trở về
                      </Link>
                    </Button>
                  </Form.Item> */}
                  <Form.Item className="" name="autoTask">
                    <Button
                      size="large"
                      type="primary"
                      loading={
                        form.getFieldValue("autoTask") &&
                        (isLoading ||
                          uploadIsLoading ||
                          createTemplateTaskIsLoading)
                      }
                      onClick={() => {
                        form.setFieldsValue({ autoTask: true });
                        form.submit();
                      }}
                    >
                      Tạo kèm hạng mục mặc định
                    </Button>
                  </Form.Item>
                </div>
              </div>
              <Form.Item className="">
                <Button
                  size="large"
                  type="primary"
                  loading={
                    !form.getFieldValue("autoTask") &&
                    (isLoading || uploadIsLoading)
                  }
                  onClick={() => {
                    form.setFieldsValue({ autoTask: false });
                    form.submit();
                  }}
                >
                  Tạo
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </motion.div>
    </Fragment>
  );
};

export default EventCreationPage;
