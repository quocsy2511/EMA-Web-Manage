import {
  BulbOutlined,
  FieldTimeOutlined,
  FolderOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  VerticalAlignTopOutlined,
  MinusCircleOutlined,
  FileExclamationOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Segmented,
  Select,
  Space,
  Tag,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getAllUser } from "../../../../apis/users";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import { useRouteLoaderData } from "react-router-dom";
import moment from "moment";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";
import { IoMdAttach } from "react-icons/io";
import {
  assignMember,
  updateTask,
  updateTaskStatus,
} from "../../../../apis/tasks";
import ListFile from "../File/ListFile";
import FileInput from "../File/FileInput";
dayjs.locale("vi");
dayjs.extend(utc);
dayjs.utc();
const { RangePicker } = DatePicker;
const { Option } = Select;
const statusTask = [
  {
    value: "PENDING",
    label: "CHUẨN BỊ",
    color: "default",
  },
  {
    value: "PROCESSING",
    label: "ĐANG DIỄN RA",
    color: "processing",
  },
  {
    value: "DONE",
    label: "HOÀN THÀNH",
    color: "green",
  },
  {
    value: "CONFIRM",
    label: "XÁC NHẬN",
    color: "purple",
  },
  {
    value: "CANCEL",
    label: "ĐÃ HUỶ",
    color: "red",
  },
  {
    value: "OVERDUE",
    label: "QUÁ HẠN",
    color: "orange",
  },
];
const StatusParentTask = statusTask.filter((task) => task.value !== "CONFIRM");

const optionsPriority = [
  { label: "THẤP", value: "LOW" },
  { label: "TRUNG BÌNH", value: "MEDIUM" },
  { label: "CAO", value: "HIGH" },
];

