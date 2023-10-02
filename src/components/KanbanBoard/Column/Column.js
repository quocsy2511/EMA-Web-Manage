import React, { useEffect, useState } from "react";
import TaskKanbanBoard from "../TaskKanban/TaskKanbanBoard";
import { Button, Form, Input } from "antd";
import TaskModal from "../ModalKanban/TaskModal";

const SubmitButton = ({ form }) => {
  const [submittable, setSubmittable] = useState(false);

  // chưa nhập title chưa mở khoá button submit
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      Submit
    </Button>
  );
};

const Column = () => {
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [addNewTask, setAddNewTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [form] = Form.useForm();

  const openTaskModalHandler = () => {
    setIsOpenTaskModal(true);
  };

  const handleInputBlur = () => {
    if (!taskTitle) {
      setAddNewTask(false);
    }
  };

  return (
    <>
      <div className="scrollbar-hide mt-5 min-w-[280px]">
        <div className=" bg-gray-100 dark:bg-secondaryHover py-3 scrollbar-hide rounded-xl shadow-darkShadow shadow-sm">
          <div
            className="font-semibold flex flex-col items-start gap-2 text-textCol dark:text-white justify-start 
          w-[250px] mx-auto my-2 rounded-lg bg-white dark:bg-dark shadow-darkShadow py-3 px-3 shadow-lg hover:opacity-80 cursor-pointer"
            onClick={() => openTaskModalHandler()}
          >
            <div className="flex items-center gap-2 w-full">
              <span className={`rounded-full w-4 h-4 bg-red-600`}></span>
              <div className="flex flex-col">
                <p className=" w-[145px] whitespace-normal">
                  Thiết kế sân khấu (5)
                </p>
                <p className="text-[7px] font-normal text-gray-400 underline underline-offset-2">
                  {/* {col.time} */}
                  28/07-29/08
                </p>
              </div>
            </div>
          </div>

          <TaskKanbanBoard />
          <TaskKanbanBoard />
          <TaskKanbanBoard />

          {addNewTask ? (
            <div className=" w-[250px] mx-auto rounded-lg py-3 px-3 dark:bg-secondary  bg-white">
              <Form
                form={form}
                name="taskTitle"
                // onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  hasFeedback
                  name="taskTitle"
                  rules={[
                    {
                      required: true,
                      message: "Please input your task tile!",
                    },
                  ]}
                >
                  <Input
                    onBlur={handleInputBlur}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    autoFocus
                  />
                </Form.Item>
                <SubmitButton form={form} />
                <Button type="text" onClick={() => setAddNewTask(false)}>
                  Close
                </Button>
              </Form>
            </div>
          ) : (
            <div
              className=" w-[250px] mx-auto mt-5 rounded-lg py-3 px-3 hover:text-secondary  text-gray-400 dark:hover:text-white dark:hover:bg-secondary  cursor-pointer hover:bg-white"
              onClick={() => setAddNewTask(true)}
            >
              <p className="text-sm font-semibold tracking-tighter">
                + Add a task
              </p>
            </div>
          )}
        </div>
        {isOpenTaskModal && (
          <TaskModal
            isOpenTaskModal={isOpenTaskModal}
            setIsOpenTaskModal={setIsOpenTaskModal}
          />
        )}
      </div>
    </>
  );
};

export default Column;
