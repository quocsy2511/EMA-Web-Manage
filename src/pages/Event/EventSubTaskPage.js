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
import { BsHourglassBottom, BsHourglassSplit, BsPlus } from "react-icons/bs";
import { BiRightArrowAlt } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import { Avatar, Card, FloatButton, message, Popover, Progress } from "antd";
import TaskItem from "../../components/Task/TaskItem";
import CommentInTask from "../../components/Comment/CommentInTask";
import SubTaskModal from "../../components/Modal/SubTaskModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "../../apis/tasks";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import { getComment } from "../../apis/comments";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import TaskUpdateModal from "../../components/Modal/TaskUpdateModal";
import { useDispatch, useSelector } from "react-redux";
import { redirectionActions } from "../../store/redirection";
import moment from "moment";
import momenttz from "moment-timezone";

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const EventSubTaskPage = () => {
  const eventId = useParams().eventId;
  const taskId = useParams().taskId;
  const manager = useRouteLoaderData("manager");

  const navigate = useNavigate();
  const location = useLocation();
  console.log("location > ", location.state);

  const dispatch = useDispatch();
  const { redirect } = useSelector((state) => state.redirection);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState();
  const [isOpenUpdateTaskModal, setIsOpenUpdateTaskModal] = useState(false);
  const [isOpenUpdateSubTaskModal, setIsOpenUpdateSubTaskModal] =
    useState(false);

  const [messageApi, contextHolder] = message.useMessage();

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
        return data[0];
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("tasks: ", tasks);

  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = useQuery(["comment", taskId], () => getComment(taskId), {
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const {
    mutate: updateEventStatusMutate,
    isLoading: updateEventStatusIsLoading,
  } = useMutation(
    ({ taskID, status }) => updateTaskStatus({ taskID, status }),
    {
      onSuccess: (data, variables) => {
        if (variables.status === "PROCESSING") {
          queryClient.invalidateQueries(["tasks", eventId, taskId]);
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

  // useEffect(() => {
  //   console.log("inside useEffect: ", tasks?.subTask);
  //   if (redirect.task && redirect.task.parentTaskId) {
  //     const openSubtask = tasks?.subTask.find(
  //       (subtask) => subtask.id === redirect.task.commonId
  //     );
  //     console.log("find to open subtask: ", openSubtask);
  //     if (openSubtask) {
  //       setSelectedSubTask(openSubtask);
  //       setIsOpenModal(true);
  //     }
  //   }
  // }, [redirect.task, tasks]);

  const handleOpenUpdateModal = () => {
    setIsOpenUpdateTaskModal((prev) => !prev);
  };

  const handleUpdateStatusTask = (status) => {
    updateEventStatusMutate({
      taskID: taskId,
      status,
    });
  };

  const goToCreateSubTask = () => {
    navigate(`/manager/event/${eventId}/task`, {
      state: {
        eventId,
        eventName: location.state?.eventName,
        dateRange: [tasks?.startDate, tasks?.endDate],

        isSubTask: true,
        taskId: tasks?.id,
        taskName: tasks?.title,
        taskResponsorId: tasks?.assignTasks?.[0]?.user?.id,
      },
    });
  };

  const goToUpdateTask = () => {
    const updateData = {
      title: tasks?.title,
      date: [
        momenttz(tasks?.startDate).format("YYYY-MM-DD"),
        momenttz(tasks?.endDate).format("YYYY-MM-DD"),
      ],
      priority: tasks?.priority,
      desc: tasks?.description,
      assignee: tasks?.assignTasks?.map((user) => user?.user?.id),
    };
    console.log("hello > ", updateData);

    navigate(`/manager/event/${eventId}/task`, {
      state: {
        eventId,
        eventName: tasks?.eventDivision?.event?.eventName,
        dateRange: location.state?.dateRange,

        isSubTask: false,
        listDivision: location.state?.listDivision,

        updateData,
      },
    });
  };

  const goToUpdateSubtask = (task) => {
    const updateData = {
      title: task?.title,
      date: [
        momenttz(task?.startDate).format("YYYY-MM-DD"),
        momenttz(task?.endDate).format("YYYY-MM-DD"),
      ],
      priority: task?.priority,
      desc: task?.description,
      assignee: task?.assignTasks?.map((user) => user?.user?.id),
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
      <FloatButton
        onClick={goToCreateSubTask}
        icon={<BsPlus />}
        type="primary"
        tooltip={<p>Tạo công việc</p>}
      />

      {/* <TaskUpdateModal
        isModalOpen={isOpenUpdateTaskModal}
        setIsModalOpen={setIsOpenUpdateTaskModal}
        eventID={eventId}
        task={tasks}
        isSubTask={false}
      /> */}

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
            {location.state?.eventName ?? "Tên sự kiện"}
          </Link>{" "}
          / {tasks?.title}
        </p>

        <div className="flex items-end">
          {/* <AnimatePresence>
            {tasks.subTask?.length !== 0 &&
              tasks.subTask?.filter((task) => task.status === "CONFIRM")
                .length === tasks.subTask?.length &&
              tasks.status === "DONE" && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                >
                  <Button
                    isLoading={updateEventStatusIsLoading}
                    // size="large"
                    icon={<BiCheck size={15} />}
                    type="primary"
                    onClick={() => handleUpdateStatusTask("CONFIRM")}
                    className="font-medium"
                  >
                    Xác thực hạng mục
                  </Button>
                </motion.div>
              )}
          </AnimatePresence> */}

          {/* <AnimatePresence>
            {tasks.status === "PENDING" && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
              >
                <Button
                  isLoading={updateEventStatusIsLoading}
                  // size="large"
                  type="primary"
                  icon={<VscDebugStart size={15} />}
                  onClick={() => handleUpdateStatusTask("PROCESSING")}
                >
                  Bắt đầu hạng mục
                </Button>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* <AnimatePresence>
            {tasks.subTask?.length !== 0 &&
              tasks.subTask?.filter((task) => task.status === "CONFIRM")
                .length === tasks.subTask?.length && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                >
                  <Button
                    isLoading={updateEventStatusIsLoading}
                    // size="large"
                    type="primary"
                    icon={<VscDebugStart size={15} />}
                    onClick={() => handleUpdateStatusTask("DONE")}
                  >
                    Hoàn thành hạng mục
                  </Button>
                </motion.div>
              )}
          </AnimatePresence> */}
        </div>
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
            <p className="text-sm">
              Chịu trách nhiệm bởi{" "}
              <span className="font-semibold">
                {tasks?.assignTasks?.[0]?.user?.profile?.fullName}
              </span>
            </p>
          </div>

          <div className="flex-1 flex justify-end space-x-8">
            <motion.div
              whileHover={{ y: -5 }}
              className={`flex items-center px-3 ${statusColor} border ${statusBorder} rounded-full truncate cursor-pointer`}
            >
              <p className="text-base font-medium">{status}</p>
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
                      ? moment(tasks?.startDate)
                          .utc()
                          .format("dddd, D [tháng] M")
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
                      ? moment(tasks?.endDate).utc().format("dddd, D [tháng] M")
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
          {/* <div className="space-y-5">
            <Card>
              <p className="text-base font-medium">
                Thời gian ước lượng:{" "}
                {tasks.estimationTime ? (
                  <span className="underline">{tasks.estimationTime} giờ</span>
                ) : (
                  "Chưa có"
                )}
              </p>
            </Card>
            <Card>
              <p className="text-base font-medium">
                Công số:{" "}
                {tasks.effort ? (
                  <span className="underline">{tasks.effort} giờ</span>
                ) : (
                  "Chưa có"
                )}
              </p>
            </Card>
          </div> */}
          <Progress
            type="dashboard"
            percent={
              tasks?.subTask?.filter((subtask) => subtask.status === "CONFIRM")
                .length / tasks?.subTask?.length
            }
            gapDegree={30}
          />
          <Card title="Mô tả" className="flex-1">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: new QuillDeltaToHtmlConverter(
                  JSON.parse(
                    tasks?.description?.startsWith(`[{"insert":"`)
                      ? tasks?.description
                      : parseJson(tasks?.description)
                  )
                ).convert(),
              }}
            />
          </Card>
          <Card title="Tệp đính kèm" className="w-[20%]">
            {tasks?.taskFiles?.length > 0 ? (
              <div className="flex gap-x-3 items-center max-h-fit overflow-y-scroll">
                {tasks?.taskFiles?.map((file, index) => (
                  <a
                    key={index}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {file?.fileName}
                  </a>
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
                if (
                  subtask?.assignTasks?.length !== 0 ||
                  subtask?.createdBy === manager?.id
                )
                  return (
                    <TaskItem
                      key={subtask?.id}
                      task={subtask}
                      isSubtask={true}
                      setSelectedSubTask={setSelectedSubTask}
                      setIsOpenUpdateSubTaskModal={setIsOpenUpdateSubTaskModal}
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

            {selectedSubTask && (
              <>
                <SubTaskModal
                  isOpenModal={isOpenModal}
                  setIsOpenModal={setIsOpenModal}
                  selectedSubTask={selectedSubTask}
                  resetTaskRedirect={resetTaskRedirect}
                />
              </>
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