const FieldSubtask = ({
  disableEndDate,
  disableStartDate,
  taskSelected,
  taskParent,
  staff,
  disableUpdate,
  setIsOpenTaskModal,
}) => {
  const selectedPriority = optionsPriority.find(
    (option) => option.value === taskSelected?.priority
  );
  const eventID = taskSelected?.event?.id;
  const taskID = taskSelected?.id;
  const parentTask = taskSelected?.parent?.id;
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const divisionId = useRouteLoaderData("staff").divisionID;
  const queryClient = useQueryClient();
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [isOpenMember, seItsOpenMember] = useState(false);
  const [assignTasks, setAssignTasks] = useState(taskSelected.assignTasks);
  const [startDateUpdate, setStartDateUpdate] = useState("");
  const [endDateUpdate, setEndDateUpdate] = useState("");
  const [isRangePickerFocused, setIsRangePickerFocused] = useState(false);
  const [isRangePickerCancel, setIsRangePickerCancel] = useState(false);
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  // const [priority, setPriority] = useState(selectedPriority);
  // console.log("🚀 ~ file: FieldSubtask.js:110 ~ priority:", priority);
  const today = moment();
  const todayFormat = moment().format("YYYY-MM-DD HH:mm:ss");
  const checkStartDateFormat = moment(disableStartDate).format("YYYY-MM-DD");
  const checkEndDateFormat = moment(disableEndDate).format("YYYY-MM-DD");
  const hourStartDate = moment(disableStartDate).format("HH");
  const minutesStartDate = moment(disableStartDate).format("mm");
  const hourCurrentDate = moment(todayFormat).format("HH");
  const minutesCurrentDate = moment(todayFormat).format("mm");
  const hourEndDate = moment(disableEndDate).format("HH");
  const minutesEndDate = moment(disableEndDate).format("mm");
  const membersInTask = assignTasks?.map((item) => item.user?.id);

  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "TRUNG BÌNH" },
      CONFIRM: { color: "purple", title: "XÁC NHẬN" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  const {
    data: employees,
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
  } = useQuery(
    ["employees"],
    () =>
      getAllUser({
        divisionId,
        pageSize: 10,
        currentPage: 1,
        role: "EMPLOYEE",
      }),
    {
      select: (data) => {
        const listUsers = data.data.map(({ ...item }) => {
          item.dob = moment(item.dob).format("YYYY-MM-DD");
          return {
            key: item.id,
            ...item,
          };
        });
        return listUsers;
      },
    }
  );

  //handle date
  const onFocusRangePicker = () => {
    setIsRangePickerFocused(true);
    setIsRangePickerCancel(true);
  };
  const onBlurRangePicker = () => {
    setIsRangePickerFocused(false);
    setIsRangePickerCancel(false);
  };
  const onChangeDate = (value, dateString) => {
    const isoStartDate = moment(dateString[0]).toISOString();
    const isoEndDate = moment(dateString[1]).toISOString();
    setStartDateUpdate(isoStartDate);
    setEndDateUpdate(isoEndDate);
  };
  ///////////////validate Date
  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM HH:mm");
    return date;
  };

  const disabledDate = (current) => {
    if (current.isBefore(disableStartDate, "day")) {
      return (
        current.isBefore(disableEndDate, "day") ||
        current.isAfter(disableEndDate, "day")
      );
    } else {
      return current.isBefore(today) || current.isAfter(disableEndDate, "day");
    }
  };
  //validate pick timess
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledRangeTime = (_, type) => {
    if (!today.isBefore(disableStartDate, "day")) {
      if (type === "start") {
        return {
          disabledHours: () => range(0, hourCurrentDate),
          disabledMinutes: () => range(0, minutesCurrentDate),
        };
      }
      return {
        disabledHours: () => range(0, 0),
        disabledMinutes: () => range(0, 0),
      };
    } else if (
      checkStartDateFormat.toString() === checkEndDateFormat.toString()
    ) {
      if (type === "start") {
        return {
          disabledHours: () => range(0, hourStartDate),
          disabledMinutes: () => range(0, minutesStartDate),
        };
      }
      return {
        disabledHours: () =>
          range(0, hourStartDate).concat(range(hourEndDate, 24)), // Sửa đoạn này
        disabledMinutes: () =>
          range(0, minutesStartDate).concat(range(minutesEndDate, 60)),
      };
    } else {
      if (type === "start") {
        return {
          disabledHours: () => range(0, hourStartDate),
          disabledMinutes: () => range(0, minutesStartDate),
        };
      }
      return {
        disabledHours: () => range(hourEndDate, 24), // Sửa đoạn này
        disabledMinutes: () => range(minutesEndDate, 60),
      };
    }
  };
  //Pick deadline
  const { mutate: updateDate, isLoading } = useMutation(
    ({ taskID, task }) => updateTask({ taskID, task }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        setIsRangePickerFocused(false);
        setIsRangePickerCancel(false);
        message.open({
          type: "success",
          content: "Cập nhật thời gian công việc  thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Cập nhật thời gian công việc thất bại",
        });
      },
    }
  );

  const updateTimeFinish = (value) => {
    const {
      approvedBy,
      assignTasks,
      createdAt,
      createdBy,
      event,
      id,
      modifiedBy,
      parent,
      status,
      subTask,
      taskFiles,
      updatedAt,
      ...rest
    } = taskSelected;
    const data = {
      ...rest,
      startDate: startDateUpdate,
      endDate: endDateUpdate,
      eventID: eventID,
      parentTask: parentTask,
    };
    updateDate({ taskID, task: data });
  };

  ////////Pick members
  const { mutate: UpdateMember } = useMutation((data) => assignMember(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["subtaskDetails"], taskID);
      message.open({
        type: "success",
        content: "cập nhật nhân viên được giao công việc thành công",
      });
    },
    onError: () => {
      message.open({
        type: "error",
        content:
          "Ko thể cập nhật nhân viên được giao công việc lúc này! Hãy thử lại sau",
      });
    },
  });
  const handleChangeMember = (value) => {
    const data = {
      assignee: value,
      taskID: taskID,
      leader: value?.length > 0 ? value[0] : "",
    };
    UpdateMember(data);
  };

  /////////Pick Status
  const { mutate: UpdateStatus } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        message.open({
          type: "success",
          content: "Cập nhật trạng thái thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể cập nhật trạng thái lúc này! Hãy thử lại sau",
        });
      },
    }
  );
  const handleChangeStatus = (value) => {
    const data = { status: value, taskID: taskID };
    UpdateStatus(data);
  };

  ////Pick Priority
  const { mutate: updatePriority } = useMutation(
    ({ taskID, task }) => updateTask({ taskID, task }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        message.open({
          type: "success",
          content: "Cập nhật độ ưu tiên công việc  thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Cập nhật độ ưu tiên mới thất bại",
        });
      },
    }
  );
  const updatePriorityFinish = (value) => {
    const {
      approvedBy,
      assignTasks,
      createdAt,
      createdBy,
      event,
      id,
      modifiedBy,
      parent,
      status,
      subTask,
      taskFiles,
      updatedAt,
      ...rest
    } = taskSelected;
    const data = {
      ...rest,
      priority: value,
      eventID: eventID,
      parentTask: parentTask,
    };
    updatePriority({ taskID, task: data });
  };

  useEffect(() => {
    setAssignTasks(taskSelected.assignTasks);
  }, [taskSelected]);

  return (
    <div className="flex flex-col ">
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-1/2">
          {/* task member */}
          <div className="flex flex-col  pl-12 mt-2">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <UserOutlined />
              {taskParent ? "Trưởng phòng" : "Thành Viên"}
            </h4>
            {taskParent ? (
              <div className="flex justify-start items-center mt-4">
                <div className="flex flex-row gap-x-2 justify-start items-center bg-slate-50  rounded-md p-1 cursor-pointer">
                  <Tooltip key="avatar" title={staff?.fullName} placement="top">
                    <Avatar src={staff?.avatar} size="small" />
                  </Tooltip>
                  <p className="w-full flex-1  text-sm font-semibold">
                    {staff?.fullName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-center mt-4">
                {isOpenMember && !disableUpdate ? (
                  !isLoadingEmployees ? (
                    !isErrorEmployees ? (
                      <>
                        <Select
                          autoFocus
                          allowClear
                          mode="multiple"
                          placeholder="Select Member "
                          bordered={false}
                          style={{
                            width: "80%",
                          }}
                          defaultValue={membersInTask}
                          onChange={(value) => handleChangeMember(value)}
                          optionLabelProp="label"
                        >
                          {employees?.map((item, index) => {
                            return (
                              <Option
                                value={item?.id}
                                label={item?.fullName}
                                key={!item.id ? index : item.id}
                              >
                                <Space>
                                  <span role="img" aria-label={item?.fullName}>
                                    <Avatar src={item?.avatar} />
                                  </span>
                                  {item?.fullName}
                                </Space>
                              </Option>
                            );
                          })}
                        </Select>
                      </>
                    ) : (
                      <AnErrorHasOccured />
                    )
                  ) : (
                    <LoadingComponentIndicator />
                  )
                ) : (
                  <>
                    <Avatar.Group
                      maxCount={3}
                      maxStyle={{
                        color: "#D25B68",
                        backgroundColor: "#F4D7DA",
                      }}
                    >
                      {assignTasks?.length > 0 &&
                        assignTasks?.map((item) => (
                          <Tooltip
                            key="avatar"
                            title={item.user?.profile?.fullName}
                            placement="top"
                          >
                            {item.user.profile === null ? (
                              <Avatar
                                icon={<UserOutlined />}
                                size="default"
                                className="bg-gray-500"
                              />
                            ) : (
                              <Avatar
                                src={item.user?.profile?.avatar}
                                size="default"
                              />
                            )}
                          </Tooltip>
                        ))}
                    </Avatar.Group>
                    {!disableUpdate && (
                      <Avatar
                        icon={<UsergroupAddOutlined className="text-black" />}
                        size="default"
                        onClick={() => seItsOpenMember(true)}
                        className="cursor-pointer bg-lite"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-col  w-1/2">
          {/* upload file */}
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <FolderOutlined />
              Tài liệu
            </h4>
            {taskSelected?.taskFiles?.length > 0 &&
              taskSelected?.taskFiles.map((file) => (
                <ListFile key={file.id} file={file} />
              ))}
            {!taskParent && (
              <div className="flex justify-start items-center mt-4">
                <FileInput taskID={taskID} setIsOpenTaskModal={setIsOpenTaskModal} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* priority / status */}
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-1/2">
          {/* priority */}
          <div className="flex flex-col  pl-12 mt-2">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <VerticalAlignTopOutlined />
              Độ ưu tiên
            </h4>
            {taskParent ? (
              <>
                <div className="flex justify-start items-center mt-4">
                  {taskSelected.priority !== null ? (
                    <Tag
                      color={
                        getColorStatusPriority(taskSelected.priority)?.color
                      }
                      className="h-fit"
                    >
                      {getColorStatusPriority(taskSelected.priority)?.title}
                    </Tag>
                  ) : (
                    <Tag icon={<MinusCircleOutlined />} color="default">
                      không có độ ưu tiên
                    </Tag>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-start items-center mt-4">
                  {taskSelected.priority !== null ? (
                    <>
                      {!isOpenPriority ? (
                        <Tag
                          color={
                            getColorStatusPriority(taskSelected.priority)?.color
                          }
                          className="h-fit"
                          onClick={() => setIsOpenPriority(true)}
                        >
                          {getColorStatusPriority(taskSelected.priority)?.title}
                        </Tag>
                      ) : (
                        <Form
                          name="Priority"
                          // onFinish={updatePriorityFinish}
                        >
                          <Form.Item
                            name="priority"
                            className="text-sm font-medium "
                            initialValue={selectedPriority?.value}
                          >
                            <Segmented
                              options={optionsPriority}
                              value={selectedPriority?.value}
                              onChange={(value) => updatePriorityFinish(value)}
                            />
                          </Form.Item>
                        </Form>
                      )}
                    </>
                  ) : (
                    <Tag icon={<MinusCircleOutlined />} color="default">
                      không có độ ưu tiên
                    </Tag>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className=" flex flex-col  w-1/2">
          {/* Status */}
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden ">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <BulbOutlined />
              Trạng Thái
            </h4>
            {disableUpdate ? (
              <Tag
                color={getColorStatusPriority(taskSelected.status)?.color}
                className="h-fit w-fit mt-4 "
              >
                {getColorStatusPriority(taskSelected.status)?.title}
              </Tag>
            ) : !isOpenStatus ? (
              <Tag
                color={getColorStatusPriority(taskSelected.status)?.color}
                onClick={() => setIsOpenStatus(true)}
                className="h-fit w-fit mt-4 cursor-pointer"
              >
                {getColorStatusPriority(taskSelected.status)?.title}
              </Tag>
            ) : (
              <Select
                removeIcon={true}
                bordered={false}
                defaultValue={taskSelected.status}
                className="w-[190px] mt-4"
                onChange={(value) => handleChangeStatus(value)}
              >
                {taskParent
                  ? StatusParentTask?.map((status) => (
                      <Select.Option key={status.value}>
                        <Tag color={status.color}>{status.label}</Tag>
                      </Select.Option>
                    ))
                  : statusTask?.map((status) => (
                      <Select.Option key={status.value}>
                        <Tag color={status.color}>{status.label}</Tag>
                      </Select.Option>
                    ))}
              </Select>
            )}
          </div>
        </div>
      </div>
      {/* task date */}
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-full pl-12 mt-4">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2">
            <FieldTimeOutlined />
            Thời gian
          </h4>
          {taskParent ? (
            <>
              <div className="flex justify-start items-center mt-4">
                <span
                  className={` px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 ${
                    taskSelected.status === "CANCEL" ||
                    taskSelected.status === "OVERDUE"
                      ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                      : taskSelected.status === "DONE"
                      ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                      : ""
                  }`}
                >
                  {formattedDate(taskSelected.startDate)} -{" "}
                  {formattedDate(taskSelected.endDate)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-start items-center mt-4">
                {disableUpdate ? (
                  <span
                    className={` px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 ${
                      taskSelected.status === "CANCEL" ||
                      taskSelected.status === "OVERDUE"
                        ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                        : taskSelected.status === "DONE"
                        ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                        : ""
                    }`}
                  >
                    {formattedDate(taskSelected.startDate)} -{" "}
                    {formattedDate(taskSelected.endDate)}
                  </span>
                ) : (
                  <>
                    {taskSelected?.startDate &&
                    taskSelected?.endDate !== null ? (
                      <>
                        {isOpenDate ? (
                          <Form onFinish={updateTimeFinish} name="date">
                            <Form.Item
                              name="date"
                              className="mb-0"
                              rules={[
                                {
                                  type: "array",
                                  required: true,
                                  message: "Please select time!",
                                },
                              ]}
                              initialValue={[
                                dayjs(taskSelected.startDate)
                                  .utcOffset(7)
                                  .local(),
                                dayjs(taskSelected.endDate)
                                  .utcOffset(7)
                                  .local(),
                              ]}
                            >
                              <RangePicker
                                placeholder={[
                                  "ngày bắt đầu  ",
                                  "ngày kết thúc ",
                                ]}
                                disabledTime={disabledRangeTime}
                                disabledDate={disabledDate}
                                showTime={{
                                  format: "HH:mm:ss",
                                  hideDisabledOptions: true,
                                }}
                                onChange={onChangeDate}
                                format="YYYY/MM/DD HH:mm:ss"
                                onFocus={onFocusRangePicker}
                                // onBlur={onBlurRangePicker}
                                allowClear={false}
                              />
                            </Form.Item>
                            <div className="flex flex-row gap-x-2">
                              {isRangePickerFocused && (
                                <Button
                                  type="link"
                                  htmlType="submit"
                                  loading={isLoading}
                                >
                                  Lưu
                                </Button>
                              )}
                              {isRangePickerCancel && (
                                <Button
                                  type="link"
                                  onClick={() => onBlurRangePicker()}
                                >
                                  Huỷ
                                </Button>
                              )}
                            </div>
                          </Form>
                        ) : (
                          <span
                            className={` px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 ${
                              taskSelected.status === "CANCEL" ||
                              taskSelected.status === "OVERDUE"
                                ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                                : taskSelected.status === "DONE"
                                ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                                : ""
                            }`}
                            onClick={() => setIsOpenDate(true)}
                          >
                            {formattedDate(taskSelected.startDate)} -{" "}
                            {formattedDate(taskSelected.endDate)}
                          </span>
                        )}
                      </>
                    ) : (
                      <RangePicker
                        showTime={{
                          format: "HH:mm:ss",
                        }}
                        onChange={onChangeDate}
                        format="YYYY/MM/DD HH:mm:ss"
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldSubtask;
