import React, { useEffect, useState } from "react";
import TitleSubtask from "./TitleSubtask/TitleSubtask";
import FieldSubtask from "./FieldSubtask/FieldSubtask";
import DescriptionSubtask from "./DescriptionSubtask/DescriptionSubtask";
import Subtasks from "./Subtask/Subtasks";
import CommentInput from "./Comment/CommentInput";
import Comments from "./Comment/Comments";
import {
  BookOutlined,
  OrderedListOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getComment } from "../../../apis/comments";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import { getProfile } from "../../../apis/users";
import moment from "moment";
import { Button } from "antd";
import HistoryAssignee from "./HistoryAssignee";

const TaskModalContent = ({
  disableEndDate,
  disableStartDate,
  taskParent,
  setSelectedSubTask,
  taskSelected,
  disableUpdate,
  setIsOpenTaskModal,
  completed,
  disableDoneTaskParent,
  onCloseModal,
}) => {
  // console.log("🚀 ~ taskParent:", taskParent);
  const {
    data: listComments,
    isError: isErrorListComments,
    isLoading: isLoadingListComments,
  } = useQuery(
    ["comments", taskSelected.id],
    () => getComment(taskSelected.id),
    {
      select: (data) => {
        const formatDate = data.map(({ ...item }) => {
          item.createdAt = moment(item.createdAt).format("MM/DD HH:mm");
          return {
            ...item,
          };
        });
        return formatDate;
      },
      refetchOnWindowFocus: false,
      enabled: !!taskSelected.id,
    }
  );

  const {
    data: staff,
    isError: isErrorStaff,
    isLoading: isLoadingStaff,
  } = useQuery(["staff"], () => getProfile(), {
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const [title, setTitle] = useState(taskSelected?.title);
  const [description, setDescription] = useState(taskSelected?.description);
  const [subTasks, setSubTasks] = useState(taskSelected?.subTask);
  const [isHistoryAssignee, setIsHistoryAssignee] = useState(false);
  let completionPercentage;
  if (taskParent) {
    completionPercentage = ((completed / subTasks?.length) * 100).toFixed(0);
  }

  return (
    <div>
      <div className="w-full flex flex-col  items-start mb-4">
        <TitleSubtask
          setTitle={setTitle}
          title={title}
          disableUpdate={disableUpdate}
          taskParent={taskParent}
          taskSelected={taskSelected}
        />

        {/* check ko phaỉ task cha mới cho xem */}
        {!taskParent && (
          <>
            {isHistoryAssignee ? (
              <p
                className="w-auto mb-2 px-6 flex flex-row gap-x-2 items-center hover:text-blue-700 cursor-pointer font-medium -mt-2"
                onClick={() => setIsHistoryAssignee(false)}
              >
                Chi tiết công việc <BookOutlined />
              </p>
            ) : (
              <p
                className="w-auto mb-2 px-6 flex flex-row gap-x-2 items-center hover:text-blue-700 cursor-pointer font-medium -mt-2"
                onClick={() => setIsHistoryAssignee(true)}
              >
                Lịch sử phân công <SearchOutlined />
              </p>
            )}
          </>
        )}
      </div>

      {isHistoryAssignee ? (
        <HistoryAssignee taskSelected={taskSelected} />
      ) : (
        <>
          {/* field */}
          {!isLoadingStaff ? (
            !isErrorStaff ? (
              <FieldSubtask
                disableEndDate={disableEndDate}
                disableStartDate={disableStartDate}
                disableUpdate={disableUpdate}
                taskSelected={taskSelected}
                taskParent={taskParent}
                staff={staff}
                setIsOpenTaskModal={setIsOpenTaskModal}
                disableDoneTaskParent={disableDoneTaskParent}
                completionPercentage={completionPercentage}
                onCloseModal={onCloseModal}
              />
            ) : (
              <AnErrorHasOccured />
            )
          ) : (
            <LoadingComponentIndicator />
          )}

          {/* task description */}
          <DescriptionSubtask
            taskSelected={taskSelected}
            disableUpdate={disableUpdate}
            description={description}
            setDescription={setDescription}
            taskParent={taskParent}
          />

          {/* task subTask */}
          {taskParent && (
            <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
              <div className="flex justify-center items-center">
                <label
                  htmlFor="board-subTask-input" //lấy id :D
                  className="text-sm  text-gray-500 cursor-pointer"
                >
                  <OrderedListOutlined style={{ fontSize: 24 }} />
                </label>
              </div>
              <div className="w-full flex flex-col">
                <h3 className="text-lg font-bold">
                  Công việc ({completed}/{subTasks.length})
                </h3>
                <div
                  className={
                    subTasks.length > 3
                      ? `overflow-y-scroll max-h-[250px] pr-4`
                      : `min-h-fit`
                  }
                >
                  {subTasks.map((subTask) => (
                    <Subtasks
                      disableUpdate={disableUpdate}
                      key={subTask.id}
                      Subtask={subTask}
                      setSelectedSubTask={setSelectedSubTask}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <>
            <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
              <div className="flex justify-center items-center">
                <label
                  htmlFor="board-description-input" //lấy id :D
                  className="text-sm dark:text-white text-gray-500 cursor-pointer"
                >
                  <SnippetsOutlined style={{ fontSize: 24, color: "black" }} />
                </label>
              </div>
              <div className="w-full flex flex-col">
                <h3 className="text-lg font-bold">Hoạt động</h3>
              </div>
            </div>
            {/* comment */}
            {!disableUpdate && (
              <>
                {!isLoadingStaff ? (
                  !isErrorStaff ? (
                    <CommentInput staff={staff} taskSelected={taskSelected} />
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <LoadingComponentIndicator />
                )}
              </>
            )}
            {/* comment of task */}
            {!isLoadingListComments ? (
              !isErrorListComments ? (
                listComments?.map((comment) => {
                  return (
                    <Comments
                      disableUpdate={disableUpdate}
                      key={comment.id}
                      comment={comment}
                      taskSelected={taskSelected}
                    />
                  );
                })
              ) : (
                <AnErrorHasOccured />
              )
            ) : (
              <LoadingComponentIndicator />
            )}
          </>
        </>
      )}
    </div>
  );
};

export default TaskModalContent;
