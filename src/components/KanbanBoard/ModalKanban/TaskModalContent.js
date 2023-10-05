import dayjs from "dayjs";
import React, { useState } from "react";
import TitleSubtask from "./TitleSubtask/TitleSubtask";
import FieldSubtask from "./FieldSubtask/FieldSubtask";
import DescriptionSubtask from "./DescriptionSubtask/DescriptionSubtask";
import Subtasks from "./Subtask/Subtasks";
import CommentInput from "./Comment/CommentInput";
import Comments from "./Comment/Comments";
import { message } from "antd";

const TaskModalContent = ({
  setIsOpenTaskModal,
  taskParent,
  Subtask,
  setSubtask,
  boardItem,
  setSelectedSubTask,
  selectedSubTask,
}) => {
  const [title, setTitle] = useState("Task name");
  const [description, setDescription] = useState("description name");
  const [comment, setComment] = useState("Vu beos ngooooooooooooooooo");
  const [deadline, setDeadline] = useState(
    dayjs("2023-09-30", "YYYY-MM-DD").hour(12).minute(12).second(46)
  );
  const [isOpenQuill, seItsOpenQuill] = useState(false);
  const [isOpenMember, seItsOpenMember] = useState(false);
  const [isOpenDate, setIsOpenDate] = useState(false);

  //Pick deadline
  const onChange = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    setDeadline(dateString);
  };
  const onOk = (value, dateString) => {
    // console.log("🚀 ~ file: TaskModal.js:48 ~ onOk ~ dateString:", dateString);
    // console.log("onOk: ", value);
  };

  // Subtask
  const onChangeCheckSubTask = (id, e) => {
    // console.log(`checked = ${e.target.checked}`);
    // setChecked(e.target.checked);
    let checkedSubtask = e.target.checked;
    const updatedSubtask = Subtask.map((task) => {
      if (task.id === id) {
        return { ...task, checked: checkedSubtask };
      }
      return task;
    });
    setSubtask(updatedSubtask);
  };

  const onChangeSubtask = (id, newTitle) => {
    const updatedSubtask = Subtask.map((item) => {
      if (item.id === id) {
        return { ...item, title: newTitle };
      }
      return item;
    });
    setSubtask(updatedSubtask);
  };

  //Upload file
  const props = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <TitleSubtask setTitle={setTitle} title={title} />

      {/* field */}
      <FieldSubtask
        boardItem={boardItem}
        deadline={deadline}
        isOpenDate={isOpenDate}
        onChange={onChange}
        onOk={onOk}
        props={props}
        setIsOpenDate={setIsOpenDate}
        isOpenMember={isOpenMember}
        seItsOpenMember={seItsOpenMember}
      />

      {/* task description */}
      <DescriptionSubtask
        description={description}
        isOpenQuill={isOpenQuill}
        seItsOpenQuill={seItsOpenQuill}
        setDescription={setDescription}
      />

      {/* task subTask */}
      {taskParent && (
        <Subtasks
          boardItem={boardItem}
          deadline={deadline}
          isOpenDate={isOpenDate}
          onChange={onChange}
          onChangeCheckSubTask={onChangeCheckSubTask}
          onChangeSubtask={onChangeSubtask}
          onOk={onOk}
          setIsOpenDate={setIsOpenDate}
          Subtask={Subtask}
          setIsOpenTaskModal={setIsOpenTaskModal}
          setSelectedSubTask={setSelectedSubTask}
        />
      )}

      {/* comment */}
      <CommentInput
        comment={comment}
        isOpenQuill={isOpenQuill}
        seItsOpenQuill={seItsOpenQuill}
        setComment={setComment}
      />

      {/* comment of task */}
      <Comments
        comment={comment}
        isOpenQuill={isOpenQuill}
        seItsOpenQuill={seItsOpenQuill}
        setComment={setComment}
      />
    </div>
  );
};

export default TaskModalContent;
