import React, { Fragment, memo, useEffect, useState } from "react";
import { Calendar, ConfigProvider, Drawer, Form, Spin, Tooltip } from "antd";
import { FaCheck } from "react-icons/fa6";
import { MdArrowForwardIos, MdEmojiEvents } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import momenttz from "moment-timezone";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllDivision, getDivisionFreeUser } from "../../../apis/divisions";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";
import clsx from "clsx";
import {
  IoArrowForwardCircleOutline,
  IoEllipsisHorizontalCircle,
} from "react-icons/io5";
import { BsExclamationCircle } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import viVN from "antd/es/locale/vi_VN";

const DrawerContainer = memo(
  ({
    isDrawerOpen,
    setIsDrawerOpen,
    calendarDateChecking,
    tasks,
    getColor,
    getPriority,
  }) => {
    console.log("tasks> ", tasks);

    return (
      <Drawer
        title={
          <div className="flex items-center space-x-10">
            <IoClose
              className="text-xl text-slate-400"
              onClose={() => setIsDrawerOpen(false)}
            />
            <p className="text-xl font-semibold">
              Lịch trình ngày{" "}
              {calendarDateChecking?.clone().format("DD-MM-YYYY")}
            </p>
          </div>
        }
        placement={"right"}
        closable={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        key={"right"}
        width={"30%"}
        className="bg-red-200"
      >
        {/* Content */}
        <div className="space-y-10">
          {!tasks?.listEvent ? (
            <p className="text-lg text-center">Chưa chọn khoảng thời gian cần kiểm tra !</p>
          ) : tasks?.listEvent?.length === 0 ? (
            <div>
              <p className="text-lg text-center">Không có công việc nào !</p>
            </div>
          ) : (
            tasks?.listEvent?.map((event) => {
              // filter task list
              const listTasks = event?.listTask?.filter((task) => {
                const start = momenttz(task?.startDate, "DD-MM-YYYY");
                const end = momenttz(task?.endDate, "DD-MM-YYYY");

                if (
                  calendarDateChecking?.isBetween(start, end, "day") ||
                  calendarDateChecking?.isSame(start, "day") ||
                  calendarDateChecking?.isSame(end, "day")
                ) {
                  return task;
                }
              });

              if (listTasks?.length !== 0)
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

                    <div className="ml-5">
                      {listTasks?.map((task) => {
                        const icon = getPriority(task?.priority);
                        const { textColor, statusText } = getColor(
                          task?.status
                        );

                        return (
                          <div
                            key={task?.id}
                            className="flex items-center space-x-3 bg-red-20"
                          >
                            {/* {icon} */}
                            <GoDotFill className="text-sm" />
                            <p
                              className={`text-sm font-medium w-auto truncate`}
                            >
                              {task?.title} :{" "}
                            </p>
                            <p
                              className={`text-xs font-medium ${textColor} truncate`}
                            >
                              {statusText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
            })
          )}
        </div>
      </Drawer>
    );
  }
);

const Item = memo(
  ({
    division,
    selectedId,
    handleSelectDivision,
    setCalendarChecking,
    isSelectDate,

    updateDataDivision,
  }) => {
    //
    if (updateDataDivision && updateDataDivision?.[0] === division?.userId) {
      handleSelectDivision(division);
    }

    return (
      <div className="relative">
        <motion.div
          onClick={() => handleSelectDivision(division)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, type: "tween" }}
          className={clsx(
            "flex space-x-5 items-center rounded-xl p-3 border-2 cursor-pointer",
            { "border-blue-400": selectedId?.id === division?.id }
          )}
        >
          <div
            className={clsx(
              "flex items-center justify-center w-10 h-10 border rounded-full",
              { "border-blue-500": selectedId?.id === division?.id }
            )}
          >
            {selectedId?.id === division?.id && (
              <FaCheck className="text-blue-500 text-base" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-base font-medium truncate">
              {division?.divisionName}
            </p>
            <p className="text-sm truncate">
              Do{" "}
              <span className="font-medium text-blue-600">
                {division?.userName}
              </span>{" "}
              quản lý
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0">
            <Tooltip
              title={
                isSelectDate ? (
                  "Xem chi tiết lịch trình"
                ) : (
                  <p className="text-center">
                    Vui lòng chọn thời gian để có thể xem lịch trình
                  </p>
                )
              }
              className="h-full px-5"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelectDate) {
                    setCalendarChecking(division);
                  }
                }}
                className="group flex justify-center items-center"
              >
                <MdArrowForwardIos className="text-xl text-slate-300 cursor-pointer group-hover:text-black transition-colors" />
              </div>
            </Tooltip>
          </div>
        </motion.div>
      </div>
    );
  }
);

const TaskSection = ({
  form,
  isSelectDate,
  listDivision,
  updateDataDivision,
}) => {
  const [selectedId, setSelectedId] = useState();
  const [calendarChecking, setCalendarChecking] = useState();
  const [calendarDateChecking, setCalendarDateChecking] = useState();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Reset calendarChecking
  useEffect(() => {
    if (!isSelectDate) setCalendarChecking();
  }, [isSelectDate]);

  const {
    data: divisions,
    isLoading: divisionsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["divisions"],
    () => getAllDivision({ pageSize: 100, currentPage: 1, mode: 1 }),
    {
      select: (data) => {
        return data
          ?.filter(
            (division) =>
              division?.status && listDivision?.includes(division?.id)
          )
          .map((division) => ({
            id: division?.users?.[0]?.id,
            divisionName: division?.divisionName,
            userId: division?.users?.[0]?.id,
            userName: division?.users?.[0]?.profile?.fullName,
          }));
      },
    }
  );
  console.log("divisions > ", divisions);

  const {
    data: calendarData,
    isLoading: calendarIsLoading,
    isError: calendarIsError,
  } = useQuery(
    [
      "free-user",
      "id",
      calendarChecking?.userId,
      isSelectDate?.[0]?.format("DD-MM-YYYY"),
      isSelectDate?.[1]?.format("DD-MM-YYYY"),
    ],
    () =>
      getDivisionFreeUser(
        "id",
        calendarChecking?.userId,
        isSelectDate?.[0]?.format("DD-MM-YYYY"),
        isSelectDate?.[1]?.format("DD-MM-YYYY")
      ),
    {
      select: (data) => {
        const userTasks = data?.users?.find(
          (item) => item?.id === calendarChecking?.userId
        );

        return {
          ...data,
          tasks: userTasks,
          calendarTasks: userTasks?.listEvent
            ?.map((event) => {
              return event?.listTask?.map((task) => ({
                ...task,
                startDate: momenttz(task?.startDate, "DD-MM-YYYY"),
                endDate: momenttz(task?.endDate, "DD-MM-YYYY"),
              }));
            })
            ?.flat(),
        };
      },
      enabled: !!isSelectDate && !!calendarChecking?.userId,
      refetchOnWindowFocus: false,
    }
  );
  console.log("calendarData > ", calendarData);

  const handleSelectDivision = (division) => {
    setSelectedId(division);
    form.setFieldsValue({ assignee: [division?.id] });
    console.log(form.getFieldsValue());
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

  const getPriority = (priority) => {
    let icon;

    switch (priority) {
      case "LOW":
        icon = (
          <IoArrowForwardCircleOutline className="text-sm text-green-500 rotate-90" />
        );
        break;
      case "MEDIUM":
        icon = (
          <IoEllipsisHorizontalCircle className="text-sm text-orange-400" />
        );
        break;
      case "HIGH":
        icon = <BsExclamationCircle className="text-sm text-red-500" />;
        break;

      default:
        icon = (
          <IoArrowForwardCircleOutline className="text-sm text-green-500 rotate-90" />
        );
        break;
    }

    return icon;
  };

  return (
    <Fragment>
      <DrawerContainer
        isDrawerOpen={isDrawerOpen}
        // isDrawerOpen
        setIsDrawerOpen={setIsDrawerOpen}
        calendarDateChecking={calendarDateChecking}
        tasks={calendarData?.tasks}
        getColor={getColor}
        getPriority={getPriority}
      />

      <div className="flex space-x-10">
        <p className="w-1/3 text-lg font-medium">Bộ phận chịu trách nhiệm</p>
        <p className="flex-1 text-black text-lg font-medium">
          {calendarIsError
            ? "Không thể lấy dữ liệu! Hãy thử lại sau"
            : !calendarChecking
            ? "Chọn 1 bộ phận để xem lịch trình"
            : "Lịch trình của"}{" "}
          <span className="text-black">{calendarChecking?.divisionName}</span>
        </p>
      </div>

      <div className="flex space-x-10 h-screen">
        {/* Division list */}
        <div className="w-1/3 h-full max-h-screen overflow-scroll scrollbar-hide">
          <Form.Item name="assignee">
            <div className="space-y-5 mt-5 px-3">
              {divisionsLoading ? (
                <div className="mt-5">
                  <LoadingComponentIndicator />
                </div>
              ) : divisionsIsError ? (
                <p className="mt-5 text-lg font-medium">
                  Không thể lấy dữ liệu hãy thử lại sau !
                </p>
              ) : (
                divisions?.map((division, index) => (
                  <Item
                    key={division?.id ?? index}
                    division={division}
                    selectedId={selectedId}
                    handleSelectDivision={handleSelectDivision}
                    setCalendarChecking={setCalendarChecking}
                    isSelectDate={isSelectDate}
                    // Update data flow
                    updateDataDivision={
                      updateDataDivision ? updateDataDivision : null
                    }
                  />
                ))
              )}
            </div>
          </Form.Item>
        </div>

        {/* Calendar */}
        <div className="flex-1">
          <div className="mt-2 border h-full">
            <Spin
              spinning={isSelectDate ? calendarIsLoading : false}
              className="mt-[15%]"
            >
              <ConfigProvider
                locale={viVN}
                theme={{
                  token: {
                    colorText: "#1677ff",
                    colorTextHeading: "#000000",
                    fontSize: 15,
                    fontWeightStrong: 800,
                    controlHeightLG: 30,
                  },
                }}
              >
                <Calendar
                  headerRender={() => {}}
                  fullscreen={true}
                  disabledDate={(currentDate) => {
                    const current = momenttz(currentDate?.$d);

                    return (
                      current.isBefore(isSelectDate?.[0], "day") ||
                      current.isAfter(isSelectDate?.[1], "day")
                    );
                  }}
                  // locale={viVN}
                  onSelect={(value, info) => {
                    setCalendarDateChecking(momenttz(value.$d));
                    setIsDrawerOpen(true);
                  }}
                  onPanelChange={(value, mode) => {
                    console.log("month change > ", value.format("YYYY-MM-DD"));
                  }}
                  cellRender={(current) => {
                    let renderList;
                    const currentMoment = momenttz(current?.$d);

                    // Compare to the selected date
                    if (
                      currentMoment.isBetween(
                        isSelectDate?.[0],
                        isSelectDate?.[1],
                        "day"
                      ) ||
                      currentMoment.isSame(isSelectDate?.[0], "day") ||
                      currentMoment.isSame(isSelectDate?.[1], "day")
                    ) {
                      // Compare to the date gap in each task
                      calendarData?.calendarTasks?.map((task) => {
                        if (
                          currentMoment.isBetween(
                            task?.startDate,
                            task?.endDate,
                            "day"
                          ) ||
                          currentMoment.isSame(task?.startDate, "day") ||
                          currentMoment.isSame(task?.endDate, "day")
                        ) {
                          if (renderList) renderList = [...renderList, task];
                          else renderList = [task];
                        }
                      });
                    }

                    // return info.originNode;
                    if (renderList)
                      return (
                        <div className="gap-y-5 mb-3">
                          {renderList?.map((item, index) => {
                            const { borderColor, textColor, statusText } =
                              getColor(item?.status);

                            const icon = getPriority(item?.priority);

                            return (
                              <div>
                                <Tooltip
                                  key={item?.id + index ?? index}
                                  placement="top"
                                  title={statusText}
                                  className="relative"
                                >
                                  <div
                                    className={clsx(
                                      `border ${borderColor} py-1 px-3 rounded-xl mt-2`
                                    )}
                                  >
                                    <p
                                      className={clsx(
                                        `text-center text-xs ${textColor} font-normal truncate`
                                      )}
                                    >
                                      {item?.title}
                                    </p>
                                  </div>
                                  <div className="absolute -top-[20%] left-1.5 bg-white rounded-full">
                                    {icon}
                                  </div>
                                </Tooltip>
                              </div>
                            );
                          })}
                        </div>
                      );
                  }}
                />
              </ConfigProvider>
            </Spin>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(TaskSection);
