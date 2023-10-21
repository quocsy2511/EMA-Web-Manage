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
import { filterTask, getTasks } from "../../apis/tasks";
import BudgetStaff from "../../components/KanbanBoard/BudgetStaff/BudgetStaff";
import { getProfile } from "../../apis/users";
const EventStaffPage = () => {
  const [isBoardTask, setIsBoardTask] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const {
    data: listEvent,
    isError,
    isLoading,
  } = useQuery(["events"], () => getEventDivisions(), {
    select: (data) => {
      const filteredEvents = data.filter((item) => item.status !== "DONE");

      const event = filteredEvents.map(({ ...item }) => {
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

  const { data: staff } = useQuery(["staff"], () => getProfile(), {
    select: (data) => {
      return data;
    },
  });

  const listStatus = [
    "PENDING",
    "PROCESSING",
    "DONE",
    "CONFIRM",
    "CANCEL",
    "OVERDUE",
  ];
  const {
    data: listTaskParents,
    isError: isErrorListTask,
    isLoading: isLoadingListTask,
    refetch,
  } = useQuery(
    ["tasks"],
    () =>
      filterTask({
        assignee: staff.id,
        eventID: selectEvent.id,
        priority: priority,
        sort: sort,
        status: status,
      }),
    {
      select: (data) => {
        if (data && Array.isArray(data)) {
          const taskParents = data.filter((task) => task.parent === null);
          const formatDate = taskParents.map(({ ...item }) => {
            item.startDate = moment(item.startDate).format("YYYY/MM/DD");
            item.endDate = moment(item.endDate).format("YYYY/MM/DD");
            if (item.subTask && Array.isArray(item.subTask)) {
              item.subTask.sort((a, b) => {
                return (
                  listStatus.indexOf(a.status) - listStatus.indexOf(b.status)
                );
              });
            }
            return {
              ...item,
            };
          });
          return formatDate;
        }
        return data;
      },
      // staleTime: 5000,
      enabled: !!selectEvent.id && !!staff.id,
      // refetchOnWindowFocus: true,
      // cacheTime: 0,
    }
  );

  function filterSubTasks(task, searchText) {
    const subtaskTitles = task?.subTask?.filter((subtask) =>
      subtask?.title?.toLowerCase().includes(searchText?.toLowerCase())
    );

    return subtaskTitles;
  }
  const filteredTaskParents = listTaskParents
    ?.map((task) => {
      const parentTitle = task?.title?.toLowerCase();
      const subTaskResults = filterSubTasks(task, searchText);

      if (
        parentTitle.includes(searchText?.toLowerCase()) ||
        subTaskResults.length > 0
      ) {
        // Nếu parent hoặc subTask thỏa mãn điều kiện, trả về task với danh sách subTask được cắt
        return { ...task, subTask: subTaskResults };
      } else {
        // Nếu không có subTask nào thỏa mãn điều kiện, trả về null
        return null;
      }
    })
    .filter((task) => task !== null);

  useEffect(() => {
    if (listEvent && listEvent.length > 0) {
      setSelectEvent(listEvent[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEvent]);

  useEffect(() => {
    if (selectEvent.id) {
      refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectEvent, refetch]);

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
                setSearchText={setSearchText}
                searchText={searchText}
              />
              {isBoardTask ? (
                <KanbanBoard
                  selectEvent={selectEvent}
                  listTaskParents={filteredTaskParents}
                  // listTaskParents={listTaskParents}
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
