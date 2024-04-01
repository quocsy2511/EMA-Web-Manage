import {
  BulbOutlined,
  CheckSquareOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Tag, Tooltip } from "antd";
import React, { memo, useEffect } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getComment } from "../../../apis/comments";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import { getTasks } from "../../../apis/tasks";
import { AnimatePresence, motion } from "framer-motion";
import { MoonLoader } from "react-spinners";
import { socketOnNotification } from "../../../utils/socket";

const TaskKanbanBoard = ({
  setIsOpenTaskModal,
  setTaskParent,
  task,
  setTaskSelected,
}) => {
  const { id, status } = task ?? {};
  const {
    data: subtaskDetails,
    isError: isErrorSubtaskDetails,
    isLoading: isLoadingSubtaskDetails,
  } = useQuery(
    ["subtaskDetails", id],
    () =>
      getTasks({
        fieldName: "id",
        conValue: id,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        if (data?.startDate && data?.endDate) {
          const formatDate = data.map(({ ...item }) => {
            item.startDate = moment(item?.startDate).format("YYYY-MM-DD");
            item.endDate = moment(item?.endDate).format("YYYY-MM-DD");
            return {
              ...item,
            };
          });
          return formatDate;
        }
        return data;
      },

      refetchOnWindowFocus: false,
      enabled: !!task?.id,
    }
  );

  const openTaskModalHandler = () => {
    setIsOpenTaskModal(true);
    setTaskParent(false);
    setTaskSelected(subtaskDetails?.[0]);
    // setTaskSelected(task);
  };

  const {
    data: listComments,
    isError: isErrorListComments,
    isLoading: isLoadingListComments,
    refetch: refetchListComment,
  } = useQuery(["comments", id], () => getComment(id), {
    select: (data) => {
      const formatDate = data.map(({ ...item }) => {
        item.createdAt = moment(item?.createdAt).format("DD-MM");
        return {
          ...item,
        };
      });
      return formatDate;
    },

    refetchOnWindowFocus: false,
    enabled: !!task,
  });

  let totalTaskFiles = subtaskDetails?.[0]?.taskFiles?.length;
  let totalFiles = totalTaskFiles;
  listComments?.forEach((item) => {
    let totalCommentFiles = item?.commentFiles?.length;
    totalFiles += totalCommentFiles;
  });

  const formattedDate = (value) => {
    const date = moment(value).format("DD-MM-YYYY");
    return date;
  };
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "ĐANG CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      CONFIRM: { color: "purple", title: "ĐÃ XÁC THỰC" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "VỪA" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  useEffect(() => {
    socketOnNotification(handleRefetchContact);
  }, []);

  const handleRefetchContact = (noti) => {
    if (noti?.type === "COMMENT" && noti?.type === "TASK") refetchListComment();
  };

  return (
    <motion.div
      key={`subtask-${task?.id}`}
      initial={{ x: 20, y: 20, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="overflow-hidden w-[250px] min-h-[138px] mx-auto my-5 rounded-lg bg-white  shadow-darkShadow py-3 px-3 shadow-lg hover:opacity-60  cursor-pointer"
        onClick={() => openTaskModalHandler()}
      >
        <Tooltip title={task?.title}>
          <p
            className={
              task.status === "CONFIRM" || task.status === "OVERDUE"
                ? "font-normal text-sm tracking-wide hover:text-secondary truncate line-through decoration-red-700 decoration-2 opacity-30"
                : "font-normal text-sm tracking-wide hover:text-secondary truncate"
            }
          >
            {task?.title}
          </p>
        </Tooltip>

        {/* Sumary */}
        <div className="flex justify-start items-center gap-x-2 cursor-pointer mt-1 flex-wrap">
          {task?.endDate !== null && (
            <span
              className={`px-[6px] py-[2px] w-fit text-xs font-medium flex justify-start items-center gap-x-1 ${
                task?.status === "CANCEL" || task?.status === "OVERDUE"
                  ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                  : task?.status === "DONE"
                  ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                  : task?.status === "CONFIRM"
                  ? "bg-purple-300 bg-opacity-20 text-purple-600 rounded-md"
                  : ""
              }`}
            >
              {task?.status === "CONFIRM" ? (
                <CheckSquareOutlined className="text-purple-600" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {formattedDate(task?.endDate)}
            </span>
          )}

          <AnimatePresence>
            {!isLoadingListComments ? (
              !isErrorListComments ? (
                <motion.div
                  key={`subtask-${task?.id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="flex gap-x-3"
                >
                  <span className="flex justify-center items-center gap-x-1 text-xs font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    {listComments?.length}
                  </span>
                  <span className="flex justify-center items-center gap-x-1 text-xs font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                      />
                    </svg>
                    {totalFiles}
                  </span>
                </motion.div>
              ) : (
                <AnErrorHasOccured />
              )
            ) : (
              <motion.div
                key={`loading-subtask-${task?.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* <LoadingComponentIndicator /> */}
                <MoonLoader color="#36d7b7" size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex justify-start items-center gap-x-2 cursor-pointer mt-1 flex-wrap">
          <Tag
            color={getColorStatusPriority(status)?.color}
            className="h-fit w-fit mt-1 gap-x-1 flex flex-row"
          >
            <BulbOutlined />
            {getColorStatusPriority(status)?.title}
          </Tag>
        </div>
        <div className="flex justify-end items-center mt-4  w-full overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={`cmt-subtask-${task?.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <Avatar.Group
                maxCount={3}
                maxStyle={{
                  color: "#D25B68",
                  backgroundColor: "#F4D7DA",
                }}
                size="small"
              >
                {!isLoadingSubtaskDetails ? (
                  !isErrorSubtaskDetails ? (
                    <>
                      {subtaskDetails?.[0].assignTasks?.length > 0 &&
                        subtaskDetails?.[0].assignTasks
                          ?.filter((user) => user.status === "active")
                          ?.map((item, index) => (
                            <Tooltip
                              key={item.id}
                              title={
                                item.isLeader
                                  ? `${item.user?.profile?.fullName} (Trưởng nhóm)`
                                  : item.user?.profile?.fullName
                              }
                              placement="top"
                            >
                              {item?.user?.profile === null ? (
                                <Avatar
                                  icon={<UserOutlined />}
                                  size="small"
                                  className="bg-gray-500"
                                />
                              ) : (
                                <>
                                  {item.isLeader ? (
                                    <Badge
                                      count={
                                        <StarFilled className="text-yellow-400 text-[11px]" />
                                      }
                                      offset={[-21, 5]}
                                      className="mr-1"
                                    >
                                      <Avatar
                                        // shape="square"
                                        src={item.user?.profile?.avatar}
                                        size="small"
                                        className="border border-yellow-300"
                                      />
                                    </Badge>
                                  ) : (
                                    <Avatar
                                      src={item.user?.profile?.avatar}
                                      size="small"
                                    />
                                  )}
                                </>
                              )}
                            </Tooltip>
                          ))}
                    </>
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <motion.div
                    key={`loading-cmt-subtask-${task.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* <LoadingComponentIndicator /> */}
                    <MoonLoader color="#36d7b7" size={20} />
                  </motion.div>
                )}
              </Avatar.Group>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TaskKanbanBoard);
