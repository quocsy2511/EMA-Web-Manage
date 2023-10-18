import React, { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { BsHourglassBottom, BsHourglassSplit, BsPlus } from "react-icons/bs";
import { Avatar, FloatButton } from "antd";
import { BiDetail } from "react-icons/bi";
import TaskItem from "../../components/Task/TaskItem";
import CommentInTask from "../../components/Comment/CommentInTask";
import SubTaskModal from "../../components/Modal/SubTaskModal";
import TaskAdditionModal from "../../components/Modal/TaskAdditionModal";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../apis/tasks";
import EmptyList from "../../components/Error/EmptyList";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";

const EventSubTaskPage = () => {
  const eventId = useParams().eventId;
  const taskId = useParams().taskId;

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

  const [subtasks, setSubtasks] = useState([1, 2, 3]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState();

  const handleOpenModal = () => {
    setIsOpenCreateTaskModal((prev) => !prev);
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

  return (
    <Fragment>
      {}
      <FloatButton
        onClick={handleOpenModal}
        icon={<BsPlus />}
        type="primary"
        tooltip={<p>Tạo công việc</p>}
      />
      {/* <TaskAdditionModal
        isModalOpen={isOpenCreateTaskModal}
        setIsModalOpen={setIsOpenCreateTaskModal}
        eventId={eventId}
        date={[tasks.startDate, tasks.endDate]}
        parentTaskId={taskId}
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
            Khai giảng
          </Link>{" "}
          / Công việc 1
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="min-h-[calc(100vh-200px)] bg-white mt-8 px-10 py-8 rounded-2xl"
      >
        <div className="flex items-center">
          <FcLowPriority size={30} />

          <div className="w-[2%]" />

          <div className="space-y-1">
            <p className="text-2xl font-semibold">Lễ khai giảng</p>
            <p className="text-sm">
              Chịu trách nhiệm bởi{" "}
              <span className="font-semibold">Quốc Sỹ</span> ( Thiết kế )
            </p>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center px-4 py-2 bg-green-100 text-green-400 rounded-xl">
              <BsHourglassSplit size={15} />
              <div className="w-4" />
              <p className="text-base font-medium">28/9/2023</p>
            </div>
            <div className="w-[4%]" />
            <div className="flex items-center px-4 py-2 bg-green-100 text-green-400 rounded-xl">
              <BsHourglassBottom size={15} />
              <div className="w-4" />
              <p className="text-base font-medium">28/9/2023</p>
            </div>
          </div>

          <div className="w-[4%]" />

          <Avatar
            size={40}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
          />

          <div className="w-[4%]" />

          <BiDetail size={30} className="text-slate-400" />
        </div>

        <div className="flex flex-col gap-y-6 mt-10 mx-10">
          <AnimatePresence mode="await">
            {tasks.subTask.length !== 0 ? (
              tasks.subTask.map((subtask) => (
                <TaskItem
                  task={subtask}
                  isSubtask={true}
                  setSelectedSubTask={setSelectedSubTask}
                  setIsOpenModal={setIsOpenModal}
                />
              ))
            ) : (
              <EmptyList title="Chưa có công việc nào!" />
            )}
            <SubTaskModal
              isOpenModal={isOpenModal}
              setIsOpenModal={setIsOpenModal}
              selectedSubTask={selectedSubTask}
            />
          </AnimatePresence>
        </div>

        <div className="mt-14">
          <CommentInTask />
        </div>
      </motion.div>
    </Fragment>
  );
};

export default EventSubTaskPage;
