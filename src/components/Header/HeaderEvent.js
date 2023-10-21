import { AlignRightOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Dropdown, Input, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { getAllUser } from "../../apis/users";
import moment from "moment";
import defaultImage from "../../assets/images/pngwing.com.png";
import AnErrorHasOccured from "../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";
import { debounce } from "lodash";

const settingHeader = [
  {
    key: "công việc",
    label: "Bảng công việc",
  },
  {
    key: "ngân sách",
    label: "Ngân sách",
  },
];

const HeaderEvent = ({
  events,
  setSelectEvent,
  selectEvent,
  isBoardTask,
  setIsBoardTask,
  setSearchText,
  searchText,
}) => {
  const [page, setPage] = useState(1);
  const divisionId = useRouteLoaderData("staff").divisionID;
  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
  } = useQuery(
    ["users-division"],
    () => getAllUser({ divisionId, pageSize: 10, currentPage: page }),
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
        currentPage: page,
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

  const handleChangeEvent = (value) => {
    const event = JSON.parse(value);
    setSelectEvent(event);
  };

  const debouncedSearch = debounce((value) => {
    setSearchText(value);
  }, 500);

  useEffect(() => {});
  //custom dropdown
  const filterUser = [
    {
      key: "1",
      type: "group",
      label: "Thành viên",
      children: employees?.map((item) => {
        return {
          key: item.id,
          label: (
            <div className="flex flex-row gap-x-2 justify-start items-center w-fit h-fit">
              <Tooltip key={item.key} title={item.fullName} placement="top">
                <Avatar src={item?.avatar ?? defaultImage} size={24} />
              </Tooltip>
              <p className="text-ellipsis w-full flex-1 overflow-hidden ">
                {item.fullName}
              </p>
            </div>
          ),
        };
      }),
    },
  ];

  const onClick = ({ key }) => {
    if (key === "công việc") {
      setIsBoardTask(true);
    } else {
      setIsBoardTask(false);
    }
  };

  return (
    <div className="p-4 left-0 bg-bgBoard z-50 right-0 top-14">
      {!isLoadingUsers ? (
        !isErrorUsers ? (
          <div className="flex items-center space-x-2 md:space-x-4">
            <header className="flex justify-between  items-center w-full ml-8 mr-1">
              {/* left header */}
              <div className="flex items-center gap-x-4">
                <Select
                  defaultValue={{ label: events[0].eventName, value: events }}
                  style={{
                    width: 300,
                  }}
                  bordered={false}
                  onChange={handleChangeEvent}
                  options={events.map((event) => {
                    const jsonString = JSON.stringify(event);
                    return {
                      label: (
                        <p className="font-semibold text-gray-600">
                          {event.eventName}
                        </p>
                      ),
                      value: jsonString,
                    };
                  })}
                  // onChange={handleChange}
                  size="middle"
                />
              </div>

              {/* search */}
              <div>
                <Input
                  placeholder="tìm kiếm công việc trong bảng "
                  style={{
                    width: 400,
                  }}
                  className=""
                  onChange={(e) => debouncedSearch(e.target.value)}
                  suffix={<SearchOutlined />}
                />
              </div>

              {/* right header */}
              <div className="flex justify-center items-center gap-x-3">
                <div className="border-r-[1px] border-r-solid border-gray-400 pr-2">
                  {!isLoadingEmployees ? (
                    !isErrorEmployees ? (
                      <Dropdown
                        menu={{
                          items: filterUser,
                        }}
                      >
                        <div className=" flex justify-center items-center gap-x-2 px-4 py-2 cursor-pointer  rounded-lg hover:bg-secondaryHover hover:text-secondary">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                              />
                            </svg>
                          </span>
                          <p>Bộ lọc</p>
                        </div>
                      </Dropdown>
                    ) : (
                      <AnErrorHasOccured />
                    )
                  ) : (
                    <LoadingComponentIndicator />
                  )}
                </div>

                <div className="hidden md:block border-r-[1px] border-r-solid border-gray-400 pr-2 cursor-pointer">
                  <Avatar.Group
                    maxCount={3}
                    maxStyle={{
                      color: "#D25B68",
                      backgroundColor: "#F4D7DA",
                    }}
                  >
                    {users?.map((member) => {
                      return (
                        <Tooltip
                          key={member?.id}
                          title={member?.fullName}
                          placement="top"
                        >
                          <Avatar src={member?.avatar ?? defaultImage} />
                        </Tooltip>
                      );
                    })}
                  </Avatar.Group>
                </div>

                <div>
                  <Dropdown
                    menu={{
                      items: settingHeader,
                      onClick,
                    }}
                    placement="bottomRight"
                    arrow={{
                      pointAtCenter: true,
                    }}
                  >
                    <span className="cursor-pointer text-secondary text-sm">
                      <AlignRightOutlined className="text-2xl" />
                    </span>
                  </Dropdown>
                </div>
              </div>
            </header>
          </div>
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </div>
  );
};

export default HeaderEvent;
