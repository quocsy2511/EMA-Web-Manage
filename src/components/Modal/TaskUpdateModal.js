import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import ReactQuill from "react-quill";
import moment from "moment";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignMember,
  createTaskFile,
  updateTask,
  updateTaskFile,
} from "../../apis/tasks";
import { getDetailEvent } from "../../apis/events";
import { getAllUser, getUserById } from "../../apis/users";
import { SyncLoader } from "react-spinners";
import { IoMdAttach } from "react-icons/io";
import { uploadFile } from "../../apis/files";
import { GiCancel } from "react-icons/gi";
import { BsCheckCircle } from "react-icons/bs";

const { RangePicker } = DatePicker;

const Title = ({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
);

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }])

const TaskUpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  eventID,
  task,
  isSubTask,

  staffId,
  parentTaskId,
}) => {
  console.log("TaskUpdateModal: ", task);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [fileList, setFileList] = useState();
  const [selectedEmployeesId, setSelectedEmployeesId] = useState();
  const [updateFileList, setUpdateFileList] = useState(task?.taskFiles ?? []);

  useEffect(() => {
    form.setFieldsValue({
      title: task.title,
      date:
        task.startDate && task.endDate ? [task.startDate, task.endDate] : null,
      description: task.description
        ? { ops: JSON.parse(task?.description?.startsWith(`[{"insert":"`) ? task?.description : parseJson(task?.description)) }
        : null,
      priority: task.priority ?? null,
      estimationTime: task.estimationTime ?? null,

      assignee: !isSubTask
        ? task.assignTasks?.[0]?.user.id
        : divisionIdOfStaff === leader?.divisionId
          ? task.assignTasks?.map((item) => item.user.id)
          : undefined,
      leader:
        divisionIdOfStaff === leader?.divisionId
          ? task.assignTasks?.filter((item) => item.isLeader === true)[0]?.user
            .id
          : null,
    });

    setUpdateFileList(task?.taskFiles ?? []);

    if (isSubTask) {
      divisionIdOfStaff = staffs?.find(
        (staff) => staff.userId === staffId
      )?.divisionId;

      setSelectedEmployeesId(task.assignTasks?.map((item) => item.user.id));
    }
  }, [task]);

  // Get staff in event
  const {
    data: staffs,
    isLoading: staffsIsLoading,
    // isError: staffsIsError,
  } = useQuery(["event-detail", eventID], () => getDetailEvent(eventID), {
    select: (data) => {
      return data.listDivision;
    },
  });

  //======================= SUBTASK ONLY =======================
  // Get divisionId of the chosen staff / task
  let divisionIdOfStaff = staffs?.find(
    (staff) => staff.userId === staffId
  )?.divisionId;
  console.log("divisionIdOfStaff: ", divisionIdOfStaff);

  // Get employees from divisionId
  const {
    data: employees,
    isLoading: employeesIsLoading,
    // isError: employeesIsError,
  } = useQuery(
    ["employees", divisionIdOfStaff],
    () =>
      getAllUser({
        divisionId: divisionIdOfStaff,
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
      enabled: isSubTask && !!staffId && !!divisionIdOfStaff,
    }
  );

  const {
    data: leader,
    isLoading: leaderIsLoading,
    // isError: leaderIsError,
  } = useQuery(
    ["user", task.assignTasks.find((item) => item.isLeader === true)?.user.id],
    () =>
      getUserById(
        task.assignTasks.find((item) => item.isLeader === true)?.user.id
      ),
    {
      enabled:
        isSubTask &&
        !!staffId &&
        !!task.assignTasks.find((item) => item.isLeader === true)?.user.id,
    }
  );
  console.log(
    "Check division is the same or not: ",
    divisionIdOfStaff === leader?.divisionId
  );
  //============================================================

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((task) => updateTask(task), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        "tasks",
        eventID,
        isSubTask ? parentTaskId : task.id,
      ]);
      handleCancel();
      form.resetFields(["fileUrl"]);
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

  const { mutate: assignMemberMutate } = useMutation(
    ({ assign, updateTask }) => assignMember(assign),
    {
      onSuccess: (data, variables) => {
        const task = variables.updateTask;
        mutate(task);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: updateTaskFileMutate } = useMutation(
    (updateFileList) => updateTaskFile(updateFileList),
    {
      onSuccess: (data, variables) => { },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: createTakeFileMutate } = useMutation(
    (taskFile) => createTaskFile(taskFile),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "tasks",
          eventID,
          isSubTask ? parentTaskId : task.id,
        ]);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, taskID }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        createTakeFileMutate({
          taskID: variables.taskID,
          fileName: data.fileName,
          fileUrl: data.downloadUrl,
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Không thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

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
      parentTask: isSubTask ? parentTaskId : null,
    };

    // Update new file
    if (!values.fileUrl || values.fileUrl?.length === 0) {
      console.log("NOOO FILE");
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "task");

      uploadFileMutate({ formData, taskID: values.taskID });
    }

    // Update existed file list
    if (
      task.taskFiles.length !== 0 &&
      task.taskFiles.length !== updateFileList.length
    ) {
      console.log("Update new file list");
      updateTaskFileMutate({
        taskId: task.id,
        files: updateFileList.map((file) => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
        })),
      });
    }

    if (!isSubTask) {
      console.log("Update task");
      // update Task
      if (task.assignTasks?.[0]?.user.id === values.assignee) {
        console.log("Same asignee");
        const { assignee, date, ...updatedTask } = values;

        // Not update assignee
        console.log(updatedTask);
        mutate(updatedTask);
      } else {
        console.log("Diff asignee");
        const { assignee, date, ...task } = values;

        const updatedTask = {
          assign: {
            assignee: [assignee],
            taskID: values.taskID,
            leader: assignee,
          },
          updateTask: task,
        };

        // Update assignee
        console.log(updatedTask);
        assignMemberMutate(updatedTask);
      }
    } else {
      console.log("Update subtask");
      // update Subtask
      const { assignee, leader, date, ...task } = values;

      const updatedTask = {
        assign: {
          assignee: assignee,
          taskID: values.taskID,
          leader: leader,
        },
        updateTask: task,
      };
      console.log(updatedTask);
      assignMemberMutate(updatedTask);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("errorInfo: ", errorInfo);
  };

  const handleValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];
    if (formFieldName === "assignee") {
      setSelectedEmployeesId(changedValues[formFieldName]);
      form.resetFields(["leader"]);
    }
  };

  const modifyFileList = (file) => {
    if (updateFileList.some((item) => item.id === file.id)) {
      setUpdateFileList((prev) => prev.filter((item) => item.id !== file.id));
    } else {
      setUpdateFileList((prev) => [...prev, file]);
    }
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
        form={form}
        className="p-5"
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
          date:
            task.startDate && task.endDate
              ? [task.startDate, task.endDate]
              : null,
          description: task.description
            ? { ops: JSON.parse(task.description?.startsWith(`[{"insert":"`) ? task.description : parseJson(task.description)) }
            : null,
          priority: task.priority ?? null,
          estimationTime: task.estimationTime ?? null,
          effort: task.estimationTime ?? null,
          assignee: !isSubTask
            ? task.assignTasks?.[0]?.user.id
            : divisionIdOfStaff === leader?.divisionId
              ? task.assignTasks?.map((item) => item.user.id)
              : undefined,
          leader:
            divisionIdOfStaff === leader?.divisionId
              ? task.assignTasks?.filter((item) => item.isLeader === true)[0]
                ?.user.id
              : null,
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
                showTime={true}
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
                format={"DD/MM/YYYY HH:mm:ss"}
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

        <div className="flex gap-x-10">
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
          <div className="w-[30%] flex items-center gap-x-3">
            <Form.Item
              label={<Title title="Thời gian ước tính" />}
              name="estimationTime"
              rules={
                [
                  // {
                  //   required: true,
                  //   message: "Chưa điền thời gian !",
                  // },
                ]
              }
            >
              <InputNumber className="w-full" placeholder="1" min={1} />
            </Form.Item>
            Giờ
          </div>
          <div className="w-[30%] flex items-center gap-x-3">
            <Form.Item
              label={<Title title="Công số" />}
              name="effort"
              rules={
                [
                  // {
                  //   required: true,
                  //   message: "Chưa điền thời gian !",
                  // },
                ]
              }
            >
              <InputNumber className="w-full" placeholder="1" min={1} />
            </Form.Item>
            Giờ
          </div>
        </div>
        {!isSubTask ? (
          staffsIsLoading ? (
            // <LoadingComponentIndicator />
            <SyncLoader color="#4096ff" />
          ) : (
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
                options={
                  staffs?.map((staff) => ({
                    value: staff.userId,
                    label: (
                      <p>
                        {staff.fullName} - {staff.divisionName}
                      </p>
                    ),
                  })) ?? []
                }
              />
            </Form.Item>
          )
        ) : staffsIsLoading ||
          employeesIsLoading ||
          (task.assignTasks.length > 0 && leaderIsLoading) ? (
          // <LoadingComponentIndicator />
          <SyncLoader color="#4096ff" />
        ) : (
          <>
            <Form.Item
              className="w-[70%] mb-2"
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
                options={employees ?? []}
              />
            </Form.Item>
            <div className="mb-5">
              {divisionIdOfStaff !== leader?.divisionId &&
                task.assignTasks.map((item) => (
                  <Tag>{item.user.profile.fullName}</Tag>
                ))}
            </div>
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
              />
            </Form.Item>
          </>
        )}
        <div className="my-2 flex flex-wrap gap-x-3">
          {task?.taskFiles.length > 0 &&
            task?.taskFiles.map((file) => (
              <div
                className={`flex items-center gap-x-3 px-2 py-1 cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg ${!updateFileList.some((item) => item.id === file.id) &&
                  "opacity-50"
                  }`}
                onClick={() => modifyFileList(file)}
              >
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  {file.fileName}
                </a>
                {updateFileList.some((item) => item.id === file.id) ? (
                  <GiCancel className="text-blue-400" />
                ) : (
                  <BsCheckCircle className="text-blue-400" />
                )}
              </div>
            ))}
        </div>

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
              <p className="text-sm font-medium">Thêm tài liệu đính kèm</p>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskUpdateModal;
