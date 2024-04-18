import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  FloatButton,
  Form,
  Input,
  Popconfirm,
  Select,
  Spin,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import momenttz from "moment-timezone";
import React, { Fragment, memo, useEffect, useState } from "react";
import { BsExclamationOctagon } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { uploadFile, uploadFileTask } from "../../../apis/files";
import {
  assignMember,
  createTask,
  getTasks,
  updateTask,
} from "../../../apis/tasks";
import SubTaskSection from "./SubTaskSection";
import TaskSection from "./TaskSection";

const { RangePicker } = DatePicker;

const Title = memo(({ title, required }) => (
  <p className="text-lg font-medium">
    {title}{" "}
    {required && <span className="text-red-500 text-base font-bold">*</span>}
  </p>
));

const DrawerContainer = memo(
  ({
    isDrawerOpen,
    setIsDrawerOpen,
    chosenTemplateTask,
    setChosenTemplateTask,
  }) => {
    const {
      data: templateTask,
      isLoading: isLoadingTemplateTask,
      isError: isErrorTemplateTask,
    } = useQuery(
      ["template-task"],
      () =>
        getTasks({
          fieldName: "isTemplate",
          conValue: "true",
          pageSize: 50,
          currentPage: 1,
        }),
      {
        refetchOnWindowFocus: false,
      }
    );

    const renderPriority = (task) => {
      let text;
      switch (task?.priority) {
        case "HIGH":
          text = "CAO";
          break;
        case "MEDIUM":
          text = "VỪA";
          break;
        case "LOW":
          text = "THẤP";
          break;

        default:
          break;
      }
      return text;
    };

    return (
      <Drawer
        title="Danh sách công việc mẫu"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={"30%"}
      >
        {/* Content */}
        <div className="mx-5">
          <p className="mb-6 text-lg text-black/60">Chọn các hạng mục mẫu</p>

          <Spin spinning={isLoadingTemplateTask}>
            {templateTask?.map((task) => (
              <div
                key={task?.id}
                className={clsx(
                  "rounded-2xl mb-10 overflow-hidden shadow-[0_0_8px_1px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform cursor-pointer",
                  { "shadow-blue-500": chosenTemplateTask?.id === task?.id }
                )}
                onClick={() => {
                  setChosenTemplateTask(task);
                }}
              >
                <div className="pb-3 overflow-hidden">
                  <p className="px-5 pb-2 pt-3 text-xl font-medium truncate border-b overflow-hidden">
                    {task?.title}
                  </p>

                  <div className="p-5 pt-3 pb-14">
                    <div className="flex justify-between items-center">
                      <Title title="Mô tả" />

                      <p className="font-semibold border border-black rounded px-2 py-1">
                        {renderPriority(task)}
                      </p>
                    </div>

                    <ReactQuill
                      // defaultValue={task?.description}
                      defaultValue={{
                        ops: JSON.parse(
                          task?.description?.startsWith(`[{"`)
                            ? task?.description
                            : parseJson(task?.description)
                        ),
                      }}
                      className="mt-2 h-20"
                      theme="snow"
                      placeholder="Mô tả về công việc"
                      onChange={(content, delta, source, editor) => {}}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </Spin>
        </div>
      </Drawer>
    );
  }
);

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const EventAssignTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    eventId,
    eventName,
    dateRange,

    // Subtask only
    isSubTask,
    taskId,
    taskName,
    taskResponsorId,
    item,

    // Update data : assignee of task -> [idStaff] | assignee of subtask: [{id->leader, id, id, ...}]
    updateData,
  } = location.state;

  const [isSelectDate, setIsSelectDate] = useState(false);
  const [chosenFile, setChosenFile] = useState();
  const [hasBusyUser, setHasBusyUser] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chosenTemplateTask, setChosenTemplateTask] = useState();

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      fileHolder: chosenFile,
    });
  }, [chosenFile]);

  useEffect(() => {
    if (chosenTemplateTask) {
      form.setFieldsValue({
        title: chosenTemplateTask?.title,
        desc: {
          ops: JSON.parse(
            chosenTemplateTask?.description?.startsWith(`[{"`)
              ? chosenTemplateTask?.description
              : parseJson(chosenTemplateTask?.description)
          ),
        },
        priority: chosenTemplateTask?.priority,
      });

      setIsDrawerOpen(false);
    }
  }, [chosenTemplateTask]);

  const { mutate: taskMutate, isLoading: taskIsLoading } = useMutation(
    (task) => createTask(task),
    {
      onSuccess: (data) => {
        notification.success({
          message: (
            <p className="font-medium">
              Tạo 1 {isSubTask ? "công việc" : "hạng mục"} thành công
            </p>
          ),
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
    useMutation(({ updatedTask, totalTrue }) => updateTask(updatedTask), {
      onSuccess: (data, variables) => {
        if (variables?.totalTrue === 1) {
          notification.success({
            message: (
              <p className="font-medium">
                Cập nhật {isSubTask ? "công việc" : "hạng mục"} thành công
              </p>
            ),
            placement: "topRight",
            duration: 3,
          });
          navigate(-1);
        }
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
      onSuccess: (data, variables) => {
        if (
          variables?.totalTrue === 1 ||
          (variables?.totalTrue > 1 && variables?.totalTrue === 2)
        ) {
          notification.success({
            message: (
              <p className="font-medium">
                Cập nhật {isSubTask ? "công việc" : "hạng mục"} thành công
              </p>
            ),
            placement: "topRight",
            duration: 3,
          });
          navigate(-1);
        }
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "Không thể cập nhật! Hãy thử lại sau",
        });
      },
    });

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, task, totalTrue }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        if (!variables?.totalTrue) {
          const taskPayload = {
            ...variables.task,
            file: [
              {
                fileName: data?.fileName
                  ? data?.fileName
                  : "tài liệu công việc",
                fileUrl: data?.downloadUrl,
              },
            ],
          };
          taskMutate(taskPayload);
        } else {
          if (variables?.totalTrue === 1 || variables?.totalTrue > 1) {
            assignFileToTaskMutate({
              taskID: updateData?.id,
              fileName: data?.fileName,
              fileUrl: data?.downloadUrl,
            });
          }
        }
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const {
    mutate: assignFileToTaskMutate,
    isLoading: assignFileToTaskIsLoading,
  } = useMutation((data) => uploadFileTask(data), {
    onSuccess: (data) => {
      notification.success({
        message: (
          <p className="font-medium">
            Cập nhật {isSubTask ? "công việc" : "hạng mục"} thành công
          </p>
        ),
        placement: "topRight",
        duration: 3,
      });
      navigate(-1);
    },
    onError: () => {
      message.open({
        type: "error",
        content: "1 lỗi bất ngờ xảy ra! Hãy thử lại sau",
      });
    },
  });

  const checkArrayDiff = (longArr, shortArr) =>
    longArr?.filter((item) => !shortArr?.includes(item));

  const onFinish = (values) => {
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
        // isTemplate,

        // Subtask only
        parentTask: isSubTask ? taskId : undefined,
        itemId: isSubTask ? item?.itemId : undefined,
        itemPercentage: isSubTask ? item?.itemPercentage : undefined,

        // unexpected
        estimationTime: 1,
      };

      if (values?.fileHolder) {
        const formData = new FormData();
        formData.append("file", values?.fileHolder);
        formData.append("folderName", "task");

        uploadFileMutate({ formData, task: taskPayload });
      } else {
        taskMutate(taskPayload);
      }
    } else {
      const listUpdateRequest = [];
      let checkUpdateTask = false;
      let checkAssignTask = false;
      let checkUploadFile = false;

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
        checkUpdateTask = true;
        listUpdateRequest.push(checkUpdateTask);
      }

      // Update assign task
      if (!isSubTask) {
        if (updateData?.assignee?.[0] !== values?.assignee?.[0]) {
          checkAssignTask = true;
          listUpdateRequest.push(checkAssignTask);
        }
      } else {
        // check assign subtask
        if (values?.leader !== updateData?.assignee?.[0]) {
          checkAssignTask = true;
          listUpdateRequest.push(checkAssignTask);
        } else if (updateData?.assignee?.length === values?.assignee?.length) {
          if (!!checkArrayDiff(updateData?.assignee, values?.assignee).length) {
            checkAssignTask = true;
            listUpdateRequest.push(checkAssignTask);
          }
        } else {
          if (updateData?.assignee?.length > values?.assignee?.length) {
            if (
              !!checkArrayDiff(updateData?.assignee, values?.assignee).length
            ) {
              checkAssignTask = true;
              listUpdateRequest.push(checkAssignTask);
            }
          } else {
            if (
              !!checkArrayDiff(values?.assignee, updateData?.assignee).length
            ) {
              checkAssignTask = true;
              listUpdateRequest.push(checkAssignTask);
            }
          }
        }
      }

      const formData = new FormData();
      if (values?.fileHolder) {
        formData.append("file", values?.fileHolder);
        formData.append("folderName", "task");

        checkUploadFile = true;
        listUpdateRequest.push(checkUploadFile);
      }

      const totalTrue = listUpdateRequest?.reduce(
        (result, item) => (item ? result + 1 : result),
        0
      );

      if (checkUpdateTask) {
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
        updateTaskMutate({
          updatedTask: updatedValue,
          totalTrue,
        });
      }
      if (checkAssignTask) {
        updateAssignMutate({
          taskID: updateData?.id,
          assignee: values?.assignee ?? [],
          leader: values?.assignee?.[0],
          totalTrue,
        });
      }
      if (checkUploadFile) {
        uploadFileMutate({
          formData,
          totalTrue,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Fragment>
      {contextHolder}

      <DrawerContainer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        chosenTemplateTask={chosenTemplateTask}
        setChosenTemplateTask={setChosenTemplateTask}
      />

      {isSubTask && (
        <FloatButton
          onClick={() => setIsDrawerOpen(true)}
          type="primary"
          tooltip={"Công việc mẫu"}
          className="cursor-pointer"
        />
      )}

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
              <Link
                to={`/manager/event/${eventId}/${taskId}`}
                state={{
                  eventName: eventName,
                  dateRange: dateRange,
                  subtaskId: taskId,
                }}
                relative="path"
                replace
              >
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
              label={<Title title="Tiêu đề" required />}
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
              label={<Title title="Thời gian" required />}
              name="date"
              rules={[
                {
                  required: true,
                  message: "Chọn ngày thực hiện và kết thúc !",
                },
                {
                  validator: (_, value) => {
                    if (value && value?.[0] && value?.[1]) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Vui lòng chọn khoảng thời gian thực hiện."
                    );
                  },
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <RangePicker
                  size="large"
                  defaultValue={
                    updateData && updateData?.date?.[0] && updateData?.date?.[1]
                      ? [
                          dayjs(updateData?.date?.[0], "YYYY-MM-DD"),
                          dayjs(updateData?.date?.[1], "YYYY-MM-DD"),
                        ]
                      : momenttz(dateRange?.[0]).isBefore(momenttz(), "days")
                      ? [dayjs(), undefined]
                      : [dayjs(dateRange?.[0], "YYYY-MM-DD"), undefined]
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

                    if (!isSubTask) {
                      if (now.isBefore(startDate, "days"))
                        return (
                          current &&
                          (current < startDate.clone().subtract(1, "day") ||
                            current > endDate)
                        );
                      else
                        return (
                          current &&
                          (current < now.clone().subtract(1, "day") ||
                            current > endDate)
                        );
                    } else
                      return (
                        current &&
                        (current < startDate ||
                          current < now.clone().subtract(1, "day") ||
                          current > endDate)
                      );
                  }}
                  format={"DD/MM/YYYY"}
                  className="w-full"
                />
              </ConfigProvider>
            </Form.Item>
            <Form.Item
              className="w-[20%]"
              label={<Title title="Độ ưu tiên" required />}
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
                    label: "Vừa",
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
            label={<Title title="Mô tả" required />}
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
                  return new Promise((resolve, reject) => {
                    if (file && file?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( <10MB )");
                      return false;
                    } else {
                      setChosenFile(file);

                      resolve();
                      return true;
                    }
                  });
                }}
                onChange={(info) => {
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
              hasBusyUser={hasBusyUser}
              setHasBusyUser={setHasBusyUser}
            />
          ) : (
            <TaskSection
              form={form}
              isSelectDate={isSelectDate}
              eventId={eventId}
              updateDataDivision={
                updateData ? updateData?.assignee ?? [] : null
              }
              setHasBusyUser={setHasBusyUser}
            />
          )}

          <div className="flex justify-center items-center mt-10">
            {!!updateData ? (
              <Popconfirm
                title={
                  !!hasBusyUser?.length && hasBusyUser?.includes(true)
                    ? `${
                        isSubTask ? "Có 1 nhân viên" : "Nhóm được chọn"
                      } đang tham gia nhiều ${
                        isSubTask ? "công việc" : "hạng mục"
                      }`
                    : `Bạn đang tạo 1 ${isSubTask ? "công việc" : "hạng mục"} `
                }
                description={
                  !!hasBusyUser?.length && hasBusyUser?.includes(true)
                    ? `Bạn có chắc chắn muốn tạo ${
                        isSubTask ? "công việc" : "hạng mục"
                      } này ?`
                    : "Bạn có chắc chắn với các thông tin trên ?"
                }
                icon={
                  !!hasBusyUser?.length && hasBusyUser?.includes(true) ? (
                    <BsExclamationOctagon
                      className="mr-5 text-xl"
                      style={{
                        color: "red",
                      }}
                    />
                  ) : (
                    <FaRegCircleCheck className="text-green-500 mr-5 text-xl" />
                  )
                }
                okText="Chấp Nhận"
                cancelText="Hủy"
                onConfirm={() => {
                  form.submit();
                }}
              >
                <Button
                  size="large"
                  type="primary"
                  loading={
                    updateTaskIsLoading ||
                    updateAssignIsLoading ||
                    isLoadingUploadFile ||
                    assignFileToTaskIsLoading
                  }
                >
                  Cập nhật
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title={
                  !!hasBusyUser?.length && hasBusyUser?.includes(true)
                    ? `${
                        isSubTask ? "Có 1 nhân viên" : "Nhóm được chọn"
                      } đang tham gia nhiều ${
                        isSubTask ? "công việc" : "hạng mục"
                      }`
                    : `Bạn đang tạo 1 ${isSubTask ? "công việc" : "hạng mục"} `
                }
                description={
                  !!hasBusyUser?.length && hasBusyUser?.includes(true)
                    ? `Bạn có chắc chắn muốn tạo ${
                        isSubTask ? "công việc" : "hạng mục"
                      } này ?`
                    : "Bạn có chắc chắn với các thông tin trên ?"
                }
                icon={
                  !!hasBusyUser?.length && hasBusyUser?.includes(true) ? (
                    <BsExclamationOctagon
                      className="mr-5 text-xl"
                      style={{
                        color: "red",
                      }}
                    />
                  ) : (
                    <FaRegCircleCheck className="text-green-500 mr-5 text-xl" />
                  )
                }
                okText="Chấp Nhận"
                cancelText="Hủy"
                onConfirm={() => {
                  form.submit();
                }}
              >
                <Button
                  size="large"
                  type="primary"
                  loading={
                    taskIsLoading ||
                    updateAssignIsLoading ||
                    isLoadingUploadFile
                  }
                >
                  Hoàn Thành
                </Button>
              </Popconfirm>
            )}
          </div>
        </Form>
      </motion.div>
    </Fragment>
  );
};

export default memo(EventAssignTaskPage);
