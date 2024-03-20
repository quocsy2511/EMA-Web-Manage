import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getListAssigneeEmployee,
  getTaskFilterByDate,
} from "../../../apis/tasks";
import momenttz from "moment-timezone";
import vi_VN from "antd/locale/vi_VN";
import { useRouteLoaderData } from "react-router-dom";
import { Calendar, ConfigProvider, Drawer, Spin, Tooltip, message } from "antd";

const ScheduleEmloyees = ({
  setChildrenDrawer,
  setSelectedDateSchedule,
  setCheckedDateData,
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
    <ConfigProvider locale={vi_VN}>
      <Spin spinning={isLoadingEmployees}>
        <Calendar
          className="rounded-lg border border-gray-300 overflow-hidden px-2"
          onPanelChange={(value, mode) => {
            // console.log("onPanelChange > ", value, mode);
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
          //   // console.log("value > ", value);
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
            const currentMoment = momenttz(current?.$d).format("YYYY-MM-DD");

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
                    // console.log("🚀 ~ employeeAssignees?.map ~ user:", user);
                    renderList = [...renderList, user];
                  }
                }
              }
            });

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
                        <p className="text-xs font-medium text-center truncate border border-black/30 py-[2px] px-[2px] hover:border-black rounded-lg transition-colors hover:text-blue-500">
                          {user?.profile?.fullName}
                        </p>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              );
            }
          }}
        />
      </Spin>
    </ConfigProvider>
  );
};

export default ScheduleEmloyees;
