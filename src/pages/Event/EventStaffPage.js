import React, { useEffect, useState } from "react";
import HeaderEvent from "../../components/Header/HeaderEvent";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import { getEventDivisions } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import moment from "moment";
import { Empty } from "antd";
import { HeartTwoTone, SmileTwoTone } from "@ant-design/icons";
import { getTasks } from "../../apis/tasks";
import BudgetStaff from "../../components/KanbanBoard/BudgetStaff/BudgetStaff";
const EventStaffPage = () => {
  const [isBoardTask, setIsBoardTask] = useState(true);

  const {
    data: listEvent,
    isError,
    isLoading,
  } = useQuery(["events"], () => getEventDivisions(), {
    select: (data) => {
      const event = data.map(({ ...item }) => {
        item.startDate = moment(item.startDate).format("YYYY/MM/DD");
        item.endDate = moment(item.endDate).format("YYYY/MM/DD");
        return {
          ...item,
        };
      });
      return event;
    },
  });
  const [selectEvent, setSelectEvent] = useState({});

  const {
    data: listTaskParents,
    isError: isErrorListTask,
    isLoading: isLoadingListTask,
    refetch,
  } = useQuery(
    ["tasks"],
    () =>
      getTasks({
        fieldName: "eventID",
        conValue: selectEvent.id,
        pageSize: 100,
        currentPage: 1,
      }),
    {
      select: (data) => {
        if (data && Array.isArray(data)) {
          const taskParents = data.filter((task) => task.parent === null);
          const formatDate = taskParents.map(({ ...item }) => {
            item.startDate = moment(item.startDate).format("YYYY/MM/DD");
            item.endDate = moment(item.endDate).format("YYYY/MM/DD");
            return {
              ...item,
            };
          });
          return formatDate;
        }
        return data;
      },

      enabled: !!selectEvent.id,
    }
  );

  useEffect(() => {
    setSelectEvent(listEvent?.[0] ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEvent]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectEvent]);

  return (
    <div className="flex flex-col ">
      {!isLoading ? (
        !isError ? (
          listEvent.length > 0 ? (
            <>
              <HeaderEvent
                events={listEvent}
                setSelectEvent={setSelectEvent}
                selectEvent={selectEvent}
                setIsBoardTask={setIsBoardTask}
                isBoardTask={isBoardTask}
              />
              {isBoardTask ? (
                <KanbanBoard
                  selectEvent={selectEvent}
                  listTaskParents={listTaskParents}
                  isErrorListTask={isErrorListTask}
                  isLoadingListTask={isLoadingListTask}
                />
              ) : (
                <BudgetStaff selectEvent={selectEvent} />
              )}
            </>
          ) : (
            <div className="mt-56">
              <Empty description={false} />
              <div>
                <h1 className="text-center mt-6 font-extrabold text-xl ">
                  Hiện tại bạn đang không tham gia vào sự kiện nào{"  "}
                  <SmileTwoTone twoToneColor="#52c41a" />
                </h1>
                <h3 className="text-center text-sm text-gray-400 mt-4">
                  Vui lòng liên hệ quản lí để tham gia vào sự kiện . Cảm ơn{" "}
                  <HeartTwoTone twoToneColor="#eb2f96" />
                </h3>
              </div>
            </div>
          )
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </div>
  );
};

export default EventStaffPage;
