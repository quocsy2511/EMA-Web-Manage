import React, { memo, useEffect, useState } from "react";
import HeaderEvent from "../../../components/Header/HeaderEvent";
import KanbanBoard from "../../../components/KanbanBoard/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import { getEventDetail } from "../../../apis/events";
import AnErrorHasOccured from "../../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";
import moment from "moment";
import { Spin } from "antd";
import { filterTask } from "../../../apis/tasks";
import { useLocation, useParams, useRouteLoaderData } from "react-router-dom";
import BudgetStaff from "../../../components/KanbanBoard/BudgetStaff/BudgetStaff";
import { socketOnNotification } from "../../../utils/socket";

moment.suppressDeprecationWarnings = true;

const EventStaffPage = () => {
  const listStatus = [
    "PENDING",
    "PROCESSING",
    "DONE",
    "CONFIRM",
    "CANCEL",
    "OVERDUE",
  ];

  const location = useLocation();
  const { isBudget, parentTaskId } = location.state ?? {};

  const [isBoardTask, setIsBoardTask] = useState(true);
  const [searchText, setSearchText] = useState(null);
  const [sort, setSort] = useState("DESC");
  const [statusSelected, setStatusSelected] = useState("clear");
  const staff = useRouteLoaderData("staff");
  const [filterMember, setFilterMember] = useState(staff?.id);
  const { eventId } = useParams();
  const [isHideHeaderEvent, setIsHideHeaderEvent] = useState(false);

  const {
    data: selectEvent,
    isLoading: selectEventIsLoading,
    isError: selectEventIsError,
  } = useQuery(["eventDetail", eventId], () => getEventDetail({ eventId }), {
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });

  const {
    data: listTaskParents,
    isError: isErrorListTask,
    isLoading: isLoadingListTask,
    refetch,
  } = useQuery(
    ["tasks", staff?.id, eventId],
    () =>
      filterTask({
        assignee: staff?.id,
        eventID: eventId,
        priority: "",
        sort: sort,
        status: "",
      }),
    {
      select: (data) => {
        if (data && Array.isArray(data)) {
          const taskParents = data?.filter((task) => task?.parent === null);
          const formatDate = taskParents?.map((item) => ({
            ...item,
            startDate: moment(item?.startDate).format("YYYY-MM-DD"),
            endDate: moment(item?.endDate).format("YYYY-MM-DD"),
            subTask: item?.subTask
              .filter((task) => task.status !== "CANCEL")
              .sort((a, b) => {
                const sortByStatus =
                  listStatus.indexOf(a.status) - listStatus.indexOf(b.status);
                if (sortByStatus === 0) {
                  return moment(b.createdAt).diff(moment(a.createdAt));
                }
                return sortByStatus;
              }),
          }));

          return formatDate;
        }
        return data;
      },

      refetchOnWindowFocus: false,
      enabled: !!eventId && !!staff?.id,
    }
  );

  const {
    data: listTaskFilter,
    refetch: refetchListTaskFilter,
    isLoadingTaskFilter,
  } = useQuery(
    ["tasks-filter-member"],
    () =>
      filterTask({
        assignee: filterMember,
        eventID: eventId,
        priority: "",
        sort: sort,
        status: "",
      }),

    {
      select: (data) => {
        if (data && Array.isArray(data)) {
          // console.log("🚀 ~ EventStaffPage ~ data:", data);
          const taskParents = data?.filter((task) => task?.parent !== null);
          // console.log("🚀 ~ EventStaffPage ~ taskParents:", taskParents);
          const formatDate = taskParents?.map(({ ...item }) => {
            item.startDate = moment(item?.startDate).format("YYYY-MM-DD");
            item.endDate = moment(item?.endDate).format("YYYY-MM-DD");
            if (item?.subTask && Array.isArray(item.subTask)) {
              item.subTask.sort((a, b) => {
                return (
                  listStatus?.indexOf(a.status) - listStatus?.indexOf(b.status)
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
      refetchOnWindowFocus: false,
      enabled: !!staff?.id && !!eventId,
    }
  );

  //handle search task ch va task con
  function filterSubTasks(task, searchText) {
    const subtaskTitles = task?.subTask?.filter((subtask) =>
      subtask?.title?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

    return subtaskTitles;
  }
  // Hàm để so sánh và cập nhật listTaskParents
  function updateListTaskParents(listTaskParents, listTaskFilter, searchText) {
    //check điều kiện nếu có search
    if (searchText) {
      const filteredTaskParents = listTaskParents
        ?.map((task) => {
          // const parentTitle = task?.title?.toLowerCase(); //check thằng cha
          const subTaskResults = filterSubTasks(task, searchText); // check thằng con
          if (
            // parentTitle.includes(searchText?.toLowerCase()) ||
            subTaskResults?.length > 0
          ) {
            // Nếu parent hoặc subTask thỏa mãn điều kiện, trả về task với danh sách subTask được cắt
            return { ...task, subTask: subTaskResults };
          } else {
            // Nếu không có subTask nào thỏa mãn điều kiện, trả về null
            return { ...task, subTask: subTaskResults };
          }
        })
        .filter((task) => task !== null);

      console.log(
        "🚀 ~ updateListTaskParents ~ filteredTaskParents:",
        filteredTaskParents
      );
      return filteredTaskParents;
    }

    // check ng dùng chọn filter
    if (listTaskFilter?.length === 0 && staff?.id === filterMember) {
      refetch();
      return listTaskParents;
    }

    const updatedListTaskParents = listTaskParents?.map((task) => {
      // Kiểm tra xem task có subTask và có trong listTaskFilter không
      if (task?.subTask && Array.isArray(task?.subTask)) {
        // Lọc ra các subTask có id giống với các task trong listTaskFilter
        const updatedSubTasks = task?.subTask?.filter((subtask) =>
          listTaskFilter?.some(
            (filteredTask) => filteredTask?.id === subtask?.id
          )
        );

        return {
          ...task,
          subTask: updatedSubTasks,
        };
      } else {
        return task;
      }
    });

    return updatedListTaskParents;
  }

  let searchFilterTask;
  if (!isLoadingTaskFilter && !isLoadingListTask) {
    searchFilterTask = updateListTaskParents(
      listTaskParents,
      listTaskFilter,
      searchText
    );
  }

  useEffect(() => {
    if (eventId) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, sort]);

  useEffect(() => {
    if (staff?.id) {
      setFilterMember(staff?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff?.id]);

  useEffect(() => {
    if (staff?.id) {
      refetchListTaskFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMember]);
  useEffect(() => {
    socketOnNotification(handleRefetchContact);
  }, []);

  const handleRefetchContact = (noti) => {
    noti?.type === "TASK" && refetch();
  };
  useEffect(() => {
    document.title = "Trang quản lí công việc và ngân sách";
  }, []);

  useEffect(() => {
    if (isBudget) {
      setIsBoardTask(false);
    } else {
      setIsBoardTask(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBudget, parentTaskId]);

  return (
    <div className="flex flex-col">
      {!isHideHeaderEvent && (
        <HeaderEvent
          statusSelected={statusSelected}
          setStatusSelected={setStatusSelected}
          filterMember={filterMember}
          setSort={setSort}
          sort={sort}
          selectEvent={selectEvent}
          setIsBoardTask={setIsBoardTask}
          isBoardTask={isBoardTask}
          setSearchText={setSearchText}
          setFilterMember={setFilterMember}
        />
      )}

      <Spin spinning={selectEventIsLoading}>
        {isBoardTask ? (
          !isLoadingListTask ? (
            !isErrorListTask ? (
              <KanbanBoard
                selectedStatus={statusSelected}
                selectEvent={selectEvent}
                listTaskParents={searchFilterTask}
                setIsHideHeaderEvent={setIsHideHeaderEvent}
              />
            ) : (
              <AnErrorHasOccured />
            )
          ) : (
            <LoadingComponentIndicator />
          )
        ) : (
          <div>
            <BudgetStaff
              selectEvent={selectEvent}
              listTaskParents={listTaskParents}
              setIsBoardTask={setIsBoardTask}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default memo(EventStaffPage);
