import React, { useEffect, useState } from "react";
import TitleSubtask from "./TitleSubtask/TitleSubtask";
import FieldSubtask from "./FieldSubtask/FieldSubtask";
import DescriptionSubtask from "./DescriptionSubtask/DescriptionSubtask";
import Subtasks from "./Subtask/Subtasks";
import CommentInput from "./Comment/CommentInput";
import Comments from "./Comment/Comments";
import { OrderedListOutlined } from "@ant-design/icons";

const TaskModalContent = ({
  taskParent,
  setSelectedSubTask,
  selectedSubTask,
  taskSelected,
  setTaskSelected,
}) => {
  const [title, setTitle] = useState(taskSelected.title);
  const [description, setDescription] = useState(taskSelected.description);
  const [comments, setComments] = useState(taskSelected.comment);

  const [subTasks, setSubTasks] = useState(taskSelected.tasks);

  // Subtask
  const onChangeSubtask = (id, newTitle) => {};

  let completed = 0;
  if (taskParent) {
    subTasks.forEach((task) => {
      if (task.status === "confirmed") {
        completed++;
      }
    });
  }

  useEffect(() => {
    setTitle(taskSelected.title);
    setDescription(taskSelected.description);
    setComments(taskSelected.comment);
    setSubTasks(taskSelected.tasks);
  }, [taskSelected]);

  return (
    <div>
      <TitleSubtask setTitle={setTitle} title={title} />

      {/* field */}
      <FieldSubtask taskSelected={taskSelected} taskParent={taskParent} />

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
              Subtask ({completed}/{subTasks.length})
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
      <CommentInput />

      {/* comment of task */}
      {comments.map((comment) => (
        <Comments
          key={comment.id}
          comment={comment}
          // setComment={setComment}
        />
      ))}
    </div>
  );
};

export default TaskModalContent;
