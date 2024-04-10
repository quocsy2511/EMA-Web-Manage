import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getListAssigneeEmployee,
  getTaskFilterByDate,
} from "../../../apis/tasks";
import momenttz from "moment-timezone";
import vi_VN from "antd/locale/vi_VN";
import { useRouteLoaderData } from "react-router-dom";
import {
  Avatar,
  Calendar,
  ConfigProvider,
  Select,
  Spin,
  Tooltip,
  message,
} from "antd";
import { BsDot } from "react-icons/bs";

const ScheduleEmloyees = ({
  setChildrenDrawer,
  setSelectedDateSchedule,
  setCheckedDateData,
  employees,
}) => {
  const [selectedDate, setSelectedDate] = useState([]);
  const now = momenttz();
  const staff = useRouteLoaderData("staff");
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const {
    data: employeeAssignees,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
  } = useQuery(
    ["task-by-assignee", staff?.id, selectedDate?.[0], selectedDate?.[1]],
    () =>
      getListAssigneeEmployee({
        fieldName: "id",
        userId: staff?.id,
        dateStart: selectedDate?.[0],
        dateEnd: selectedDate?.[1],
      }),
    {
      select: (data) => {
        const filterEmployee = data?.users?.filter(
          (item) => item.role.roleName === "Nhân Viên"
        );

        const filteredEmployees = filterEmployee.map((employee) => ({
          ...employee,
          listEvent: employee.listEvent?.map((event) => ({
            ...event,
            listTask: event.listTask?.filter(
              (task) =>
                task.status === "PENDING" || task.status === "PROCESSING"
            ),
          })),
        }));

        return filteredEmployees;
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleSelectEmployee = (value) => {
    if (value) {
      setChildrenDrawer(true);
      setCheckedDateData(value);
    }
  };

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

  if (isErrorEmployees) {
    messageApi.open({
      type: "error",
      content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
    });
  }

  return (
    <>
      {contextHolder}
      <ConfigProvider locale={vi_VN}>
        <Spin spinning={isLoadingEmployees}>
          <div className="relative">
            <div className="absolute flex items-center top-4 left-5 space-x-3 w-full">
              <p className="text-lg font-medium">Xem lịch trình</p>
              <Select
                className="w-1/6"
                onChange={(value) =>
                  (value || value === "") && setSelectedEmployee(value)
                }
                allowClear={selectedEmployee !== ""}
                onClear={() => {
                  setSelectedEmployee("");
                }}
                value={selectedEmployee}
                options={[
                  {
                    label: <p className="font-medium h-0">Tổng quát</p>,
                    value: "",
                  },
                  ...(employees?.map((item) => {
                    return {
                      label: (
                        <span
                          key={item?.id}
                          label={item?.profile?.fullName}
                          className="font-medium"
                        >
                          <Avatar
                            src={item?.profile?.avatar}
                            className="mr-2"
                            size="small"
                          />
                          {item?.profile?.fullName}
                        </span>
                      ),
                      value: item?.id,
                    };
                  }) ?? []),
                ]}
              />
            </div>
            <Calendar
              className="rounded-lg border border-gray-300 overflow-hidden px-2"
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
              // onSelect={(value) => {
              //   let list = [];
              //   const currentMoment = momenttz(value?.$d).format("YYYY-MM-DD");
              //   setSelectedDateSchedule(currentMoment);
              //   employeeAssignees?.map((user) => {
              //     if (!!user?.listEvent?.length) {
              //       user?.listEvent?.map((event) => {
              //         if (
              //           event?.listTask?.find(
              //             (task) =>
              //               currentMoment >= task?.startDate &&
              //               currentMoment <= task?.endDate
              //           )
              //         ) {
              //           if (!list?.find((item) => item?.id === user?.id)) {
              //             setChildrenDrawer(true);
              //             list = [...list, user];
              //           }
              //         }
              //       });
              //     }
              //   });

              //   !!list.length && setCheckedDateData(list);
              // }}
              onSelect={(value) => {
                const currentMoment = momenttz(value?.$d).format("YYYY-MM-DD");
                setSelectedDateSchedule(currentMoment);
              }}
              cellRender={(current) => {
                let renderList = [];
                const currentMoment = momenttz(current?.$d).format(
                  "YYYY-MM-DD"
                );

                employeeAssignees?.map((user) => {
                  if (!!user?.listEvent?.length) {
                    if (!renderList?.find((item) => item?.id === user?.id)) {
                      if (
                        user?.listEvent?.[0]?.listTask?.find(
                          (task) =>
                            currentMoment >= task?.startDate &&
                            currentMoment <= task?.endDate
                        )
                      ) {
                        renderList = [...renderList, user];
                      }
                    }
                  }
                });

                if (selectedEmployee !== "") {
                  renderList = renderList?.filter(
                    (item) => item?.id === selectedEmployee
                  );
                }

                if (!!renderList?.length) {
                  return (
                    <div className="gap-y-5 mb-3 mt-2 space-y-2">
                      {renderList?.map((user, index) => (
                        <div
                          key={currentMoment + user?.id}
                          className=""
                          onClick={() => handleSelectEmployee(user)}
                        >
                          <Tooltip title={user?.profile?.fullName}>
                            <div className="flex items-center font-medium text-center truncate hover:border-black rounded-lg transition-colors hover:text-blue-500">
                              <BsDot className="text-2xl" />
                              <p className="text-sm">
                                {user?.profile?.fullName}
                              </p>
                            </div>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  );
                }
              }}
            />
          </div>
        </Spin>
      </ConfigProvider>
    </>
  );
};

export default ScheduleEmloyees;
