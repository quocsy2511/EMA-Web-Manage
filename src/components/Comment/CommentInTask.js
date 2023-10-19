import { Avatar, Form, Input, Upload, message } from "antd";
import React, { useState } from "react";
import { IoMdAttach, IoIosSend } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import EmptyComment from "../Error/EmptyComment";
import moment from "moment";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../../apis/files";
import { postComment, removeComment } from "../../apis/comments";

const CommentInTask = ({ comments, taskId, isSubtask }) => {
  const managerId = useRouteLoaderData("manager").id;
  console.log("comments: ", comments);

  const [fileList, setFileList] = useState();
  const [onClickEvent, setOnClickEvent] = useState(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation((comment) => postComment(comment), {
    onSuccess: () => {
      queryClient.invalidateQueries(["comment", taskId]);
      form.resetFields();
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Ko thể bình luận lúc này! Hãy thử lại sau",
      });
    },
  });

  const { mutate: uploadFileMutate } = useMutation(
    ({ formData, comment }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        const comment = variables.comment;
        variables.comment = { fileUrl: [data], ...comment };
        mutate(variables.comment);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: deletecommentMutate } = useMutation(
    (commentId) => removeComment(commentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comment", taskId]);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể xóa bình luận! Hãy thử lại sau",
        });
      },
    }
  );

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onEnterComment = () => {
    // form.submit();
  };

  const handleOnClick = () => {
    // form.submit();
  };

  const handleDelete = (id) => {
    deletecommentMutate(id);
  };

  const onFinish = (value) => {
    console.log("Success: ", value);
    value = { ...value, taskID: taskId };

    if (!value.fileUrl || value.fileUrl?.length === 0) {
      console.log("NOOO FILE");
      const { fileUrl, ...restValue } = value;

      mutate(restValue);
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "comment");
      const { fileUrl, ...restValue } = value;

      uploadFileMutate({ formData, comment: restValue });
    }
  };

  return (
    <>
      {contextHolder}
      <div>
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <div className={`flex items-center gap-x-3 ${!isSubtask && "mr-12"}`}>
            <Avatar
              size={40}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
            />
            <Form.Item
              className="w-[95%] mb-0"
              name="content"
              rules={[
                {
                  required: true,
                  message: `Chưa nhập bình luận!`,
                },
              ]}
            >
              <Input
                placeholder="Nhập bình luận"
                onPressEnter={onEnterComment}
                size="large"
                allowClear
              />
            </Form.Item>

            <BsSendFill
              className="cursor-pointer"
              size={20}
              onClick={handleOnClick}
            />
          </div>
          <div className="flex items-center gap-x-3 mt-3 ml-14">
            <Form.Item
              className="mb-0"
              name="fileUrl"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  validator(_, fileList) {
                    return new Promise((resolve, reject) => {
                      if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                        reject("File quá lớn ( dung lượng < 10MB )");
                      } else {
                        resolve();
                      }
                    });
                  },
                },
              ]}
            >
              <Upload
                className="flex items-center gap-x-3 "
                maxCount={1}
                listType="picture"
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                showUploadList={{
                  showPreviewIcon: false,
                }}
                beforeUpload={(file) => {
                  return new Promise((resolve, reject) => {
                    if (file && file?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( <10MB )");
                      return false;
                    } else {
                      setFileList(file);
                      resolve();
                      return true;
                    }
                  });
                }}
              >
                <div className="flex items-center">
                  <IoMdAttach className="cursor-pointer" size={20} />
                  <p className="text-sm font-medium">Tài liệu đính kèm</p>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </div>

      <AnimatePresence mode="wait">
        {comments.length === 0 ? (
          <motion.div
            key="empty-comment"
            exit={{ y: -50, opacity: 0 }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-10"
          >
            <EmptyComment />
          </motion.div>
        ) : (
          <motion.div
            key="has-comment"
            exit={{ y: -50, opacity: 0 }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="ml-12 mt-8"
          >
            <AnimatePresence>
              {comments.map((comment) => {
                let time;
                const currentDate = moment();
                console.log("currentDate: ", currentDate);
                const targetDate = moment(comment.createdAt);
                console.log("targetDate: ", targetDate);
                const duration = moment.duration(currentDate.diff(targetDate));

                if (duration.asDays() < 1) {
                  // Less than 1 day
                  time = `${Math.floor(duration.asHours())} giờ trước`;
                } else if (duration.asDays() < 7) {
                  // Less than 1 week
                  time = `${Math.floor(duration.asDays())} ngày trước`;
                } else if (duration.asMonths() < 1) {
                  // Less than 1 month
                  time = `${Math.floor(duration.asDays() / 7)} tuần trước`;
                } else {
                  // More than 1 month
                  time = `${Math.floor(duration.asMonths())} tháng trước`;
                }

                return (
                  <motion.div
                    layout
                    key={comment.id}
                    exit={{ x: -30, opacity: 0 }}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-3 mb-7"
                  >
                    <div className="flex gap-x-3">
                      <Avatar size={25} src={comment.user.profile.avatar} />
                      <p className="text-base">
                        <span className="font-bold">
                          {comment.user.profile.fullName}
                        </span>{" "}
                        đã bình luận vào{" "}
                        <span className="font-bold">{time}</span>
                      </p>
                    </div>

                    <p className="text-sm ml-10">{comment.text}</p>

                    {comment.commentFiles.length > 0 &&
                      comment.commentFiles.map((file) => (
                        <div className="ml-10 px-2 py-1 cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block">
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            Tệp đính kèm
                          </a>
                        </div>
                      ))}

                    <div className="flex gap-x-3 text-sm font-bold ml-3">
                      {/* <motion.p whileHover={{ y: -2 }} className="cursor-pointer">
                    Chỉnh sửa
                  </motion.p> */}

                      {comment.user.id === managerId && (
                        <motion.p
                          className="cursor-pointer"
                          whileHover={{ y: -2 }}
                          onClick={() => handleDelete(comment.id)}
                        >
                          Xóa
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommentInTask;
