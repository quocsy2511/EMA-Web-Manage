import React, { memo, useEffect, useState } from "react";
import HeaderEvent from "../../../components/Header/HeaderEvent";
import KanbanBoard from "../../../components/KanbanBoard/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import { getEventDivisions } from "../../../apis/events";
import AnErrorHasOccured from "../../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";
import moment from "moment";
import { Empty, message } from "antd";
import { HeartTwoTone, SmileTwoTone } from "@ant-design/icons";
import { filterTask } from "../../../apis/tasks";
import BudgetStaff from "../../../components/KanbanBoard/BudgetStaff/BudgetStaff";
import { getProfile } from "../../../apis/users";
import { getBudget } from "../../../apis/budgets";
import { useLocation, useRouteLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const selectEvent = location.state?.event ?? {};
  // console.log("selectEvent > ", selectEvent);
  const listEvent = location.state?.listEvent ?? [];

  // const [isDashBoard, setIsDashBoard] = useState(false);
  const [isBoardTask, setIsBoardTask] = useState(true);
  const [searchText, setSearchText] = useState(null);
  const [sort, setSort] = useState("DESC");
  const [statusSelected, setStatusSelected] = useState("clear");
  // const [selectEvent, setSelectEvent] = useState({});
  const staff = useRouteLoaderData("staff");
  const notification = useSelector((state) => state.notification);
  const [filterMember, setFilterMember] = useState(staff?.id);

  // const {
  //   data: listBudgetConfirming,
  //   isError: isErrorListBudgetConfirming,
  //   isLoading: isLoadingListBudgetConfirming,
  //   refetch: refetchListBudgetConfirming,
  // } = useQuery(
  //   ["listBudgetConfirming"],
  //   () =>
  //     getBudget({
  //       eventID: selectEvent?.id,
  //       pageSize: 50,
  //       currentPage: 1,
  //       mode: 1,
  //       userID: staff.id,
  //     }),
  //   {
  //     select: (data) => {
  //       return data.data;
  //     },

  //     refetchOnWindowFocus: false,
  //     enabled: !!selectEvent?.id,
  //   }
  // );

  // const { data: listBudgetConfirmed, refetch: refetchListBudgetConfirmed } =
  //   useQuery(
  //     ["listBudgetConfirmed"],
  //     () =>
  //       getBudget({
  //         eventID: selectEvent?.id,
  //         pageSize: 50,
  //         currentPage: 1,
  //         mode: 2,
  //         userID: staff.id,
  //       }),
  //     {
  //       select: (data) => {
  //         return data.data;
  //       },

  //       refetchOnWindowFocus: false,
  //       enabled: !!selectEvent?.id,
  //     }
  //   );

  const {
    data: listTaskParents,
    isError: isErrorListTask,
    isLoading: isLoadingListTask,
    refetch,
  } = useQuery(
    ["tasks", staff?.id, selectEvent?.id],
    () =>
      filterTask({
        assignee: staff?.id,
        eventID: selectEvent?.id,
        priority: "",
        sort: sort,
        status: "",
      }),
    {
      select: (data) => {
        // console.log("🚀 ~ EventStaffPage ~ data:", data);
        if (data && Array.isArray(data)) {
          // console.log("🚀 ~ EventStaffPage ~ data:", data);

          const taskParents = data?.filter((task) => task?.parent === null);
          const formatDate = taskParents?.map((item) => ({
            ...item,
            startDate: moment(item?.startDate).format("YYYY/MM/DD"),
            endDate: moment(item?.endDate).format("YYYY/MM/DD"),
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
      enabled: !!selectEvent?.id && !!staff?.id,
    }
  );
  // console.log("🚀 ~ EventStaffPage ~ listTaskParents:", listTaskParents);
  const {
    data: listTaskFilter,
    refetch: refetchListTaskFilter,
    isLoadingTaskFilter,
  } = useQuery(
    ["tasks-filter-member"],
    () =>
      filterTask({
        assignee: filterMember,
        eventID: selectEvent?.id,
        priority: "",
        sort: sort,
        status: "",
      }),
    {
      select: (data) => {
        if (data && Array.isArray(data)) {
          const taskParents = data?.filter((task) => task?.parent !== null);
          const formatDate = taskParents?.map(({ ...item }) => {
            item.startDate = moment(item?.startDate).format("YYYY/MM/DD");
            item.endDate = moment(item?.endDate).format("YYYY/MM/DD");
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
      enabled: !!staff?.id && !!selectEvent?.id,
    }
  );

  // console.log("🚀 ~ EventStaffPage ~ listTaskFilter:", listTaskFilter);
  //handle search task ch va task con
  function filterSubTasks(task, searchText) {
    const subtaskTitles = task?.subTask?.filter((subtask) =>
      subtask?.title?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

    return subtaskTitles;
  }
  // Hàm để so sánh và cập nhật listTaskParents
  function updateListTaskParents(listTaskParents, listTaskFilter, searchText) {
    //check điều kiện nếu có search thì search theo cái list hiện có
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

      // console.log(
      //   "🚀 ~ file: EventStaffPage.js:187 ~ updateListTaskParents ~ filteredTaskParents:",
      //   filteredTaskParents
      // );
      return filteredTaskParents;
    }

    // Lặp qua từng task trong listTaskParents
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

    // check ng dùng chọn filter
    if (listTaskFilter?.length === 0 && staff?.id === filterMember) {
      // Nếu listTaskFilter rỗng, refetch listTaskParents
      refetch();
      return listTaskParents;
    }

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
  // useEffect(() => {
  //   if (listEvent && listEvent?.length > 0 && !!notification === false) {
  //     setSelectEvent(listEvent?.[0]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [listEvent]);

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
    if (selectEvent?.id) {
      // refetchListBudgetConfirming();
      // refetchListBudgetConfirmed();
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectEvent?.id, refetch, sort]);

  return (
    <div className="flex flex-col">
      <HeaderEvent
        statusSelected={statusSelected}
        setStatusSelected={setStatusSelected}
        filterMember={filterMember}
        setSort={setSort}
        sort={sort}
        events={listEvent}
        selectEvent={selectEvent}
        setIsBoardTask={setIsBoardTask}
        isBoardTask={isBoardTask}
        setSearchText={setSearchText}
        searchText={searchText}
        setFilterMember={setFilterMember}
      />

      {isBoardTask ? (
        !isLoadingListTask ? (
          !isErrorListTask ? (
            <KanbanBoard
              selectedStatus={statusSelected}
              selectEvent={selectEvent}
              listTaskParents={searchFilterTask}
            />
          ) : (
            <AnErrorHasOccured />
          )
        ) : (
          <LoadingComponentIndicator />
        )
      ) : (
        <div>
          {/* !isLoadingListBudgetConfirming ? (
                !isErrorListBudgetConfirming ? (
                  
                    <BudgetStaff
                    listBudgetConfirmed={listBudgetConfirmed}
                    listBudgetConfirming={listBudgetConfirming}
                    selectEvent={selectEvent}
                  />
                  
                ) : (
                  <AnErrorHasOccured />
                )
              ) : (
                <LoadingComponentIndicator />
              ) */}
        </div>
      )}
    </div>
  );
};

export default memo(EventStaffPage);
