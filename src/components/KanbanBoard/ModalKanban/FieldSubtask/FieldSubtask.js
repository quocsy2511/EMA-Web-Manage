import {
  BulbOutlined,
  FieldTimeOutlined,
  FolderOutlined,
  UploadOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Select,
  Space,
  Tag,
  Tooltip,
  Upload,
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
dayjs.locale("vi");
dayjs.extend(utc);
// Đặt múi giờ của dayjs thành UTC
dayjs.utc();
const { RangePicker } = DatePicker;
const { Option } = Select;
const statusTask = [
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
    value: "PENDING",
    label: "ĐANG CHỜ",
    color: "warning",
  },
  {
    value: "CANCEL",
    label: "ĐÃ HUỶ",
    color: "red",
  },
  {
    value: "OVERDUE",
    label: "QUÁ HẠN",
    color: "red",
  },
];

const FieldSubtask = ({ taskSelected, taskParent, staff }) => {
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const divisionId = useRouteLoaderData("staff").divisionID;
  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
  } = useQuery(
    ["users-division"],
    () => getAllUser({ divisionId, pageSize: 10, currentPage: 1 }),
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

  const membersInTask = assignTasks.map((item) => item.user?.id);
  // const formatDate = "YYYY/MM/DD HH:mm:ss";

  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM HH:mm");
    return date;
  };

  //Pick deadline
  const onChangeDate = (value, dateString) => {
    // console.log("Formatted Selected Time: ", dateString);
  };

  const handleChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };

  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "success", title: "HOÀN THÀNH" },
      PENDING: { color: "warning", title: "ĐANG CHỜ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "red", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "TRUNG BÌNH" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };
  const handleChangeStatus = (value) => {
    console.log(`selected ${value}`);
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
                  <Tooltip key="avatar" title={staff.fullName} placement="top">
                    <Avatar src={staff.avatar} size="small" />
                  </Tooltip>
                  <p className="w-full flex-1  text-sm font-semibold">
                    {staff.fullName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-center mt-4">
                {isOpenMember ? (
                  !isLoadingUsers ? (
                    !isErrorUsers ? (
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
                          onChange={(value) => handleChangeSelect(value)}
                          optionLabelProp="label"
                        >
                          {users?.map((item, index) => {
                            return (
                              <Option
                                value={item?.id}
                                label={item?.fullName}
                                key={!item.id ? index : item.id}
                              >
                                <Space>
                                  <span role="img" aria-label={item.fullName}>
                                    <Avatar src={item.avatar} />
                                  </span>
                                  {item.fullName}
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
                      {assignTasks.length > 0 &&
                        assignTasks.map((item) => (
                          <Tooltip
                            key="avatar"
                            title={item.user?.profile.fullName}
                            placement="top"
                          >
                            {item.user === null ? (
                              <Avatar
                                icon={<UserOutlined />}
                                size="default"
                                className="bg-gray-500"
                              />
                            ) : (
                              <Avatar
                                src={item.user?.profile.avatar}
                                size="default"
                              />
                            )}
                          </Tooltip>
                        ))}
                    </Avatar.Group>
                    <Avatar
                      icon={<UsergroupAddOutlined className="text-black" />}
                      size="default"
                      onClick={() => seItsOpenMember(true)}
                      className="cursor-pointer bg-lite"
                    />
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
            {taskSelected.taskFiles.length > 0 &&
              taskSelected.taskFiles.map((file) => (
                <a
                  key={file.id}
                  href={file.fileUrl}
                  className="text-ellipsis max-w-full overflow-hidden flex mt-2 text-green-500"
                >
                  <IoMdAttach className="cursor-pointer" size={20} />
                  Tài liệu đính kèm
                </a>
              ))}
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
              <Tag
                color={getColorStatusPriority(taskSelected.priority).color}
                // onClick={() => setIsOpenStatus(true)}
                className="h-fit"
              >
                {getColorStatusPriority(taskSelected.priority).title}
              </Tag>
            </div>
          </div>
        </div>
        <div className=" flex flex-col  w-1/2">
          {/* Status */}
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <BulbOutlined />
              Trạng Thái
            </h4>
            {!isOpenStatus ? (
              <Tag
                color={getColorStatusPriority(taskSelected.status).color}
                onClick={() => setIsOpenStatus(true)}
                className="h-fit w-fit mt-4"
              >
                {getColorStatusPriority(taskSelected.status).title}
              </Tag>
            ) : (
              <Select
                removeIcon={true}
                bordered={false}
                defaultValue={taskSelected.status}
                className="w-[190px] mt-4"
                onChange={(value) => handleChangeStatus(value)}
              >
                {statusTask.map((status) => (
                  <Select.Option key={status.value}>
                    <Tag color={status.color}>{status.label}</Tag>
                  </Select.Option>
                ))}
              </Select>
            )}
            {/* <div className="flex justify-start items-center mt-4"></div> */}
          </div>
        </div>
      </div>

      <div className=" flex flex-row gap-x-6">
        {/* task date */}
        <div className="flex flex-col w-full pl-12 mt-4">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2">
            <FieldTimeOutlined />
            Thời gian
          </h4>
          <div className="flex justify-start items-center mt-4">
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
                  taskSelected.status === "PROCESSING"
                    ? "bg-blue-300 bg-opacity-20 text-blue-600 rounded-md"
                    : taskSelected.status === "DONE"
                    ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                    : taskSelected.status === "CONFIRMED"
                    ? "bg-[#65a9a2] bg-opacity-20 text-[#13676a] rounded-md"
                    : taskSelected.status === "PENDING"
                    ? "bg-[#f9d14c] bg-opacity-20 text-[#faad14] rounded-md"
                    : ""
                }`}
                onClick={() => setIsOpenDate(true)}
              >
                {formattedDate(taskSelected.startDate)} -{" "}
                {formattedDate(taskSelected.endDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldSubtask;
