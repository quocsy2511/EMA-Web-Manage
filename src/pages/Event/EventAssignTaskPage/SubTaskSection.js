import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Calendar,
  ConfigProvider,
  Drawer,
  Dropdown,
  Form,
  Spin,
  Tooltip,
} from "antd";
import momenttz from "moment-timezone";
import { useQuery } from "@tanstack/react-query";
import { getDivisionFreeUser } from "../../../apis/divisions";
import { MdEmojiEvents, MdCategory } from "react-icons/md";
import {
  FaCheck,
  FaCircleArrowDown,
  FaCircleExclamation,
} from "react-icons/fa6";
import { PiMedal } from "react-icons/pi";
import { BsExclamationCircle } from "react-icons/bs";
import {
  IoEllipsisHorizontalCircle,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { IoIosCheckbox } from "react-icons/io";
import { PiDotsThreeCircleVerticalFill } from "react-icons/pi";
import { motion } from "framer-motion";
import clsx from "clsx";
import TEXT from "../../../constants/string";
import dayjs from "dayjs";
import vi_VN from "antd/locale/vi_VN";

const now = momenttz();

dayjs.locale("vi");

const StatusRender = memo(({ bg, text }) => (
  <div className="flex space-x-2 items-center mr-10">
    <div className={`w-2 h-2 ${bg} rounded-full`} />
    <p className="text-sm font-medium">{text}</p>
  </div>
));

const PriorityRender = memo(({ icon, text }) => (
  <div className="flex space-x-2 items-center mr-10">
    <div className="">{icon}</div>
    <p className="w-3/4 text-sm font-medium truncate">{text}</p>
  </div>
));

const DrawerContainer = memo(
  ({ isDrawerOpen, setIsDrawerOpen, getColor, userChecking }) => {
    console.log("userChecking> ", userChecking);

    const mapPriory = {
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    return (
      <Drawer
        title={
          <div className="flex justify-between items-center space-x-3">
            <p className="flex-1 text-base font-semibold truncate">
              Lịch trình ngày{" "}
              <span className="underline">
                {momenttz(userChecking?.date).format("DD-MM-YYYY")}{" "}
              </span>
              của{" "}
              <span className="underline">
                {userChecking?.user?.profile?.fullName}
              </span>
            </p>
          </div>
        }
        placement={"right"}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        key={"right"}
        width={"30%"}
      >
        {/* Content */}
        <div className="space-y-2">
          <div className="flex space-x-5">
            <p className="text-base font-medium">Trạng thái :</p>
            <div className="flex items-center space-x-4">
              <StatusRender bg="bg-gray-400" text="Đang chuẩn bị" />
              <StatusRender bg="bg-blue-500" text="Đang thực hiện" />
            </div>
          </div>

          <div className="flex space-x-5">
            <p className="text-base font-medium">Độ ưu tiên :</p>
            <div className="flex items-center space-x-4">
              <StatusRender bg="bg-gray-400" text="Đang chuẩn bị" />
              <StatusRender bg="bg-blue-500" text="Đang thực hiện" />
            </div>
          </div>

          <div className="space-y-10 pt-6">
            {!userChecking?.user?.listEvent?.length ? (
              <div>
                <p className="text-lg text-center">Không có công việc nào !</p>
              </div>
            ) : (
              userChecking?.user?.listEvent?.map((event) => {
                // filter task list
                const listTasks = event?.listTask
                  ?.filter(
                    (task) =>
                      userChecking?.date >= task?.startDate &&
                      userChecking?.date <= task?.endDate
                  )
                  ?.sort((a, b) => mapPriory[a?.priority] - mapPriory[b?.priority]);

                if (!!listTasks?.length)
                  return (
                    <div key={event?.eventID} className="w-full space-y-3">
                      <div className="flex items-center bg-gray-50 rounded-full">
                        <div className="border-2 border-blue-500 rounded-full p-2">
                          <MdEmojiEvents className="text-xl text-blue-500" />
                        </div>

                        <div className="flex-1 flex items-center space-x-2">
                          <div className="bg-blue-500 h-0.5 flex-1" />
                          <Tooltip title={event?.eventName}>
                            <p className="w-auto max-w-xs text-center text-base font-medium truncate cursor-pointer">
                              {event?.eventName}
                            </p>
                          </Tooltip>
                          <div className="bg-blue-500 h-0.5 flex-1" />
                        </div>
                      </div>

                      <div className="ml-5 space-y-1">
                        {listTasks?.map((task) => {
                          const { textColor } = getColor(task?.status);

                          return (
                            <div
                              key={task?.id}
                              className="flex items-center space-x-3 bg-red-20"
                            >
                              {/* {icon} */}
                              <GoDotFill className={`${textColor}`} />
                              <p
                                className={`text-sm font-medium w-auto truncate`}
                              >
                                {task?.title}
                              </p>
                              {task?.priority === "LOW" ? (
                                <FaCircleArrowDown className="text-lg text-green-500" />
                              ) : task?.priority === "MEDIUM" ? (
                                <PiDotsThreeCircleVerticalFill className="text-2xl text-orange-400 rotate-90" />
                              ) : (
                                <FaCircleExclamation className="text-lg text-red-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
              })
            )}
          </div>
        </div>
      </Drawer>
    );
  }
);

const Item = memo(
  ({
    user,
    selectedEmployees,
    handleSelectUser,
    leader,
    handleSelectLeader,
  }) => {
    return (
      <div className="relative">
        <motion.div
          onClick={() => handleSelectUser(user)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, type: "tween" }}
          className={clsx(
            "flex space-x-5 items-center rounded-xl p-3 pr-4 border-2 cursor-pointer group relative",
            { "border-blue-400": selectedEmployees?.includes(user?.id) },
            { "border-orange-400": leader === user?.id },
            { "hover:border-blue-500": leader !== user?.id },
            { "hover:border-orange-400": !leader }
          )}
        >
          <div
            className={clsx(
              "flex items-center justify-center w-10 h-10 border transition-colors rounded-full",
              { "border-blue-500": selectedEmployees?.includes(user?.id) },
              { "border-orange-400": leader === user?.id },
              { "group-hover:border-blue-500": leader !== user?.id },
              { "group-hover:border-orange-400": !leader }
            )}
          >
            {selectedEmployees?.includes(user?.id) && (
              <FaCheck
                className={clsx("text-blue-500 text-base", {
                  "text-orange-400": leader === user?.id,
                })}
              />
            )}
          </div>

          <div className="flex-1">
            <p className="text-base font-medium truncate">
              {user?.profile?.fullName}
            </p>

            <div className="flex items-center space-x-2">
              {user?.isFree ? (
                <div className="flex space-x-5 items-center justify-between pr-3">
                  <p className="text-sm truncate">Chưa có công việc</p>
                  <IoIosCheckbox className="text-green-500 text-xl" />
                </div>
              ) : (
                <p className="text-sm truncate">
                  Đang phụ trách{" "}
                  <span
                    className={clsx("font-medium text-blue-600", {
                      "text-orange-400": leader === user?.id,
                    })}
                  >
                    {user?.totalTask ?? 0}
                  </span>{" "}
                  công việc
                </p>
              )}
            </div>
          </div>

          {selectedEmployees?.includes(user?.id) && (
            <div className="absolute -top-4 right-5">
              <Tooltip title={leader !== user?.id && "Đổi trưởng nhóm"}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectLeader(user);
                  }}
                  className={clsx("border-2 bg-white rounded-full p-1", {
                    "border-orange-400": leader === user?.id,
                  })}
                >
                  <PiMedal
                    className={clsx(
                      "text-2xl",
                      {
                        "text-slate-300": leader !== user?.id,
                      },
                      {
                        "text-orange-400": leader === user?.id,
                      }
                    )}
                  />
                </div>
              </Tooltip>
            </div>
          )}
        </motion.div>
      </div>
    );
  }
);

const SubTaskSection = ({
  form,
  isSelectDate,
  taskResponsorId,
  updateDataUser,

  hasBusyUser,
  setHasBusyUser,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [userChecking, setUserChecking] = useState();
  const [leader, setLeader] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [filterUser, setFilterUser] = useState();
  console.log("filterUser > ", filterUser);

  useEffect(() => {
    // Update subtask
    if (updateDataUser) {
      setSelectedEmployees(updateDataUser);
      setLeader(updateDataUser?.[0]);
    }

    // init calendar date
    const numOfDaysInCurrentMonth = now
      .clone()
      .month(now.clone().month() + 1)
      .daysInMonth();

    setSelectedDate([
      now
        .clone()
        .startOf("month")
        .subtract(42 - numOfDaysInCurrentMonth, "days")
        .format("YYYY-MM-DD"),
      now
        .clone()
        .endOf("month")
        .add(42 - numOfDaysInCurrentMonth, "days")
        .format("YYYY-MM-DD"),
    ]);
  }, []);

  // Update assignee in form
  useEffect(() => {
    if (selectedEmployees.length === 0) {
      form.setFieldsValue({ assignee: undefined });
    } else {
      form.setFieldsValue({ assignee: selectedEmployees });
    }

    // handle remove the leader -> assign to the nearest
    if (!selectedEmployees.includes(leader)) {
      setLeader(selectedEmployees?.[0]);
    }
  }, [selectedEmployees]);

  // Update leader in form
  useEffect(() => {
    if (leader) form.setFieldsValue({ leader });
    else form.setFieldsValue({ leader: undefined });
  }, [leader]);

  const {
    data: users,
    isLoading: usersIsloading,
    isError: usersIsError,
  } = useQuery(
    ["free-user", taskResponsorId, selectedDate?.[0], selectedDate?.[1]],
    () =>
      getDivisionFreeUser(
        "id",
        taskResponsorId,
        selectedDate?.[0],
        selectedDate?.[1]
      ),
    {
      select: (data) => {
        return data?.users?.filter(
          (user) => user?.role?.roleName === TEXT.EMPLOYEE
        );
      },
      refetchOnWindowFocus: false,
      enabled: !!selectedDate,
    }
  );
  console.log("users > ", users);

  const handleSelectUser = (employee) => {
    console.log("employee > ", employee);
    setFilterUser(employee?.id);
    if (selectedEmployees?.length === 0) {
      setLeader(employee?.id);
    }

    if (selectedEmployees?.includes(employee?.id)) {
      // update busy user
      const index = hasBusyUser?.indexOf(!employee?.isFree);
      if (index !== -1) {
        const clone = [...hasBusyUser];
        clone.splice(index, 1);
        setHasBusyUser(clone);
      }

      setSelectedEmployees(
        (prev) => prev?.filter((item) => item !== employee?.id) ?? []
      );
    } else {
      // update busy user
      if (!employee?.isFree) setHasBusyUser((prev) => [...prev, true]);
      else setHasBusyUser((prev) => [...prev, false]);

      setSelectedEmployees((prev) => [...prev, employee?.id]);
    }
  };

  const handleSelectLeader = (employee) => {
    setLeader(employee?.id);
  };

  const handleSetUserChecking = (user, date) => {
    setUserChecking({ user, date });
  };

  const getColor = (status) => {
    let borderColor, textColor, statusText;

    switch (status) {
      case "PENDING":
        statusText = "Đang chuẩn bị";
        borderColor = "border-gray-400";
        textColor = "text-gray-400";
        break;

      case "PROCESSING":
        statusText = "Đang thực hiện";
        borderColor = "border-blue-400";
        textColor = "text-blue-400";
        break;

      case "DONE":
        statusText = "Hoàn thành";
        borderColor = "border-green-400";
        textColor = "text-green-400";
        break;

      case "CONFIRM":
        statusText = "Đã xác thực";
        borderColor = "border-purple-400";
        textColor = "text-purple-400";
        break;

      case "CANCEL":
        statusText = "Hủy bỏ";
        borderColor = "border-red-500";
        textColor = "text-red-500";
        break;

      case "OVERDUE":
        statusText = "Quá hạn";
        borderColor = "border-orange-500";
        textColor = "text-orange-500";
        break;

      default:
        statusText = "Đang chuẩn bị";
        borderColor = "border-black";
        textColor = "text-black";
        break;
    }

    return { borderColor, textColor, statusText };
  };

  return (
    <Fragment>
      <DrawerContainer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        getColor={getColor}
        userChecking={userChecking}
      />

      <Form.Item name="leader" className="h-0" />

      <Spin spinning={usersIsloading} className="my-[15%]">
        <div className="">
          {/* Employee list */}
          <div className="h-full overflow-scroll scrollbar-hide">
            <p className="text-lg font-medium">Nhân viên thực hiện</p>
            <Form.Item name="assignee">
              <div className="flex overflow-x-scroll space-x-5 px-3 py-5">
                {usersIsError ? (
                  <p className="mt-10 text-lg font-medium text-center">
                    Không thể lấy dữ liệu hãy thử lại sau !
                  </p>
                ) : (
                  users?.map((user) => (
                    <Item
                      key={user?.id}
                      user={user}
                      selectedEmployees={selectedEmployees}
                      handleSelectUser={handleSelectUser}
                      leader={leader}
                      handleSelectLeader={handleSelectLeader}
                    />
                  ))
                )}
              </div>
            </Form.Item>
          </div>

          {/* Calendar */}
          <div className="flex-1">
            <p className="flex-1 text-black text-lg font-medium">
              {isSelectDate
                ? `Lịch trình bắt đầu từ ngày ${isSelectDate?.[0].format(
                    "DD-MM-YYYY"
                  )}`
                : "Lịch trình"}
            </p>
            <ConfigProvider locale={vi_VN}>
              <Calendar
                // fullscreen={true}
                value={
                  isSelectDate
                    ? dayjs(
                        isSelectDate?.[0]?.format("YYYY-MM-DD"),
                        "YYYY-MM-DD"
                      )
                    : undefined
                }
                // onSelect={(value, info) => {
                //   // setCalendarDateChecking(momenttz(value.$d));
                //   !!userChecking && setIsDrawerOpen(true);
                // }}
                onPanelChange={(value, mode) => {
                  console.log("onPanelChange > ", value, mode);

                  const numOfDaysInCurrentMonth = value
                    .clone()
                    .month(value.clone().month() + 1)
                    .daysInMonth();

                  setSelectedDate([
                    value
                      .clone()
                      .startOf("month")
                      .subtract(42 - numOfDaysInCurrentMonth, "days")
                      .format("YYYY-MM-DD"),
                    value
                      .clone()
                      .endOf("month")
                      .add(42 - numOfDaysInCurrentMonth, "days")
                      .format("YYYY-MM-DD"),
                  ]);
                }}
                cellRender={(current) => {
                  let renderList = [];
                  const currentMoment = momenttz(current?.$d).format(
                    "YYYY-MM-DD"
                  );

                  users?.map((user) => {
                    if (!!user?.listEvent?.length) {
                      user?.listEvent?.map((event) => {
                        if (
                          event?.listTask?.find(
                            (task) =>
                              currentMoment >= task?.startDate &&
                              currentMoment <= task?.endDate
                          )
                        ) {
                          if (
                            !renderList?.find((item) => item?.id === user?.id)
                          ) {
                            renderList = [...renderList, user];
                          }
                        }
                      });
                    }
                  });

                  // console.log("renderList > ", renderList);
                  if (filterUser)
                    renderList = renderList?.filter(
                      (item) => item?.id === filterUser
                    );

                  // return info.originNode;
                  if (!!renderList?.length) {
                    return (
                      <div className="space-y-1 mb-3 mt-2">
                        {renderList?.map((user, index) => (
                          <motion.div
                            key={currentMoment + user?.id}
                            className=""
                            whileHover={{ y: -2 }}
                            onClick={() =>
                              handleSetUserChecking(user, currentMoment) &
                              setIsDrawerOpen(true)
                            }
                          >
                            {/* <Tooltip title="Xem chi tiết"> */}
                            {/* <p className="text-sm text-center font-medium truncate border border-black/30 rounded-full py-1 px-3 hover:border-black transition-colors">
                              {user?.profile?.fullName}
                            </p> */}
                            <div className="flex items-center space-x-3 mx-3">
                              <div className="h-[1px] w-3 bg-black" />
                              <p className="flex-1 text-base truncate">
                                {user?.profile?.fullName}
                              </p>
                            </div>
                            {/* </Tooltip> */}
                          </motion.div>
                        ))}
                      </div>
                    );
                  }
                }}
              />
            </ConfigProvider>
          </div>
        </div>
      </Spin>
    </Fragment>
  );
};

export default memo(SubTaskSection);
