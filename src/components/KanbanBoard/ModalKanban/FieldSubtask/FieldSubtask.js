import {
  FieldTimeOutlined,
  FolderOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, DatePicker, Select, Tooltip, Upload } from "antd";
import React from "react";

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

const FieldSubtask = ({
  isOpenDate,
  onOk,
  deadline,
  boardItem,
  setIsOpenDate,
  props,
  onChange,
  isOpenMember,
  seItsOpenMember,
}) => {
  const handleChangeSelect = (value) => {
    // console.log(`selected ${value}`);
  };

  return (
    <div className=" flex flex-row gap-x-6">
      <div className="flex flex-col w-1/2">
        {/* task member */}
        <div className="flex flex-col w-full pl-12 mt-2">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2">
            <UserOutlined />
            Member
          </h4>
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
                        <p className="text-ellipsis w-[100px] flex-1 overflow-hidden">
                          {item.name}
                        </p>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            ) : (
              <div
                className="flex flex-row gap-x-2 justify-start items-center bg-slate-50  rounded-md p-1 cursor-pointer"
                onClick={() => seItsOpenMember(true)}
              >
                <Tooltip key="avatar" title="Vu Nguyen" placement="top">
                  <Avatar
                    src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
                    size="small"
                  />
                </Tooltip>
                <p className="w-[100px] flex-1  text-sm font-semibold">
                  Vu Nguyen
                </p>
              </div>
            )}
          </div>
        </div>
        {/* task date */}
        <div className="flex flex-col w-full pl-12 mt-2">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2">
            <FieldTimeOutlined />
            Date
          </h4>
          <div className="flex justify-start items-center mt-4">
            {isOpenDate ? (
              <DatePicker
                showTime
                onChange={onChange}
                onOk={onOk}
                defaultValue={deadline}
              />
            ) : (
              <span
                // className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
                //   task.color === "red"
                //     ? "bg-red-300 bg-opacity-20 text-red-600 dark:bg-red-600 dark:bg-opacity-40 dark:text-red-400 rounded-md"
                //     : task.color === "green"
                //     ? "bg-green-300 bg-opacity-20 text-green-600 dark:bg-green-600 dark:bg-opacity-40 dark:text-green-400 rounded-md"
                //     : ""
                // }`}
                className="px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 bg-green-300 bg-opacity-20 text-green-600 dark:bg-green-600 dark:bg-opacity-40 dark:text-green-400 rounded-md cursor-pointer"
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
                {/* {task.time} */}
                08/27 at 12:32
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
            File
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
