import React, { useEffect, useState } from "react";
import TitleSubtask from "./TitleSubtask/TitleSubtask";
import FieldSubtask from "./FieldSubtask/FieldSubtask";
import DescriptionSubtask from "./DescriptionSubtask/DescriptionSubtask";
import Subtasks from "./Subtask/Subtasks";
import CommentInput from "./Comment/CommentInput";
import Comments from "./Comment/Comments";
import { OrderedListOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getComment } from "../../../apis/comments";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import { getProfile } from "../../../apis/users";
import moment from "moment";

const TaskModalContent = ({
  taskParent,
  setSelectedSubTask,
  selectedSubTask,
  taskSelected,
  setTaskSelected,
}) => {
  // const taskId =  taskSelected.id;
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
      // enabled: !!taskSelected.id,
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
    enabled: taskParent,
  });

  const [title, setTitle] = useState(taskSelected.title);
  const [description, setDescription] = useState(taskSelected.description);
  const [subTasks, setSubTasks] = useState(taskSelected.subTask);

  // Subtask
  const onChangeSubtask = (id, newTitle) => {};

  let completed = 0;
  if (taskParent) {
    taskSelected.subTask.forEach((task) => {
      if (task.status === "confirmed") {
        completed++;
      }
    });
  }

  useEffect(() => {
    setTitle(taskSelected.title);
    setDescription(taskSelected.description);
    setSubTasks(taskSelected.subTask);
  }, [taskSelected]);

  return (
    <div>
      <TitleSubtask setTitle={setTitle} title={title} />

      {/* field */}
      {!isLoadingStaff ? (
        !isErrorStaff ? (
          <FieldSubtask
            taskSelected={taskSelected}
            taskParent={taskParent}
            staff={staff}
          />
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}

      {/* task description */}
      <DescriptionSubtask
        description={description}
        setDescription={setDescription}
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
            {subTasks.map((subTask) => (
              <Subtasks
                key={subTask.id}
                onChangeSubtask={onChangeSubtask}
                Subtask={subTask}
                setSelectedSubTask={setSelectedSubTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* comment */}
      {!isLoadingStaff ? (
        !isErrorStaff ? (
          <CommentInput staff={staff} taskSelected={taskSelected} />
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}

      {/* comment of task */}
      {!isLoadingListComments ? (
        !isErrorListComments ? (
          listComments.length > 0 &&
          listComments.map((comment) => (
            <Comments
              key={comment.id}
              comment={comment}
              taskSelected={taskSelected}
            />
          ))
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </div>
  );
};

export default TaskModalContent;
