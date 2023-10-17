import {
  FieldTimeOutlined,
  FolderOutlined,
  UploadOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Select,
  Space,
  Tooltip,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { getAllUser, getProfile } from "../../../../apis/users";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import Members from "./Members";
import { useRouteLoaderData } from "react-router-dom";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;

const FieldSubtask = ({ taskSelected, taskParent }) => {
  console.log(
    "🚀 ~ file: FieldSubtask.js:31 ~ FieldSubtask ~ startDate:",
    taskSelected.startDate
  );

  const {
    data: staff,
    isError: isErrorStaff,
    isLoading: isLoadingStaff,
  } = useQuery(["staff"], () => getProfile(), {
    select: (data) => {
      return data;
    },
    enabled: taskParent,
  });

  const divisionId = useRouteLoaderData("staff").divisionID;
  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
  } = useQuery(
    ["divisions"],
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
  const [deadline, setDeadline] = useState(dayjs());

  const membersInTask = assignTasks.map((item) => item.assignee);
  const formatDate = "YYYY/MM/DD HH:mm:ss";
  const formattedDate = (value) => {
    const date = new Date(value).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return date;
  };

  //Pick deadline
  const onChangeDate = (value, dateString) => {
    // console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    setDeadline(dateString);
  };
  const handleChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };

  //Upload file
  const props = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="flex flex-col ">
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-1/2">
          {/* task member */}
          <div className="flex flex-col w-full pl-12 mt-2">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <UserOutlined />
              {taskParent ? "Trưởng phòng" : "Thành Viên"}
            </h4>
            {taskParent ? (
              <div className="flex justify-start items-center mt-4">
                {!isLoadingStaff ? (
                  !isErrorStaff ? (
                    <div className="flex flex-row gap-x-2 justify-start items-center bg-slate-50  rounded-md p-1 cursor-pointer">
                      <Tooltip
                        key="avatar"
                        title={staff.fullName}
                        placement="top"
                      >
                        <Avatar src={staff.avatar} size="small" />
                      </Tooltip>
                      <p className="w-[100px] flex-1  text-sm font-semibold">
                        {staff.fullName}
                      </p>
                    </div>
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <LoadingComponentIndicator />
                )}
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
                                value={item.id}
                                label={item.fullName}
                                key={item.id}
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
                    {assignTasks.length > 0 &&
                      assignTasks.map((item) => (
                        <Members userId={item.assignee} key={item.assignee} />
                      ))}
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
        <div className=" flex flex-col">
          {/* upload file */}
          <div className="flex flex-col w-full pl-12 mt-2">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <FolderOutlined />
              Tài liệu
            </h4>
            <div className="flex justify-start items-center mt-4">
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </div>
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
                  dayjs(taskSelected.startDate, formatDate),
                  dayjs(taskSelected.endDate, formatDate),
                ]}
                format="YYYY/MM/DD HH:mm:ss"
              />
            ) : (
              <span
                className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
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
