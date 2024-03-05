import React, { Fragment, memo, useEffect, useState } from "react";
import { Calendar, ConfigProvider, Drawer, Spin, Tooltip, message } from "antd";
import momenttz from "moment-timezone";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import vi_VN from "antd/locale/vi_VN";
import { useQuery } from "@tanstack/react-query";
import { getTaskFilterByDate } from "../../apis/tasks";
import { useRouteLoaderData } from "react-router-dom";
import { MdEmojiEvents } from "react-icons/md";
import {
  IoArrowForwardCircle,
  IoEllipsisHorizontalCircleSharp,
} from "react-icons/io5";
import { FaExclamationCircle } from "react-icons/fa";

dayjs.locale("vi");

const now = momenttz();

const ScheduleDrawer = memo(
  ({ isDrawerOpen, setIsDrawerOpen, checkedDateData }) => {
    const data = [];

    checkedDateData?.map((dateData) => {
      if (!data.length) {
        data.push({ event: dateData?.eventDivision?.event, tasks: [dateData] });
      } else {
        if (
          data?.find(
            (item) => item?.event?.id === dateData?.eventDivision?.event?.id
          )
        ) {
          const index = data?.findIndex(
            (item) => item?.event?.id === dateData?.eventDivision?.event?.id
          );

          data[index].tasks.push(dateData);
        } else {
          data.push({
            event: dateData?.eventDivision?.event,
            tasks: [dateData],
          });
        }
      }
    });

    return (
      <Drawer
        placement={"right"}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        key={"right"}
        width={"30%"}
        title="Chi tiết lịch trình"
      >
        {/* Content */}
        <div className="space-y-10">
          {!data?.length ? (
            <div>
              <p className="text-lg text-center">Không có công việc nào !</p>
            </div>
          ) : (
            data?.map((item) => (
              <div key={item?.event?.id} className="w-full">
                <div className="flex items-center bg-gray-50 rounded-full">
                  <div className="border-2 border-blue-500 rounded-full p-2">
                    <MdEmojiEvents className="text-xl text-blue-500" />
                  </div>

                  <div className="flex-1 flex items-center space-x-2">
                    <div className="bg-blue-500 h-0.5 flex-1" />
                    <Tooltip title={item?.event?.eventName}>
                      <p className="w-auto max-w-xs text-center text-base font-medium truncate cursor-pointer">
                        {item?.event?.eventName}
                      </p>
                    </Tooltip>
                    <div className="bg-blue-500 h-0.5 flex-1" />
                  </div>
                </div>

                <div className="ml-5 mt-3 space-y-5">
                  {!!item?.tasks?.length &&
                    item?.tasks?.map((task) => {
                      const { bg } = checkStatus(task?.status);
                      const icon = checkPriority(task?.priority);

                      return (
                        <div>
                          <div
                            className={`${bg} px-3 py-1 rounded-lg relative`}
                          >
                            <Tooltip title={task?.title}>
                              <p className="text-base text-white font-medium pr-4 truncate cursor-pointer">
                                {task?.title}
                              </p>
                            </Tooltip>
                            <div className="absolute -top-2.5 right-3">
                              {icon}
                            </div>
                          </div>

                          <div className="mx-6 mt-2 space-y-1">
                            {!!task?.subTask?.length &&
                              task?.subTask?.map((subtask) => {
                                const { bg } = checkStatus(subtask?.status);
                                return (
                                  <div className="flex space-x-2 items-center">
                                    <div
                                      className={`w-2 h-2 ${bg} rounded-full`}
                                    />
                                    <p className="text-sm flex-1 truncate">
                                      {subtask?.title}
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>
    );
  }
);

const StatusRender = memo(({ bg, text }) => (
  <div className="flex space-x-2 items-center mr-10">
    <div className={`w-2 h-2 ${bg} rounded-full`} />
    <p className="text-sm font-medium">{text}</p>
  </div>
));

const checkStatus = (status) => {
  let bg, text;
  switch (status) {
    case "PENDING":
      bg = "bg-blue-400";
      text = "Đang chuẩn bị";
      break;
    case "PROCESSING":
      bg = "bg-blue-400";
      text = "Đang thực hiện";
      break;
    case "CONFIRM":
      bg = "bg-green-500";
      text = "Hoàn thành";
      break;
    case "DONE":
      bg = "bg-purple-500";
      text = "Đã xác thực";
      break;
    case "CANCEL":
      bg = "bg-red-500";
      text = "Hủy bỏ";
      break;
    case "OVERDUE":
      bg = "bg-orange-500";
      text = "Quá hạn";
      break;

    default:
      bg = "bg-blue-400";
      text = "Đang chuẩn bị";
      break;
  }

  return { bg, text };
};

const checkPriority = (priority) => {
  let icon;

  switch (priority) {
    case "LOW":
      icon = (
        <div className="bg-white p-0.5 rounded-full">
          <IoArrowForwardCircle className="text-xl text-green-500 rotate-90" />
        </div>
      );
      break;
    case "MEDIUM":
      icon = (
        <div className="bg-white p-0.5 rounded-full">
          <IoEllipsisHorizontalCircleSharp className="text-xl text-orange-400" />
        </div>
      );
      break;
    case "HIGH":
      icon = (
        <div className="bg-white p-1 rounded-full">
          <FaExclamationCircle className="text-base text-red-500" />
        </div>
      );
      break;

    default:
      icon = (
        <div className="bg-white p-0.5 rounded-full">
          <IoArrowForwardCircle className="text-xl text-green-500 rotate-90" />
        </div>
      );
      break;
  }

  return icon;
};

const StaffSchedulePage = () => {
  const staff = useRouteLoaderData("staff");

  const [selectedDate, setSelectedDate] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkedDateData, setCheckedDateData] = useState([]);
  console.log("checkedDateData > ", checkedDateData);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
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
    data: tasks,
    isLoading: tasksIsLoading,
    isError: tasksIsError,
  } = useQuery(
    ["task-by-date", staff?.id, selectedDate?.[0], selectedDate?.[1]],
    () =>
      getTaskFilterByDate({
        userId: staff?.id,
        date: selectedDate?.[0],
        dateEnd: selectedDate?.[1],
      }),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
      enabled: !!selectedDate,
    }
  );
  console.log("tasks > ", tasks);

  if (tasksIsError) {
    messageApi.open({
      type: "error",
      content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
    });
  }

  return (
    <Fragment>
      {contextHolder}

      <ScheduleDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        checkedDateData={checkedDateData}
      />

      <div className="m-8 p-7 bg-white rounded-md">
        <p className="text-4xl font-medium">Lịch trình</p>

        <div className="mt-5 flex flex-wrap">
          <StatusRender bg="bg-gray-400" text="Đang chuẩn bị" />
          <StatusRender bg="bg-blue-400" text="Đang thực hiện" />
          <StatusRender bg="bg-green-500" text="Hoàn thành" />
          <StatusRender bg="bg-purple-500" text="Đã xác thực" />
          <StatusRender bg="bg-red-500" text="Hủy bỏ" />
          <StatusRender bg="bg-orange-500" text="Quá hạn" />
        </div>

        <ConfigProvider locale={vi_VN}>
          <Spin spinning={tasksIsLoading}>
            <Calendar
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
              onSelect={(value) => {
                console.log("value > ", value);
                const list = [];
                const currentString = momenttz(value?.$d).format("YYYY-MM-DD");

                // only open drawer if that day has task
                tasks?.map((task) => {
                  if (
                    currentString >= task?.startDate &&
                    currentString <= task?.endDate
                  ) {
                    !isDrawerOpen && setIsDrawerOpen(true);
                    list.push(task);
                  }
                });

                !!list.length && setCheckedDateData(list);
              }}
              
              cellRender={(current, info) => {
                let renderList;
                const currentString = momenttz(current?.$d).format(
                  "YYYY-MM-DD"
                );
                tasks?.map((task) => {
                  if (
                    currentString >= task?.startDate &&
                    currentString <= task?.endDate
                  ) {
                    if (renderList)
                      renderList = [
                        ...renderList,
                        {
                          id: task?.id,
                          title: task?.title,
                          status: task?.status,
                          subTask: task?.subTask?.length ?? 0,
                        },
                      ];
                    else
                      renderList = [
                        {
                          title: task?.title,
                          status: task?.status,
                          subTask: task?.subTask?.length ?? 0,
                        },
                      ];
                  }
                });

                if (renderList) {
                  return (
                    <div className="space-y-1">
                      {renderList?.map((item) => {
                        const { bg } = checkStatus(item?.status);
                        return (
                          <div
                            key={currentString + item?.id}
                            className="flex space-x-2 items-center"
                          >
                            <div className={`w-2 h-2 ${bg} rounded-full`} />
                            <p className="flex-1 truncate">{item?.title}</p>
                            {!!item?.subTask && (
                              <p className="text-xs font-medium bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                                {item?.subTask}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              }}
            />
          </Spin>
        </ConfigProvider>
      </div>
    </Fragment>
  );
};

export default memo(StaffSchedulePage);
