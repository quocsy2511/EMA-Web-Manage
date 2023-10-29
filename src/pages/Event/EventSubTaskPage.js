import React, { Fragment, useState } from "react";
import {
  Link,
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
import { BiDetail } from "react-icons/bi";
import { VscDebugStart } from "react-icons/vsc";
import { MdOutlineDoneOutline } from "react-icons/md";
import { Avatar, Button, Card, FloatButton, message } from "antd";
import TaskItem from "../../components/Task/TaskItem";
import CommentInTask from "../../components/Comment/CommentInTask";
import SubTaskModal from "../../components/Modal/SubTaskModal";
import TaskAdditionModal from "../../components/Modal/TaskAdditionModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "../../apis/tasks";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import { getComment } from "../../apis/comments";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import moment from "moment";
import TaskUpdateModal from "../../components/Modal/TaskUpdateModal";

const EventSubTaskPage = () => {
  const eventId = useParams().eventId;
  const taskId = useParams().taskId;
  const manager = useRouteLoaderData("manager");
  const navigate = useNavigate();

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
    }
  );
  console.log("tasks: ", tasks);

  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = useQuery(["comment", taskId], () => getComment(taskId));

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

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState();
  const [isOpenUpdateTaskModal, setIsOpenUpdateTaskModal] = useState(false);
  const [isOpenUpdateSubTaskModal, setIsOpenUpdateSubTaskModal] =
    useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleOpenModal = () => {
    setIsOpenCreateTaskModal((prev) => !prev);
  };

  const handleOpenUpdateModal = () => {
    setIsOpenUpdateTaskModal((prev) => !prev);
  };

  const handleUpdateStatusTask = (status) => {
    updateEventStatusMutate({
      taskID: taskId,
      status,
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
  switch (tasks.priority) {
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
  switch (tasks.status) {
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
        onClick={handleOpenModal}
        icon={<BsPlus />}
        type="primary"
        tooltip={
          <p>
            {tasks.assignTasks.length !== 0
              ? "Tạo công việc"
              : "Chưa phân công cho bộ phận nào!"}
          </p>
        }
      />

      {tasks.assignTasks.length !== 0 && (
        <TaskAdditionModal
          isModalOpen={isOpenCreateTaskModal}
          setIsModalOpen={setIsOpenCreateTaskModal}
          eventId={eventId}
          date={[tasks.startDate, tasks.endDate]}
          parentTaskId={taskId}
          staffId={tasks.assignTasks[0].user.id}
        />
      )}

      <TaskUpdateModal
        isModalOpen={isOpenUpdateTaskModal}
        setIsModalOpen={setIsOpenUpdateTaskModal}
        eventID={eventId}
        task={tasks}
        isSubTask={false}
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
            {tasks.event.eventName}
          </Link>{" "}
          / {tasks.title}
        </p>
        <div className="flex items-end">
          <AnimatePresence>
            {tasks.subTask.length !== 0 &&
              tasks.subTask.filter((task) => task.status === "CONFIRM")
                .length === tasks.subTask.length &&
              tasks.status === "DONE" && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                >
                  <Button
                    isLoading={updateEventStatusIsLoading}
                    // size="large"
                    icon={<MdOutlineDoneOutline size={15} />}
                    type="primary"
                    onClick={() => handleUpdateStatusTask("CONFIRM")}
                    className="font-medium"
                  >
                    Hoàn thành hạng mục
                  </Button>
                </motion.div>
              )}
          </AnimatePresence>

          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="min-h-[calc(100vh-200px)] bg-white mt-8 px-10 py-8 rounded-2xl"
      >
        <div className="flex items-center">
          {priorityIcon}

          <div className="w-[2%]" />

          <div className="space-y-1">
            <p className="text-2xl font-semibold">{tasks.title}</p>
            {tasks.assignTasks.length === 0 ? (
              <p className="text-sm">Chưa giao công việc !!</p>
            ) : (
              <p className="text-sm">
                Chịu trách nhiệm bởi{" "}
                <span className="font-semibold">
                  {tasks.assignTasks[0]?.user.profile.fullName}
                </span>
              </p>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <div
              className={`flex items-center px-3 ${statusColor} border ${statusBorder} rounded-full`}
            >
              {status}
            </div>
            <div className="w-[4%]" />
            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center px-4 py-2 bg-green-100 text-green-400 rounded-xl"
            >
              <BsHourglassSplit size={15} />
              <div className="w-4" />
              <p className="text-base font-medium">
                {tasks.startDate
                  ? moment(tasks.startDate).utc().format("DD/MM/YYYY HH:mm:ss")
                  : "-- : --"}
              </p>
            </motion.div>
            <div className="w-[4%]" />
            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center px-4 py-2 bg-red-100 text-red-400 rounded-xl"
            >
              <BsHourglassBottom size={15} />
              <div className="w-4" />
              <p className="text-base font-medium">
                {tasks.endDate
                  ? moment(tasks.endDate).utc().format("DD/MM/YYYY HH:mm:ss")
                  : "-- : --"}
              </p>
            </motion.div>
          </div>

          <div className="w-[4%]" />

          <motion.div whileHover={{ y: -5 }}>
            <Avatar size={40} src={tasks.assignTasks[0]?.user.profile.avatar} />
          </motion.div>

          <div className="w-[4%]" />

          <motion.div
            whileHover={{ y: -5 }}
            className="cursor-pointer"
            onClick={handleOpenUpdateModal}
          >
            <BiDetail size={30} className="text-slate-400" />
          </motion.div>
        </div>

        <div className="mt-5 flex gap-x-10">
          <div className="space-y-5">
            <Card>
              <p className="text-base font-medium">
                Thời gian ước lượng:{" "}
                {tasks.estimationTime ? (
                  <span className="underline">1{tasks.estimationTime} giờ</span>
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
          </div>
          <Card title="Mô tả" className="flex-1">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: new QuillDeltaToHtmlConverter(
                  JSON.parse(tasks.description)
                ).convert(),
              }}
            />
          </Card>
          <Card title="Tệp đính kèm" className="w-[20%]">
            {tasks.taskFiles.length > 0 ? (
              <div className="flex gap-x-3 items-center max-h-fit overflow-y-scroll">
                {tasks.taskFiles.map((file) => (
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {file.fileName}
                  </a>
                ))}
              </div>
            ) : (
              <p>Không có</p>
            )}
          </Card>
        </div>

        <div
          className={`flex flex-col gap-y-6 ${
            tasks.subTask.length !== 0 && "mt-10 mx-10"
          }`}
        >
          <AnimatePresence>
            {tasks.subTask.length !== 0 &&
              tasks.subTask.map((subtask) => {
                if (
                  subtask.assignTasks.length !== 0 ||
                  subtask.createdBy === manager.id
                )
                  return (
                    <TaskItem
                      key={subtask.id}
                      task={subtask}
                      isSubtask={true}
                      setSelectedSubTask={setSelectedSubTask}
                      setIsOpenUpdateSubTaskModal={setIsOpenUpdateSubTaskModal}
                      setIsOpenModal={setIsOpenModal}
                    />
                  );
              })}
            {selectedSubTask && (
              <>
                <SubTaskModal
                  isOpenModal={isOpenModal}
                  setIsOpenModal={setIsOpenModal}
                  selectedSubTask={selectedSubTask}
                />
                <TaskUpdateModal
                  isModalOpen={isOpenUpdateSubTaskModal}
                  setIsModalOpen={setIsOpenUpdateSubTaskModal}
                  eventID={eventId}
                  task={selectedSubTask}
                  isSubTask={true}
                  staffId={tasks.assignTasks?.[0]?.user.id}
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

export default EventSubTaskPage;
