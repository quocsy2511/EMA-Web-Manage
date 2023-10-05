import { Modal } from "antd";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
// import dayjs from "dayjs";
// import "dayjs/locale/zh-cn";
// import TitleSubtask from "./TitleSubtask/TitleSubtask";
// import FieldSubtask from "./FieldSubtask/FieldSubtask";
// import DescriptionSubtask from "./DescriptionSubtask/DescriptionSubtask";
// import Subtasks from "./Subtask/Subtasks";
// import CommentInput from "./Comment/CommentInput";
// import Comments from "./Comment/Comments";
import TaskModalContent from "./TaskModalContent";

const boardItem = {
  manager: "Tung",
  name: "🔥 Sự kiện kỷ niệm 10 năm",
  members: [
    {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    {
      name: "syx",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    {
      name: "Huyx",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    {
      name: "Thiepx",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
  ],
};

const TaskModal = ({
  isOpenTaskModal,
  setIsOpenTaskModal,
  taskParent = false,
}) => {
  // const [title, setTitle] = useState("Task name");
  // const [description, setDescription] = useState("description name");
  // const [comment, setComment] = useState("Vu beos ngooooooooooooooooo");
  // const [deadline, setDeadline] = useState(
  //   dayjs("2023-09-30", "YYYY-MM-DD").hour(12).minute(12).second(46)
  // );
  // const [isOpenQuill, seItsOpenQuill] = useState(false);
  // const [isOpenMember, seItsOpenMember] = useState(false);
  // const [isOpenDate, setIsOpenDate] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);

  const [Subtask, setSubtask] = useState([
    { title: "Task1", id: 1, checked: true, comment: "alo 123" },
    { title: "Task2", id: 2, checked: false, comment: "alo 123" },
    { title: "Task3", id: 3, checked: false },
  ]);

  const onCloseModal = () => {
    console.log("Click");
    setIsOpenTaskModal(false);
  };

  // //Pick deadline
  // const onChange = (value, dateString) => {
  //   // console.log("Selected Time: ", value);
  //   // console.log("Formatted Selected Time: ", dateString);
  //   setDeadline(dateString);
  // };
  // const onOk = (value, dateString) => {
  //   // console.log("🚀 ~ file: TaskModal.js:48 ~ onOk ~ dateString:", dateString);
  //   // console.log("onOk: ", value);
  // };

  // // Subtask
  // const onChangeCheckSubTask = (id, e) => {
  //   // console.log(`checked = ${e.target.checked}`);
  //   // setChecked(e.target.checked);
  //   let checkedSubtask = e.target.checked;
  //   const updatedSubtask = Subtask.map((task) => {
  //     if (task.id === id) {
  //       return { ...task, checked: checkedSubtask };
  //     }
  //     return task;
  //   });
  //   setSubtask(updatedSubtask);
  // };

  // const onChangeSubtask = (id, newTitle) => {
  //   const updatedSubtask = Subtask.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, title: newTitle };
  //     }
  //     return item;
  //   });
  //   setSubtask(updatedSubtask);
  // };

  //Upload file
  // const props = {
  //   name: "file",
  //   action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  return (
    <div>
      <Modal
        // title="Task name"
        open={isOpenTaskModal}
        onCancel={onCloseModal}
        footer={false}
        closeIcon={false}
        width={600}
        style={{
          top: 20,
        }}
      >
        {/* <TitleSubtask setTitle={setTitle} title={title} />
       
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

       
        <DescriptionSubtask
          description={description}
          isOpenQuill={isOpenQuill}
          seItsOpenQuill={seItsOpenQuill}
          setDescription={setDescription}
        />

       
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
          />
        )}

        
        <CommentInput
          comment={comment}
          isOpenQuill={isOpenQuill}
          seItsOpenQuill={seItsOpenQuill}
          setComment={setComment}
        />

        <Comments
          comment={comment}
          isOpenQuill={isOpenQuill}
          seItsOpenQuill={seItsOpenQuill}
          setComment={setComment} 
        /> */}
        {selectedSubTask === null ? (
          //cha
          <TaskModalContent
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
            taskParent={taskParent}
            Subtask={Subtask}
            setSubtask={setSubtask}
            boardItem={boardItem}
            setSelectedSubTask={setSelectedSubTask}
          />
        ) : (
          //con
          <TaskModalContent
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
            taskParent={!taskParent}
            Subtask={Subtask}
            setSubtask={setSubtask}
            boardItem={boardItem}
            selectedSubTask={selectedSubTask}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskModal;
