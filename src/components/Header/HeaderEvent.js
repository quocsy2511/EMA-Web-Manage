import {
  CheckOutlined,
  ClearOutlined,
  DollarOutlined,
  FileDoneOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Dropdown, Input, Select, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { getAllUser } from "../../apis/users";
import moment from "moment";
import defaultImage from "../../assets/images/pngwing.com.png";
import AnErrorHasOccured from "../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";
import { debounce } from "lodash";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";

const HeaderEvent = ({
  sort,
  setSort,
  events,
  setSelectEvent,
  selectEvent,
  isBoardTask,
  setIsBoardTask,
  setSearchText,
  searchText,
  setFilterMember,
  filterMember,
  setStatusSelected,
  statusSelected,
  isDashBoard = false,
}) => {
  const divisionId = useRouteLoaderData("staff").divisionID;
  const staffID = useRouteLoaderData("staff").id;
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);
  const listRole = ["STAFF", "EMPLOYEE"];
  const notification = useSelector((state) => state.notification);
  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
  } = useQuery(
    ["users-division"],
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
        listUsers.sort((a, b) => {
          return listRole.indexOf(a.role) - listRole.indexOf(b.role);
        });
        return listUsers;
      },

      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (notification?.eventId && events && events.length > 0 && users) {
      const findEvent = events.find(
        (item) => item.id === notification?.eventId
      );
      const parseEvent = JSON.stringify(findEvent);

      handleChangeEvent(parseEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification?.id, events, users]);

  const handleChangeEvent = (value) => {
    const event = JSON.parse(value);
    setSelectEvent(event);
  };

  const debouncedSearch = debounce((value) => {
    setSearchText(value);
  }, 500);

  const listStatus = [
    { label: "CHUẨN BỊ", value: "PENDING", color: "default" },
    { label: "ĐANG DIỄN RA", value: "PROCESSING", color: "processing" },
    { label: "HOÀN THÀNH", value: "DONE", color: "green" },
    { label: "XÁC NHẬN", value: "CONFIRM", color: "purple" },
    { label: "ĐÃ HUỶ", value: "CANCEL", color: "red" },
    { label: "QUÁ HẠN", value: "OVERDUE", color: "red" },
  ];
  //custom dropdown
  const filterUser = [
    {
      key: "1",
      type: "group",
      label: "Thành viên",
      children: users?.map((item) => {
        return {
          key: item.id,
          label:
            item.id === filterMember ? (
              <div className="flex flex-row gap-x-2 justify-start items-center w-fit h-fit text-secondary text-base">
                {item.role === "STAFF" ? (
                  <>
                    <Tooltip
                      key={item.key}
                      title={item.fullName}
                      placement="top"
                    >
                      <Avatar src={item?.avatar ?? defaultImage} size={24} />
                    </Tooltip>
                    <p className="text-ellipsis w-full flex-1 overflow-hidden ">
                      {item.fullName}
                    </p>
                    <StarFilled className="text-yellow-400" />
                  </>
                ) : (
                  <>
                    <Tooltip
                      key={item.key}
                      title={item.fullName}
                      placement="top"
                    >
                      <Avatar src={item?.avatar ?? defaultImage} size={24} />
                    </Tooltip>
                    <p className="text-ellipsis w-full flex-1 overflow-hidden ">
                      {item.fullName}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-row gap-x-2 justify-start items-center w-fit h-fit opacity-60">
                {item.role === "STAFF" ? (
                  <>
                    <Tooltip
                      key={item.key}
                      title={item.fullName}
                      placement="top"
                    >
                      <Avatar src={item?.avatar ?? defaultImage} size={24} />
                    </Tooltip>
                    <p className="text-ellipsis w-full flex-1 overflow-hidden ">
                      {item.fullName}
                    </p>
                    <StarFilled className="text-yellow-400" />
                  </>
                ) : (
                  <>
                    <Tooltip
                      key={item.key}
                      title={item.fullName}
                      placement="top"
                    >
                      <Avatar src={item?.avatar ?? defaultImage} size={24} />
                    </Tooltip>
                    <p className="text-ellipsis w-full flex-1 overflow-hidden ">
                      {item.fullName}
                    </p>
                  </>
                )}
              </div>
            ),
        };
      }),
    },
    {
      key: 2,
      type: "group",
      label: "Trạng thái Công việc",
      children: listStatus.map((status) => {
        return {
          key: status.value,
          label: (
            <div key={status.value} className="pl-2">
              {status.value === statusSelected ? (
                <Tag color={status.color}>
                  {status.label}{" "}
                  <CheckOutlined className="text-green-400 ml-2" />
                </Tag>
              ) : (
                <Tag
                  color={status.color}
                  className="opacity-50"
                  bordered={false}
                >
                  {status.label}
                </Tag>
              )}
            </div>
          ),
        };
      }),
    },
    {
      key: "clear",
      label: (
        <div className="flex justify-center items-center py-3 hover:text-red-400">
          <ClearOutlined />
        </div>
      ),
    },
  ];

  const onClickFilterMember = ({ key }) => {
    const isKeyInListStatus = listStatus.some((status) => status.value === key);
    if (isKeyInListStatus === false && key !== "clear") {
      setFilterMember(key);
    } else if (isKeyInListStatus === false && key === "clear") {
      setStatusSelected(key);
      // setFilterMember(staffUsers?.id);
      setFilterMember(staffID);
    } else {
      setStatusSelected(key);
    }
    // setFilterMember(key);
  };

  //tắt dropdown khi nó click ra ngoài vùng menu
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 left-0 bg-bgBoard z-40 right-0 top-14">
      <AnimatePresence mode="wait">
        {!isLoadingUsers ? (
          !isErrorUsers ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 md:space-x-4"
            >
              <header className="flex justify-between  items-center w-full ml-8 mr-1">
                {/* left header */}
                <div className="flex items-center gap-x-4 ">
                  <Select
                    value={
                      selectEvent ? JSON.stringify(selectEvent) : undefined
                    }
                    defaultValue={{ label: events[0].eventName, value: events }}
                    // bordered={false}
                    className="min-w-[120px] shadow-md rounded-lg"
                    popupMatchSelectWidth={false}
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
                    size="middle"
                  />
                </div>
                {!isDashBoard && (
                  <div className="flex-1 flex justify-end items-center gap-x-3">
                    {/* budget */}
                    <div className="flex-1 flex flex-row gap-x-2 text-sm">
                      <AnimatePresence mode="wait">
                        {!isBoardTask ? (
                          <motion.span
                            key="budget"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.3, type: "tween" }}
                            className="flex-1 text-end"
                          >
                            <div
                              className="hover:text-blue-500 cursor-pointer inline-block"
                              onClick={() => setIsBoardTask(true)}
                            >
                              <div className="flex items-center gap-x-2">
                                <FileDoneOutlined className="text-xl" />
                                Công việc
                              </div>
                            </div>
                          </motion.span>
                        ) : (
                          <motion.div
                            key="taskss"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.3, type: "tween" }}
                            className="flex-1 flex justify-end items-center gap-x-3"
                          >
                            <div className="flex-1 flex justify-center">
                              <Input
                                className="w-[50%]"
                                allowClear
                                placeholder="tìm kiếm công việc "
                                onChange={(e) =>
                                  debouncedSearch(e.target.value)
                                }
                                suffix={<SearchOutlined />}
                              />
                            </div>
                            <div className="flex justify-end items-center gap-x-3">
                              <span
                                className=" flex gap-x-2 justify-center items-center hover:text-blue-500 cursor-pointer"
                                onClick={() => setIsBoardTask(false)}
                              >
                                <DollarOutlined className="text-xl" />
                                Ngân sách
                              </span>
                              <div className="hidden md:block border-l-[1px] border-r-solid border-gray-400 pl-2 cursor-pointer hover:text-blue-500 ">
                                {sort === "DESC" ? (
                                  <span
                                    className="flex flex-row gap-x-2 justify-center items-center"
                                    onClick={() => setSort("ASC")}
                                  >
                                    <HiSortDescending size={24} />
                                    Thời gian
                                  </span>
                                ) : (
                                  <span
                                    className="flex flex-row gap-x-2 justify-center items-center"
                                    onClick={() => setSort("DESC")}
                                  >
                                    <HiSortAscending size={24} />
                                    Thời gian
                                  </span>
                                )}
                              </div>
                              <div
                                className="hidden md:block border-l-[1px] border-r-solid border-gray-400 pl-2 cursor-pointer hover:text-blue-500 "
                                ref={dropdownRef}
                              >
                                <Dropdown
                                  menu={{
                                    items: filterUser,
                                    onClick: onClickFilterMember,
                                  }}
                                  trigger={["click"]}
                                  placement="bottomRight"
                                  arrow
                                  open={visible}
                                  onOpenChange={setVisible}
                                >
                                  <span className="flex flex-row gap-x-2 justify-center items-center">
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
                                    Bộ lọc
                                  </span>
                                </Dropdown>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="hidden md:block border-l-[1px] border-r-solid border-gray-400 pl-2 cursor-pointer">
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
                  </div>
                )}
              </header>
            </motion.div>
          ) : (
            <AnErrorHasOccured />
          )
        ) : (
          <motion.div
            key="header-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingComponentIndicator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderEvent;
