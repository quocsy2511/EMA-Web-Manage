import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import {
  BsHourglassBottom,
  BsHourglassSplit,
  BsPlus,
  BsExclamationOctagonFill,
} from "react-icons/bs";
import { BiRightArrowAlt } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import { AiOutlineHistory } from "react-icons/ai";
import { CiFileOn } from "react-icons/ci";
import {
  Avatar,
  Card,
  Dropdown,
  FloatButton,
  message,
  Popconfirm,
  Popover,
  Progress,
  Tooltip,
} from "antd";
import TaskItem from "../../components/Task/TaskItem";
import CommentInTask from "../../components/Comment/CommentInTask";
import SubTaskModal from "../../components/Modal/SubTaskModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "../../apis/tasks";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import { getComment } from "../../apis/comments";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useDispatch, useSelector } from "react-redux";
import { redirectionActions } from "../../store/redirection";
import moment from "moment";
import momenttz from "moment-timezone";
import AssignmentHistoryModal from "../../components/Modal/AssignmentHistoryModal";
import { socketOnNotification } from "../../utils/socket";

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const EventSubTaskPage = () => {
  const eventId = useParams().eventId;
  const taskId = useParams().taskId;
  const manager = useRouteLoaderData("manager");

  const navigate = useNavigate();
  const location = useLocation();

  const { eventName, dateRange, subtaskId } = location.state ?? {};

  const dispatch = useDispatch();
  const { redirect } = useSelector((state) => state.redirection);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState();
  const [isOpenHistoryModal, setIsOpenHistoryModal] = useState(false);
  const [openPopConfirm, setOpenPopConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState();

  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    socketOnNotification(handleRefetchComment);
  }, []);

  const handleRefetchComment = (notification) => {
    if (notification?.type === "COMMENT") {
      queryClient.invalidateQueries(["comment", taskId]);
    }

    if (notification?.type === "TASK") {
      queryClient.invalidateQueries(["tasks", eventId, taskId]);
    }
  };

  const resetTaskRedirect = () => {
    if (redirect.task) dispatch(redirectionActions.taskChange(undefined));
  };

  const {
    data: tasks,
    isLoading: taskIsLoading,
    isError: taskIsError,
  } = useQuery(
    ["tasks", eventId, taskId],
    () =>
      getTasks({
        fieldName: "id",
        conValue: taskId,
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        // sort history based on createdAt of task
        if (data?.[0]) {
          if (data?.[0]?.assignTasks && data?.[0]?.assignTasks?.length > 1) {
            data?.[0]?.assignTasks?.sort((a, b) => {
              const formatStartDateA = momenttz(a?.createdAt).format(
                "YYYY-MM-DD"
              );
              const formatStartDateB = momenttz(b?.createdAt).format(
                "YYYY-MM-DD"
              );
              return formatStartDateA.localeCompare(formatStartDateB);
            });
          }

          // sort history based on createdAt of subtask
          if (data?.[0]?.subTask && data?.[0]?.subTask?.length > 1) {
            data?.[0]?.subTask?.map((subtask) => {
              if (subtask?.assignTasks && subtask?.assignTasks?.length > 1)
                subtask.assignTasks = subtask?.assignTasks?.sort((a, b) => {
                  const formatStartDateA = momenttz(a?.createdAt).format(
                    "YYYY-MM-DD"
                  );
                  const formatStartDateB = momenttz(b?.createdAt).format(
                    "YYYY-MM-DD"
                  );
                  return formatStartDateA.localeCompare(formatStartDateB);
                });
              return subtask;
            });
          }
        }

        return data?.[0];
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("big task: ", tasks);

  useEffect(() => {
    console.log("location nef");
    if (subtaskId) {
      if (tasks) {
        setSelectedSubTask(
          tasks?.subTask?.find((subtask) => subtask?.id === subtaskId)
        );
        setIsOpenModal(true);
      }
    }
  }, [location, tasks]);

  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = useQuery(["comment", taskId], () => getComment(taskId), {
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.sort((a, b) => {
        if (a?.createdAt < b?.createdAt) {
          return 1;
        } else {
          return -1;
        }
      });
    },
  });
  console.log("comments > ", comments);

  const {
    mutate: updateEventStatusMutate,
    isLoading: updateEventStatusIsLoading,
  } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: (data, variables) => {
        setOpenPopConfirm(false);
        queryClient.invalidateQueries(["tasks", eventId, taskId]);
        if (variables.status === "PROCESSING") {
          messageApi.open({
            type: "success",
            content: "Cập nhật trạng thái hạng mục thành bắt đầu.",
          });
        }

        if (variables.status === "CONFIRM") {
          messageApi.open({
            type: "success",
            content: "Hạng mục đã hoàn thành.",
          });
          navigate(`/manager/event/${eventId}`);
        }
      },
    }
  );

  const goToCreateSubTask = () => {
    navigate(`/manager/event/${eventId}/task`, {
      state: {
        eventId,
        eventName: eventName,
        dateRange: [tasks?.startDate, tasks?.endDate],

        isSubTask: true,
        taskId: tasks?.id,
        taskName: tasks?.title,
        taskResponsorId: tasks?.assignTasks?.[0]?.user?.id,
        item: {
          itemId: tasks?.item?.id,
          itemPercentage: tasks?.item?.percentage,
        },
      },
    });
  };

  const goToUpdateTask = () => {
    const updateData = {
      id: tasks?.id,
      title: tasks?.title,
      date: [
        momenttz(tasks?.startDate).format("YYYY-MM-DD"),
        momenttz(tasks?.endDate).format("YYYY-MM-DD"),
      ],
      priority: tasks?.priority,
      desc: tasks?.description,
      assignee: tasks?.assignTasks?.map((user) => user?.user?.id),
    };

    navigate(`/manager/event/${eventId}/task`, {
      state: {
        eventId,
        eventName: tasks?.eventDivision?.event?.eventName,
        dateRange,
        isSubTask: false,
        updateData,
      },
    });
  };

  const goToUpdateSubtask = (task) => {
    const sortLeader = task?.assignTasks
      ?.sort((a, b) => {
        if (a?.isLeader === b?.isLeader) {
          return 0;
        } else {
          if (a?.isLeader) return -1;
          else return 1;
        }
      })
      .filter((item) => item?.status === "active");

    const updateData = {
      id: task?.id,
      title: task?.title,
      date: [
        momenttz(task?.startDate).format("YYYY-MM-DD"),
        momenttz(task?.endDate).format("YYYY-MM-DD"),
      ],
      priority: task?.priority,
      desc: task?.description,
      assignee: sortLeader?.map((user) => user?.user?.id),
    };

    navigate(`/manager/event/${eventId}/task`, {
      state: {
        eventId,
        eventName: tasks?.eventDivision?.event?.eventName,
        dateRange: [
          momenttz(tasks?.startDate).format("YYYY-MM-DD"),
          momenttz(tasks?.endDate).format("YYYY-MM-DD"),
        ],
        isSubTask: true,
        taskId: tasks?.id,
        taskName: tasks?.title,
        taskResponsorId: tasks?.assignTasks?.[0]?.user?.id,

        updateData,
      },
    });
  };

  const handleCheckUpdateStatus = (status) => {
    setSelectedStatus(status);
    if (!tasks?.subTask?.length) {
      messageApi.open({
        type: "warning",
        content: "Chưa có công việc.",
      });
    } else if (
      status === "CONFIRM" &&
      !tasks?.subTask?.every((task) => task?.status === "CONFIRM")
    ) {
      messageApi.open({
        type: "warning",
        content: "Chưa xác thực toàn bộ công việc.",
      });
    } else {
      setOpenPopConfirm(true);
    }
  };

  const handleUpdateStatus = () => {
    updateEventStatusMutate({ taskID: tasks?.id, status: selectedStatus });
  };

  if (taskIsLoading) {
    return (
      <div className="h-[calc(100vh-128px)]">
        <LoadingComponentIndicator />;
      </div>
    );
  }

  if (taskIsError) {
    return (
      <div className="h-[calc(100vh-128px)]">
        <AnErrorHasOccured />;
      </div>
    );
  }

  let priorityIcon;
  switch (tasks?.priority) {
    case "LOW":
      priorityIcon = <FcLowPriority size={30} />;
      break;
    case "MEDIUM":
      priorityIcon = <FcMediumPriority size={30} />;
      break;
    case "HIGH":
      priorityIcon = <FcHighPriority size={30} />;
      break;

    default:
      break;
  }

  let status, statusColor, statusBorder;
  switch (tasks?.status) {
    case "PENDING":
      status = "Đang chuẩn bị";
      statusColor = "text-gray-400";
      statusBorder = "border-gray-400";
      break;

    case "PROCESSING":
      status = "Đang thực hiện";
      statusColor = "text-blue-400";
      statusBorder = "border-blue-400";
      break;

    case "DONE":
      status = "Hoàn thành";
      statusColor = "text-green-400";
      statusBorder = "border-green-400";
      break;

    case "CONFIRM":
      status = "Đã xác thực";
      statusColor = "text-purple-400";
      statusBorder = "border-purple-400";
      break;

    case "CANCEL":
      status = "Hủy bỏ";
      statusColor = "text-red-500";
      statusBorder = "border-red-500";
      break;

    case "OVERDUE":
      status = "Quá hạn";
      statusColor = "text-orange-500";
      statusBorder = "border-orange-500";
      break;

    default:
      break;
  }

  return (
    <Fragment>
      {contextHolder}
      {tasks?.status !== "CONFIRM" && (
        <FloatButton
          onClick={goToCreateSubTask}
          icon={<BsPlus />}
          type="primary"
          tooltip={<p>Tạo công việc</p>}
        />
      )}

      <SubTaskModal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        selectedSubTask={selectedSubTask}
        resetTaskRedirect={resetTaskRedirect}
      />

      <AssignmentHistoryModal
        isModalOpen={isOpenHistoryModal}
        setIsModalOpen={setIsOpenHistoryModal}
        assignTasks={tasks?.assignTasks}
      />

      <motion.div
        initial={{ y: -75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to="../.." relative="path">
            Sự kiện
          </Link>{" "}
          /{" "}
          <Link to=".." relative="path">
            {eventName ?? "Tên sự kiện"}
          </Link>{" "}
          / {tasks?.title}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="min-h-[calc(100vh-200px)] bg-white mt-8 px-10 py-8 rounded-2xl"
      >
        {/* Title */}
        <div className="flex items-center space-x-8">
          {priorityIcon}

          <div className="space-y-1">
            <p className="text-2xl font-semibold">{tasks?.title}</p>
            <div className="flex items-center space-x-4">
              <p className="text-sm">
                Chịu trách nhiệm bởi{" "}
                <span className="font-semibold">
                  {/* {tasks?.assignTasks?.[0]?.user?.profile?.fullName} */}
                  {
                    tasks?.assignTasks?.find(
                      (user) => user?.isLeader && user?.status === "active"
                    )?.user?.profile?.fullName
                  }
                </span>
              </p>
              <Tooltip title="Xem lịch sử giao việc">
                <AiOutlineHistory
                  onClick={() => setIsOpenHistoryModal(true)}
                  className="text-lg cursor-pointer hover:text-blue-500 hover:scale-110 transition-colors"
                />
              </Tooltip>
            </div>
          </div>

          <div className="flex-1 flex justify-end space-x-8">
            <motion.div
              // whileHover={{ y: -2 }}
              className={`flex items-center px-3 ${statusColor} border-2 ${statusBorder} rounded-full truncate cursor-pointer`}
            >
              <Dropdown
                placement="bottom"
                arrow
                trigger={["click"]}
                menu={{
                  items: [
                    {
                      key: "1",
                      type: "group",
                      label: "Cập Nhật Trạng Thái",
                      children: [
                        {
                          key: "PENDING",
                          label: (
                            <p
                              className="text-gray-400"
                              onClick={() => handleCheckUpdateStatus("PENDING")}
                            >
                              Đang chuẩn bị
                            </p>
                          ),
                          disabled: tasks?.status === "PENDING",
                        },
                        {
                          key: "PROCESSING",
                          label: (
                            <p
                              className="text-blue-400"
                              onClick={() =>
                                handleCheckUpdateStatus("PROCESSING")
                              }
                            >
                              Đang thực hiện
                            </p>
                          ),
                          disabled: tasks?.status === "PROCESSING",
                        },
                        {
                          key: "DONE",
                          label: (
                            <p
                              className="text-green-500"
                              onClick={() => handleCheckUpdateStatus("DONE")}
                            >
                              Hoàn thành
                            </p>
                          ),
                          disabled: tasks?.status === "DONE",
                        },
                        {
                          key: "CONFIRM",
                          label: (
                            <p
                              className="text-purple-500"
                              onClick={() => handleCheckUpdateStatus("CONFIRM")}
                            >
                              Đã xác thực
                            </p>
                          ),
                          disabled: tasks?.status === "CONFIRM",
                        },
                        {
                          key: "CANCEL",
                          label: (
                            <p
                              className="text-red-500"
                              onClick={() => handleCheckUpdateStatus("CANCEL")}
                            >
                              Hủy bỏ
                            </p>
                          ),
                          disabled: tasks?.status === "CANCEL",
                        },
                        {
                          key: "OVERDUE",
                          label: (
                            <p
                              className="text-orange-500"
                              onClick={() => handleCheckUpdateStatus("OVERDUE")}
                            >
                              Quá hạn
                            </p>
                          ),
                          disabled: tasks?.status === "OVERDUE",
                        },
                      ],
                    },
                  ],
                }}
              >
                <Popconfirm
                  title={<p>Bạn đang cập nhật trạng thái của 1 hạng mục ?</p>}
                  open={openPopConfirm}
                  onConfirm={handleUpdateStatus}
                  onCancel={() => setOpenPopConfirm(false)}
                  okText="Xác nhận"
                  cancelText="Hủy bỏ"
                  icon={
                    <BsExclamationOctagonFill className="text-xl text-orange-400 mr-3" />
                  }
                >
                  <Tooltip title="Cập nhật sự kiện" placement="topLeft">
                    <p className="text-base font-medium">{status}</p>
                  </Tooltip>
                </Popconfirm>
              </Dropdown>
              {/* <p className="text-base font-medium">{status}</p> */}
            </motion.div>

            {moment(tasks?.startDate).isSame(moment(tasks?.endDate), "day") ? (
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded-xl"
              >
                <p className="text-base font-medium">
                  {tasks?.startDate
                    ? new Date(tasks?.startDate).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-- : --"}
                </p>
              </motion.div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* <p className="">Thời gian bắt đầu</p> */}

                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-400 rounded-xl space-x-2"
                >
                  <BsHourglassSplit size={15} />
                  <p className="text-base font-medium">
                    {tasks?.startDate
                      ? new Date(tasks?.startDate).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-- : --"}
                  </p>
                </motion.div>

                <BiRightArrowAlt size={25} className="" />

                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-400 rounded-xl space-x-2"
                >
                  <BsHourglassBottom size={15} />
                  <p className="text-base font-medium">
                    {tasks?.endDate
                      ? new Date(tasks?.endDate).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-- : --"}
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          <motion.div whileHover={{ y: -5 }}>
            <Avatar
              size={40}
              src={tasks?.assignTasks?.[0]?.user?.profile?.avatar}
            />
          </motion.div>

          <Popover
            content={<p className="text-sm font-medium">Chỉnh sửa hạng mục</p>}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
              onClick={goToUpdateTask}
            >
              <LuSettings className="text-3xl hover:text-black text-slate-300 transition-colors duration-300" />
            </motion.div>
          </Popover>
        </div>

        {/* Desc */}
        <div className="mt-12 mb-20 flex gap-x-10">
          <Progress
            type="dashboard"
            percent={
              tasks?.subTask?.length !== 0
                ? (
                    (tasks?.subTask?.filter(
                      (subtask) => subtask.status === "CONFIRM"
                    ).length /
                      tasks?.subTask?.filter(
                        (subtask) => subtask?.status !== "CANCEL"
                      ).length ?? 1) * 100
                  ).toFixed(1)
                : 0
            }
            gapDegree={30}
          />
          <Card title="Mô tả" className="flex-1">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: new QuillDeltaToHtmlConverter(
                  JSON.parse(
                    tasks?.description?.startsWith(`[{"`)
                      ? tasks?.description
                      : parseJson(tasks?.description)
                  )
                ).convert(),
              }}
            />
          </Card>
          <Card title="Tệp đính kèm" className="w-[20%]">
            {tasks?.taskFiles?.length > 0 ? (
              <div className="flex flex-col max-h-20 overflow-y-scroll scrollbar-hide space-y-1">
                {tasks?.taskFiles?.map((file, index) => (
                  <Tooltip
                    title={
                      <p className="text-center">Tên tệp : {file?.fileName}</p>
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <CiFileOn className="text-blue-500 text-2xl" />
                      <a
                        key={index}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 truncate"
                      >
                        {file?.fileName}
                      </a>
                    </div>
                  </Tooltip>
                ))}
              </div>
            ) : (
              <p className="text-base">Không có</p>
            )}
          </Card>
        </div>

        {/* Subtask */}
        <div
          className={`flex flex-col gap-y-6 ${
            tasks?.subTask?.length !== 0 && "mt-10 mx-10"
          }`}
        >
          <AnimatePresence>
            {tasks?.subTask?.length !== 0 ? (
              tasks?.subTask?.map((subtask) => {
                // if (subtask?.assignTasks?.length !== 0)
                return (
                  <TaskItem
                    key={subtask?.id}
                    task={subtask}
                    isSubtask={true}
                    setSelectedSubTask={setSelectedSubTask}
                    setIsOpenModal={setIsOpenModal}
                    // Go to update subtask
                    goToUpdateSubtask={() => goToUpdateSubtask(subtask)}
                  />
                );
              })
            ) : (
              <p className="text-lg text-center font-medium">
                Chưa có công việc
              </p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!commentsIsLoading || !commentsIsError ? (
            comments ? (
              <div key="comments" className="mt-14">
                <CommentInTask comments={comments} taskId={taskId} />
              </div>
            ) : (
              <p key="no-comment" className="text-center mt-10">
                Không thể tải bình luận
              </p>
            )
          ) : (
            <LoadingComponentIndicator />
          )}
        </AnimatePresence>
      </motion.div>
      <FloatButton.BackTop className="right-24" />
    </Fragment>
  );
};

export default memo(EventSubTaskPage);
