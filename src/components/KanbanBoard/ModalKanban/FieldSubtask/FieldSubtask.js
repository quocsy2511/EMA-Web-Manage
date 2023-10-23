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
import { Avatar, DatePicker, Select, Space, Tag, Tooltip, message } from "antd";
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
import { updateTaskStatus } from "../../../../apis/tasks";
dayjs.locale("vi");
dayjs.extend(utc);
// Đặt múi giờ của dayjs thành UTC
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

const FieldSubtask = ({ taskSelected, taskParent, staff, disableUpdate }) => {
  const taskID = taskSelected.id;
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const divisionId = useRouteLoaderData("staff").divisionID;
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

  const [isOpenDate, setIsOpenDate] = useState(false);
  const [isOpenMember, seItsOpenMember] = useState(false);
  const [assignTasks, setAssignTasks] = useState(taskSelected.assignTasks);
  // console.log("🚀 ~ file: FieldSubtask.js:95 ~ FieldSubtask ~ assignTasks:", assignTasks)

  const membersInTask = assignTasks?.map((item) => item.user?.id);

  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM HH:mm");
    return date;
  };

  //Pick deadline
  const onChangeDate = (value, dateString) => {
    // console.log("Formatted Selected Time: ", dateString);
  };

  const handleChangeMember = (value) => {
    console.log(
      "🚀 ~ file: FieldSubtask.js:116 ~ handleChangeMember ~ value:",
      value
    );
  };

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

  const queryClient = useQueryClient();
  const { mutate: UpdateStatus } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: (status) => {
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
            {taskSelected?.taskFiles?.length > 0 ? (
              taskSelected?.taskFiles.map((file) => (
                <a
                  key={file.id}
                  href={file.fileUrl}
                  className="text-ellipsis max-w-full overflow-hidden flex mt-2 text-green-500"
                >
                  <IoMdAttach className="cursor-pointer" size={20} />
                  Tài liệu đính kèm
                </a>
              ))
            ) : (
              <Tag
                icon={<FileExclamationOutlined />}
                color="default"
                className="w-fit mt-4"
                bordered={false}
              >
                không có file
              </Tag>
            )}
            <div className="flex justify-start items-center mt-4">
              {/* <Upload
                className="upload-list-inline"
                maxCount={1}
                listType="picture"
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
                      // setFileList(file);
                      resolve();
                      return true;
                    }
                  });
                }}
              >
                <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
              </Upload> */}
            </div>
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
            <div className="flex justify-start items-center mt-4">
              {taskSelected.priority !== null ? (
                <Tag
                  color={getColorStatusPriority(taskSelected.priority)?.color}
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
                {taskSelected?.startDate && taskSelected?.endDate !== null ? (
                  <>
                    {isOpenDate ? (
                      <RangePicker
                        showTime={{
                          format: "HH:mm:ss",
                        }}
                        onChange={onChangeDate}
                        defaultValue={[
                          dayjs(taskSelected.startDate).utcOffset(7).local(),
                          dayjs(taskSelected.endDate).utcOffset(7).local(),
                        ]}
                        format="YYYY/MM/DD HH:mm:ss"
                      />
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
                s
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldSubtask;
