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
  Tooltip,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { getProfile } from "../../../../apis/users";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import Members from "./Members";

const user = [
  {
    id: 1,
    name: "Nguyen Vu",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 2,
    name: "Nguyen Sy",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 3,
    name: "Nguyen Tung",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 4,
    name: "Nguyen Huy",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 5,
    name: "Nguyen Thiep",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
];

const FieldSubtask = ({ taskSelected, taskParent }) => {
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

  if (!taskParent && taskSelected.assignTasks.length > 0) {
  }

  const handleChangeSelect = (value) => {
    // console.log(`selected ${value}`);
  };
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [isOpenMember, seItsOpenMember] = useState(false);
  const [assignTasks, setAssignTasks] = useState(taskSelected.assignTasks);
  const [deadline, setDeadline] = useState(dayjs());

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
                <Select
                  placeholder="Select Member "
                  bordered={false}
                  style={{
                    width: "80%",
                  }}
                  // value={user}
                  onChange={(value) => handleChangeSelect(value)}
                >
                  {user.map((item, index) => {
                    return (
                      <Select.Option key={item.id} children={item}>
                        <div className="flex flex-row gap-x-2 justify-start items-center ">
                          <Tooltip
                            key={item.id}
                            title={item.name}
                            placement="top"
                          >
                            <Avatar src={item.avatar} size={18} />
                          </Tooltip>
                          <p className="text-ellipsis w-[100px] flex-1 overflow-hidden ">
                            {item.name}
                          </p>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              ) : (
                <>
                  {assignTasks.length > 0 &&
                    assignTasks.map((item) => (
                      <Members userId={item.assignee} key={item.assignee} />
                    ))}
                  <Avatar
                    icon={<UsergroupAddOutlined />}
                    size="default"
                    onClick={() => seItsOpenMember(true)}
                  />
                </>
              )}
            </div>
          )}
        </div>
        {/* task date */}
        <div className="flex flex-col w-full pl-12 mt-4">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2">
            <FieldTimeOutlined />
            Thời gian
          </h4>
          <div className="flex justify-start items-center mt-4">
            {isOpenDate ? (
              <DatePicker
                showTime
                onChange={onChangeDate}
                defaultValue={deadline}
              />
            ) : (
              <span
                className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
                  taskSelected.status === "processing"
                    ? "bg-blue-300 bg-opacity-20 text-blue-600 rounded-md"
                    : taskSelected.status === "done"
                    ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                    : taskSelected.status === "confirmed"
                    ? "bg-[#65a9a2] bg-opacity-20 text-[#13676a] rounded-md"
                    : taskSelected.status === "pending"
                    ? "bg-[#f9d14c] bg-opacity-20 text-[#faad14] rounded-md"
                    : ""
                }`}
                onClick={() => setIsOpenDate(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formattedDate(taskSelected.endDate)}
              </span>
            )}
          </div>
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
  );
};

export default FieldSubtask;
