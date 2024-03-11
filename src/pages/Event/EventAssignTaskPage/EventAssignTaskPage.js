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
  Upload,
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
import { assignMember, createTask, updateTask } from "../../../apis/tasks";
import SubTaskSection from "./SubTaskSection";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile } from "../../../apis/files";

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
  console.log("dateRange > ", dateRange);

  const [isSelectDate, setIsSelectDate] = useState(false);
  const [chosenFile, setChosenFile] = useState();
  console.log("chosenFile > ", chosenFile);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  useEffect(() => {
    form.setFieldsValue({
      fileHolder: chosenFile,
    });
  }, [chosenFile]);

  const { mutate: taskMutate, isLoading: taskIsLoading } = useMutation(
    (task) => createTask(task),
    {
      onSuccess: (data) => {
        notification.success({
          message: <p className="font-medium">Tạo 1 hạng mục thành công</p>,
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

  const { mutate: updateTaskMutate, isLoading: updateTaskIsLoading } =
    useMutation((updatedTask) => updateTask(updatedTask), {
      onSuccess: (data) => {
        notification.success({
          message: <p className="font-medium">Cập nhật hạng mục thành công</p>,
          placement: "topRight",
          duration: 3,
        });

        navigate(-1);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "Không thể cập nhật! Hãy thử lại sau",
        });
      },
    });

  const { mutate: updateAssignMutate, isLoading: updateAssignIsLoading } =
    useMutation((data) => assignMember(data), {
      onSuccess: (data) => {
        notification.success({
          message: <p className="font-medium">Cập nhật hạng mục thành công</p>,
          placement: "topRight",
          duration: 3,
        });

        navigate(-1);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "Không thể cập nhật! Hãy thử lại sau",
        });
      },
    });

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation((formData) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        // const task = variables.task;
        // console.log("🚀 ~ useMutation ~ variables.task:", variables.task);
        // variables.task = {
        //   file: [
        //     {
        //       fileName: data?.fileName ? data?.fileName : "tài liệu công việc",
        //       fileUrl: data?.downloadUrl,
        //     },
        //   ],
        //   ...task,
        // };
        // submitFormTask(variables.task);
        notification.success({
          message: (
            <p className="font-medium">
              Đã tải tệp tin của hạng mục thành công
            </p>
          ),
          placement: "topRight",
          duration: 3,
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const checkArrayDiff = (longArr, shortArr) =>
    longArr.filter((item) => !shortArr.includes(item));

  const handleAssignTask = (values) => {
    updateAssignMutate({
      taskID: updateData?.id,
      assignee: values?.assignee ?? [],
      leader: values?.leader,
    });
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    if (values?.fileHolder) {
      const formData = new FormData();
      formData.append("file", values?.fileHolder);
      formData.append("folderName", "task");

      uploadFileMutate(formData);
    }

    // Create new task
    if (!updateData) {
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
    } else {
      // Update task
      const updatedDesc = JSON.parse(
        updateData?.desc?.startsWith(`[{"`)
          ? updateData?.desc
          : parseJson(updateData?.desc)
      );

      // Update Task Detail
      if (
        updateData?.title !== values?.title ||
        updateData?.date?.[0] !== values?.date?.[0] ||
        updateData?.date?.[1] !== values?.date?.[1] ||
        updateData?.priority !== values?.priority ||
        JSON.stringify(values?.desc?.ops) !== JSON.stringify(updatedDesc)
      ) {
        // update task
        const updatedValue = {
          title: values?.title,
          eventID: eventId,
          startDate: momenttz(values?.date[0]).format("YYYY-MM-DD"),
          endDate: momenttz(values?.date[1]).format("YYYY-MM-DD"),
          description: JSON.stringify(values?.desc?.ops),
          priority: values?.priority,

          // Subtask only
          parentTask: isSubTask ? taskId : undefined,

          // unexpected
          estimationTime: 1,
          effort: 1,

          taskID: updateData?.id,
        };
        console.log("change > ", updatedValue);
        updateTaskMutate(updatedValue);
      }

      // Update assign task
      if (!isSubTask) {
        if (updateData?.assignee?.[0] !== values?.assignee?.[0]) {
          console.log("assign task again");

          // assign task again
          updateAssignMutate({
            taskID: updateData?.id,
            assignee: values?.assignee ?? [],
            leader: values?.assignee?.[0],
          });
        }
      } else {
        // check assign subtask
        // updateData?.assignee
        // values?.assignee
        if (values?.leader !== updateData?.assignee?.[0]) {
          console.log("change leader");
          handleAssignTask(values);
        } else if (updateData?.assignee?.length === values?.assignee?.length) {
          console.log("same length");
          if (!!checkArrayDiff(updateData?.assignee, values?.assignee).length) {
            handleAssignTask(values);
          }
        } else {
          console.log("diff length");
          if (updateData?.assignee?.length > values?.assignee?.length) {
            if (
              !!checkArrayDiff(updateData?.assignee, values?.assignee).length
            ) {
              console.log("change less");
              handleAssignTask(values);
            }
          } else {
            if (
              !!checkArrayDiff(values?.assignee, updateData?.assignee).length
            ) {
              console.log("change more");
              handleAssignTask(values);
            }
          }
        }
      }
    }
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
            updateData ? (
              "Cập nhật hạng mục"
            ) : (
              "Tạo hạng mục"
            )
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
                    updateData?.desc?.startsWith(`[{"`)
                      ? updateData?.desc
                      : parseJson(updateData?.desc)
                  ),
                }
              : undefined,
            assignee: updateData ? updateData?.assignee : undefined,
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
                      : momenttz(dateRange?.[0]).isBefore(momenttz(), "days")
                      ? [dayjs(), null]
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
                    const now = momenttz();
                    const startDate = momenttz(dateRange?.[0], "YYYY-MM-DD");
                    const endDate = momenttz(dateRange?.[1], "YYYY-MM-DD");

                    if (!isSubTask) return current && current < startDate;
                    else
                      return (
                        (current && current < startDate) ||
                        current < now ||
                        current > endDate
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

          <Form.Item
            // className="text-sm font-medium m-0 w-1/2 flex justify-start items-center gap-x-2"
            name="fileHolder"
            // valuePropName="fileList"
            // getValueFromEvent={(e) => e?.fileList}
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
            <div className="flex items-center space-x-5">
              <Title title="Tài liệu : " />
              <Upload
                className="flex items-center space-x-3"
                maxCount={1}
                // listType="picture"
                action=""
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                showUploadList={{
                  showPreviewIcon: false,
                }}
                beforeUpload={(file) => {
                  console.log("file > ", file);
                  return new Promise((resolve, reject) => {
                    console.log("inside");
                    if (file && file?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( <10MB )");
                      return false;
                    } else {
                      console.log("ok");
                      // setFileList(file);
                      setChosenFile(file);
                      // form.setFieldsValue({
                      //   fileHolder: file,
                      // });
                      resolve();
                      return true;
                    }
                  });
                }}
                onChange={(info) => {
                  console.log("info > ", info);
                  if (info?.file?.status === "removed") {
                    // File has been removed
                    setChosenFile(); // Reset the chosen file state
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
              </Upload>
            </div>
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
            {!!updateData ? (
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  form.submit();
                }}
                // loading={taskIsLoading}
              >
                Cập nhật
              </Button>
            ) : (
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
            )}
          </div>
        </Form>
      </motion.div>
    </Fragment>
  );
};

export default memo(EventAssignTaskPage);
