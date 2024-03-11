import {
  AlignLeftOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, message } from "antd";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getTasks, updateTask } from "../../../../apis/tasks";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import { useRouteLoaderData } from "react-router-dom";
const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);
const DescriptionSubtask = ({
  description,
  setDescription,
  disableUpdate,
  taskParent,
  taskSelected,
}) => {
  const [form] = Form.useForm();
  const taskID = taskSelected?.id;
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
  const [descriptionQuill, setDescriptionQuill] = useState({
    ops: JSON.parse(
      description?.startsWith(`[{"`)
        ? description
        : parseJson(description)
    ),
  });
  const [isOpenQuill, seItsOpenQuill] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: subtaskDetails,
    isLoading: isLoadingSubtask,
    isError: isErrorSubtask,
  } = useQuery(
    ["subtaskDetails", taskID],
    () =>
      getTasks({
        fieldName: "id",
        conValue: taskID,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
      enabled: !!taskID,
    }
  );

  const { mutate: updateDescription, isLoading } = useMutation(
    (task) => updateTask(task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        message.open({
          type: "success",
          content: "Cập nhật mô tả công việc thành công",
        });
        setTimeout(() => {
          seItsOpenQuill(false);
        }, 300);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể Cập nhật mô tả công việc Hãy thử lại sau",
        });
      },
    }
  );

  const onFinish = (value) => {
    const eventID = taskSelected?.eventDivision?.event.id;
    const parentTask = taskSelected.parent.id;
    const {
      approvedBy,
      assignTasks,
      createdAt,
      createdBy,
      event,
      id,
      modifiedBy,
      parent,
      status,
      subTask,
      taskFiles,
      updatedAt,
      ...rest
    } = taskSelected;

    const data = {
      ...rest,
      description: JSON.stringify(value.desc.ops),
      eventID: eventID,
      parentTask: parentTask,
      taskID: taskID,
    };
    updateDescription(data);
  };

  return (
    <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-description-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          <AlignLeftOutlined className="text-black text-2xl" />
        </label>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-bold">Mô tả</h3>
        {taskParent ? (
          <>
            <div className="rounded-md text-sm text-black font-normal bg-slate-100 cursor-pointer w-full bg-transparent px-4 py-2">
              {description !== undefined && description !== null ? (
                <p
                  className="text-base italic text-black "
                  dangerouslySetInnerHTML={{
                    __html: new QuillDeltaToHtmlConverter(
                      JSON.parse(
                        description?.startsWith(`[{"`)
                          ? description
                          : parseJson(description)
                      )
                    ).convert(),
                  }}
                ></p>
              ) : (
                <p className="text-base italic text-black bg-slate-100 p-4 rounded-md opacity-40">
                  Add more detail description ....
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {isOpenQuill && !disableUpdate ? (
              <>
                {!isLoadingSubtask ? (
                  !isErrorSubtask ? (
                    <Form onFinish={onFinish} form={form}>
                      <Form.Item
                        name="desc"
                        initialValue={descriptionQuill}
                        className="mb-0"
                      >
                        <ReactQuill
                          theme="snow"
                          onChange={(content, delta, source, editor) => {
                            form.setFieldsValue({ desc: editor.getContents() });
                          }}
                          className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full"
                        />
                      </Form.Item>
                      <div className="flex flex-row">
                        <Button
                          type="link"
                          className="flex items-center justify-center text-red-400"
                          onClick={() => seItsOpenQuill(false)}
                          loading={isLoading}
                        >
                          Huỷ
                        </Button>
                        <Button
                          htmlType="submit"
                          type="primary"
                          className="flex items-center justify-center"
                        >
                          Lưu
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <LoadingComponentIndicator />
                )}
              </>
            ) : (
              <div
                className="rounded-md text-sm text-black font-normal bg-slate-100 cursor-pointer w-full bg-transparent px-4 py-2"
                onClick={() => seItsOpenQuill(true)}
              >
                {subtaskDetails?.[0].description !== undefined &&
                subtaskDetails?.[0].description !== null ? (
                  <p
                    className="text-base italic text-black "
                    dangerouslySetInnerHTML={{
                      __html: new QuillDeltaToHtmlConverter(
                        JSON.parse(
                          subtaskDetails?.[0].description?.startsWith(
                            `[{"`
                          )
                            ? subtaskDetails?.[0].description
                            : parseJson(subtaskDetails?.[0].description)
                        )
                      ).convert(),
                    }}
                  ></p>
                ) : (
                  <p className="text-base italic text-black bg-slate-100 p-4 rounded-md opacity-40">
                    Add more detail description ....
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DescriptionSubtask;
