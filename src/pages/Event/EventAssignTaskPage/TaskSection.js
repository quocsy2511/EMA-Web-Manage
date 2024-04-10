import { useQuery } from "@tanstack/react-query";
import { Calendar, ConfigProvider, Drawer, Form, Spin, Tooltip } from "antd";
import clsx from "clsx";
import { motion } from "framer-motion";
import momenttz from "moment-timezone";
import React, { Fragment, memo, useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import {
  FaCheck,
  FaCircleArrowDown,
  FaCircleExclamation,
} from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import {
  IoArrowForwardCircleOutline,
  IoEllipsisHorizontalCircle,
} from "react-icons/io5";
import { MdEmojiEvents } from "react-icons/md";
import { getFreeDivision } from "../../../apis/divisions";

import vi_VN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { PiDotsThreeCircleVerticalFill } from "react-icons/pi";

const now = momenttz();

dayjs.locale("vi");

const StatusRender = memo(({ bg, text }) => (
  <div className="flex space-x-2 items-center">
    <div className={`w-2 h-2 ${bg} rounded-full`} />
    <p className="text-sm font-medium">{text}</p>
  </div>
));

const DrawerContainer = memo(
  ({ isDrawerOpen, setIsDrawerOpen, getColor, divisionChecking }) => {
    const mapPriory = {
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    return (
      <Drawer
        title={
          <div className="flex justify-between items-center space-x-3 w-full">
            <div className="">
              <p className="text-base font-semibold truncate">
                Lịch trình ngày{" "}
                <span className="underline truncate">
                  {momenttz(divisionChecking?.date).format("DD-MM-YYYY")}{" "}
                </span>
                của{" "}
                <span className="underline truncate">
                  {divisionChecking?.division?.divisionName}
                </span>
              </p>
            </div>
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
            {!divisionChecking?.division?.users?.[0]?.listEvent?.length ===
            0 ? (
              <div>
                <p className="text-lg text-center">Không có công việc nào !</p>
              </div>
            ) : (
              divisionChecking?.division?.users?.[0]?.listEvent?.map(
                (event) => {
                  // filter task list
                  const listTasks = event?.listTask
                    ?.filter((task) => {
                      if (
                        divisionChecking?.date >= task?.startDate &&
                        divisionChecking?.date <= task?.endDate
                      ) {
                        return task;
                      }
                    })
                    ?.sort(
                      (a, b) => mapPriory[a?.priority] - mapPriory[b?.priority]
                    );

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
                                  className={`max-w-[80%] text-sm font-medium w-auto truncate`}
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
                }
              )
            )}
          </div>
        </div>
      </Drawer>
    );
  }
);

const Item = memo(({ division, selectedId, handleSelectDivision }) => {
  const countTask = !division?.users?.[0]?.listEvent?.length
    ? 0
    : division?.users?.[0]?.listEvent?.reduce((total, item) => {
        return total + item?.totalTaskInEvent;
      }, 0);

  return (
    <div className="relative">
      <motion.div
        onClick={() => handleSelectDivision(division)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, type: "tween" }}
        className={clsx(
          "flex space-x-5 items-center rounded-xl p-3 border-2 cursor-pointer group",
          { "border-blue-400": selectedId === division?.users?.[0]?.id },
          {
            "hover:border-blue-500 transition-colors":
              selectedId !== division?.users?.[0]?.id,
          }
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-center w-10 h-10 border rounded-full",
            { "border-blue-500": selectedId === division?.users?.[0]?.id },
            {
              "group-hover:border-blue-500 transition-colors":
                selectedId !== division?.users?.[0]?.id,
            }
          )}
        >
          {selectedId === division?.users?.[0]?.id && (
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
              {division?.users?.[0]?.profile?.fullName}
            </span>{" "}
            quản lý
          </p>
        </div>

        {division?.users?.[0]?.isFree ? (
          <div></div>
        ) : (
          <Tooltip title={`Đang thực hiện ${countTask} hạng mục`}>
            <p className="bg-red-500 text-white font-medium w-5 h-5 rounded-full flex items-center justify-center">
              {countTask}
            </p>
          </Tooltip>
        )}
      </motion.div>
    </div>
  );
});

const TaskSection = ({
  form,
  isSelectDate,
  eventId,
  updateDataDivision,
  setHasBusyUser,
}) => {
  const [selectedId, setSelectedId] = useState();
  const [divisionChecking, setDivisionChecking] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // update tassk
    if (updateDataDivision) {
      setSelectedId(updateDataDivision?.[0]);
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

  const {
    data: divisions,
    isLoading: divisionsIsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["free-division", eventId, selectedDate?.[0], selectedDate?.[1]],
    () => getFreeDivision(eventId, selectedDate?.[0], selectedDate?.[1]),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
      enabled: !!selectedDate,
    }
  );

  const handleSelectDivision = (division) => {
    if (
      division?.users?.[0]?.listEvent?.reduce((total, item) => {
        return total + item?.totalTaskInEvent;
      }, 0) > 0
    ) {
      setHasBusyUser([true]);
    } else {
      setHasBusyUser([false]);
    }

    if (division?.users?.[0]?.id === selectedId) {
      setSelectedId();
      form.setFieldsValue({ assignee: undefined });
    } else {
      setSelectedId(division?.users?.[0]?.id);
      form.setFieldsValue({ assignee: [division?.users?.[0]?.id] });
    }
  };

  const handleSetDivisionChecking = (division, date) => {
    setDivisionChecking({ division, date });
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
        setIsDrawerOpen={setIsDrawerOpen}
        getColor={getColor}
        getPriority={getPriority}
        divisionChecking={divisionChecking}
      />

      {/* <div className="flex space-x-10">
        <p className="w-1/4 text-lg font-medium">Bộ phận chịu trách nhiệm</p>
        <p className="flex-1 text-black text-lg font-medium">
          {isSelectDate
            ? `Lịch trình bắt đầu từ ngày ${isSelectDate?.[0].format(
                "DD-MM-YYYY"
              )}`
            : "Lịch trình"}
        </p>
      </div> */}

      <Spin spinning={divisionsIsLoading} className="my-[15%]">
        <div className="">
          {/* Division list */}
          <div className="h-full max-h-screen overflow-scroll scrollbar-hide">
            <p className="text-lg font-medium">Bộ phận chịu trách nhiệm</p>
            <Form.Item name="assignee">
              <div className="flex overflow-x-scroll space-x-5 px-3 py-5">
                {divisionsIsError ? (
                  <p className="text-lg font-medium text-center">
                    Không thể lấy dữ liệu hãy thử lại sau !
                  </p>
                ) : (
                  <>
                    {divisions?.map((division, index) => (
                      <Item
                        key={division?.id}
                        division={division}
                        selectedId={selectedId}
                        handleSelectDivision={handleSelectDivision}
                        isSelectDate={isSelectDate}
                        // Update data flow
                        updateDataDivision={
                          updateDataDivision ? updateDataDivision : null
                        }
                      />
                    ))}
                  </>
                )}
              </div>
            </Form.Item>
          </div>

          {/* Calendar */}
          <div className="flex-1">
            <div className="mt-2 h-full">
              <p className="flex-1 text-black text-lg font-medium">
                {/* {isSelectDate
                  ? `Lịch trình bắt đầu từ ngày ${isSelectDate?.[0].format(
                      "DD-MM-YYYY"
                    )}`
                  : "Lịch trình"} */}
                {selectedId
                  ? `Lịch trình của [ ${
                      divisions?.find(
                        (item) => item?.users?.[0]?.id === selectedId
                      )?.divisionName
                    } ]`
                  : "Lịch trình tổng quát"}
              </p>
              <ConfigProvider locale={vi_VN}>
                <Calendar
                  fullscreen={true}
                  value={
                    isSelectDate
                      ? dayjs(
                          isSelectDate?.[0]?.format("YYYY-MM-DD"),
                          "YYYY-MM-DD"
                        )
                      : undefined
                  }
                  // onSelect={(value, info) => {
                  //   setCalendarDateChecking(momenttz(value.$d));
                  //   setIsDrawerOpen(true);
                  // }}
                  onPanelChange={(value, mode) => {
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

                    divisions?.map((division) => {
                      const user = division?.users?.[0];

                      if (!!user?.listEvent?.length) {
                        if (
                          !renderList?.find((item) => item?.id === division?.id)
                        ) {
                          if (
                            user?.listEvent?.[0]?.listTask?.find(
                              (task) =>
                                currentMoment >= task?.startDate &&
                                currentMoment <= task?.endDate
                            )
                          ) {
                            renderList = [...renderList, division];
                          }
                        }
                      }
                    });

                    if (selectedId)
                      renderList = renderList?.filter(
                        (item) => item?.users?.[0]?.id === selectedId
                      );

                    // return info.originNode;
                    if (!!renderList?.length)
                      return (
                        <div className="gap-y-5 mb-3">
                          {renderList?.map((item) => {
                            const { borderColor, textColor } = getColor(
                              item?.status
                            );

                            return (
                              <div
                                key={currentMoment + item?.id}
                                onClick={() =>
                                  handleSetDivisionChecking(
                                    item,
                                    currentMoment
                                  ) & setIsDrawerOpen(true)
                                }
                              >
                                <div
                                  className={clsx(
                                    `border ${borderColor} py-1 px-3 rounded-full mt-2 relative`
                                  )}
                                >
                                  <p
                                    className={clsx(
                                      `text-center text-base ${textColor} font-normal truncate`
                                    )}
                                  >
                                    {item?.divisionName}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                  }}
                />
              </ConfigProvider>
            </div>
          </div>
        </div>
      </Spin>
    </Fragment>
  );
};

export default memo(TaskSection);
