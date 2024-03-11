import { Avatar, Button, Form, Input, Upload, message } from "antd";
import React, { useState } from "react";
import { IoMdAttach } from "react-icons/io";
import { GiCancel } from "react-icons/gi";
import { BsSendFill, BsCheckCircle } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import EmptyComment from "../Error/EmptyComment";
import moment from "moment";
import momenttz from "moment-timezone";
import { useRouteLoaderData, useLoaderData } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../../apis/files";
import {
  createCommentFile,
  postComment,
  removeComment,
  updateComment,
} from "../../apis/comments";

const CommentInTask = ({ comments, taskId, isSubtask }) => {
  const manager = useRouteLoaderData("manager");

  const [fileList, setFileList] = useState();

  const [updatedFileList, setUpdatedFileList] = useState();
  const [selectedCommentId, setSelectedCommentId] = useState();
  const [listSelectedCommentFiles, setListSelectedCommentFiles] = useState();

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
        variables.comment = {
          file: [{ fileName: data?.fileName, fileUrl: data?.downloadUrl }],
          ...comment,
        };
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

  const { mutate: updateCommentMutate, isLoading: updateCommentIsLoading } =
    useMutation((updatedComment) => updateComment(updatedComment), {
      onSuccess: () => {
        setSelectedCommentId();
        setUpdatedFileList();
        setListSelectedCommentFiles();
        queryClient.invalidateQueries(["comment", taskId]);
        messageApi.open({
          type: "success",
          content: "Đã cập nhật bình luận.",
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể xóa bình luận! Hãy thử lại sau",
        });
      },
    });

  const {
    mutate: createCommentFileMutate,
    isLoading: createCommentFileIsLoading,
  } = useMutation(
    ({ commentId, files, newComment }) => createCommentFile(commentId, files),
    {
      onSuccess: (data, variables) => {
        updateCommentMutate({
          commentId: variables.commentId,
          ...variables.newComment,
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const {
    mutate: uploadUpdateFileMutate,
    isLoading: uploadUpdateFileIsLoading,
  } = useMutation(
    ({ formData, commentId, newComment }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        const newFileList = [
          { fileName: data?.fileName, fileUrl: data?.downloadUrl },
          ...variables.newComment.file,
        ];

        variables.newComment.file = newFileList;

        createCommentFileMutate({
          commentId: variables.commentId,
          files: newFileList,
          newComment: variables.newComment,
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOnClick = () => {
    form.submit();
  };

  const handleUpdateClick = () => {
    updateForm.submit();
  };

  const handleDelete = (id) => {
    deletecommentMutate(id);
  };

  const onFinish = (value) => {
    console.log("Success: ", value);
    value = { ...value, taskID: taskId };
    const { fileUrl, ...restValue } = value;

    if (!value.fileUrl || value.fileUrl?.length === 0) {
      console.log("NOOO FILE");

      mutate(restValue);
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "comment");

      uploadFileMutate({ formData, comment: restValue });
    }
  };

  const onUpdateFormFinish = (value) => {
    console.log("Success: ", value);

    const newComment = {
      content: value.content,
      file: listSelectedCommentFiles?.map((item) => {
        const { id, ...restItem } = item;
        return restItem;
      }),
    };
    console.log(newComment);

    if (updatedFileList) {
      console.log("Update có file");
      const formData = new FormData();
      formData.append("file", updatedFileList);
      formData.append("folderName", "comment");

      uploadUpdateFileMutate({
        formData,
        commentId: value.commentId,
        newComment,
      });
    } else {
      console.log("Update ko file");
      updateCommentMutate({
        commentId: value.commentId,
        ...newComment,
      });
    }
  };

  const modifyFileList = (file) => {
    if (listSelectedCommentFiles?.some((item) => item?.id === file?.id)) {
      setListSelectedCommentFiles((prev) =>
        prev.filter((item) => item?.id !== file?.id)
      );
    } else {
      setListSelectedCommentFiles((prev) => [...prev, file]);
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
            <Avatar size={40} src={manager?.avatar} />

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
              <Input placeholder="Nhập bình luận" size="large" allowClear />
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
        {comments?.length === 0 ? (
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
            className="ml-12 mt-8 pb-10"
          >
            <AnimatePresence>
              {comments?.map((comment) => {
                let time;
                const currentDate = momenttz();
                const targetDate = momenttz(
                  comment?.createdAt,
                  "YYYY-MM-DD HH:mm:ss"
                );

                if (currentDate.diff(targetDate, "minutes") < 5) {
                  time = `bây giờ`;
                } else if (currentDate.diff(targetDate, "hours") < 1) {
                  time = `${currentDate.diff(
                    targetDate,
                    "minutes"
                  )} phút trước`;
                } else if (currentDate.diff(targetDate, "days") < 1) {
                  time = `${currentDate.diff(targetDate, "hours")} giờ trước`;
                } else if (currentDate.diff(targetDate, "weeks") < 1) {
                  time = `${currentDate.diff(targetDate, "days")} ngày trước`;
                } else if (currentDate.diff(targetDate, "months") < 1) {
                  time = `${currentDate.diff(targetDate, "weeks")} tuần trước`;
                } else if (currentDate.diff(targetDate, "years") < 1) {
                  time = `${currentDate.diff(
                    targetDate,
                    "months"
                  )} tháng trước`;
                } else if (currentDate.diff(targetDate, "years") >= 1) {
                  time = `${currentDate.diff(targetDate, "years")} năm trước`;
                }

                return (
                  <motion.div
                    layout
                    key={comment?.id}
                    exit={{ x: -30, opacity: 0 }}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-3 mb-7"
                  >
                    <div className="flex gap-x-3">
                      <Avatar size={25} src={comment?.user?.profile?.avatar} />
                      <p className="text-base">
                        <span className="font-bold">
                          {comment?.user?.profile?.fullName}
                        </span>{" "}
                        đã bình luận vào{" "}
                        <span className="font-bold">{time}</span>
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      {comment?.id === selectedCommentId ? (
                        <motion.div
                          key="update-comment"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                        >
                          <Form
                            form={updateForm}
                            onFinish={onUpdateFormFinish}
                            autoComplete="off"
                            requiredMark={false}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                              }
                            }}
                            initialValues={{
                              content: comment?.text,
                              oldFileList: comment?.commentFiles,
                              commentId: comment?.id,
                            }}
                          >
                            <div className="flex items-center gap-x-5">
                              <Form.Item
                                className="w-[50%] mb-0 ml-8"
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
                                  size="large"
                                  allowClear
                                />
                              </Form.Item>

                              <Button
                                size="large"
                                type="primary"
                                onClick={handleUpdateClick}
                                loading={
                                  updatedFileList
                                    ? uploadUpdateFileIsLoading ||
                                      createCommentFileIsLoading ||
                                      updateCommentIsLoading
                                    : updateCommentIsLoading
                                }
                              >
                                Chỉnh sửa
                              </Button>
                            </div>

                            <Form.Item
                              name="oldFileList"
                              className="hidden"
                            ></Form.Item>
                            <Form.Item
                              name="commentId"
                              className="hidden"
                            ></Form.Item>

                            <div className="ml-8 mt-3 flex flex-wrap gap-x-3">
                              {comment?.commentFiles?.length > 0 &&
                                comment?.commentFiles?.map((file) => (
                                  <div
                                    key={file?.id}
                                    className={`flex items-center gap-x-3 px-2 py-1 cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg ${
                                      !listSelectedCommentFiles?.some(
                                        (item) => item?.id === file?.id
                                      ) && "opacity-50"
                                    }`}
                                    onClick={() => modifyFileList(file)}
                                  >
                                    <a
                                      href={file?.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {file?.fileName}
                                    </a>
                                    {listSelectedCommentFiles?.some(
                                      (item) => item?.id === file?.id
                                    ) ? (
                                      <GiCancel className="text-blue-400" />
                                    ) : (
                                      <BsCheckCircle className="text-blue-400" />
                                    )}
                                  </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-x-3 mt-3 ml-8">
                              <Form.Item
                                className="mb-0"
                                name="updateFileUrl"
                                valuePropName="updatedFileList"
                                getValueFromEvent={(e) => e?.updatedFileList}
                                rules={[
                                  {
                                    validator(_, updatedFileList) {
                                      return new Promise((resolve, reject) => {
                                        if (
                                          updatedFileList &&
                                          updatedFileList?.[0]?.size >
                                            10 * 1024 * 1024
                                        ) {
                                          reject(
                                            "File quá lớn ( dung lượng < 10MB )"
                                          );
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
                                    showRemoveIcon: false,
                                  }}
                                  beforeUpload={(file) => {
                                    return new Promise((resolve, reject) => {
                                      if (
                                        file &&
                                        file?.size > 10 * 1024 * 1024
                                      ) {
                                        reject("File quá lớn ( <10MB )");
                                        return false;
                                      } else {
                                        setUpdatedFileList(file);
                                        resolve();
                                        return true;
                                      }
                                    });
                                  }}
                                >
                                  <div className="flex items-center">
                                    <IoMdAttach
                                      className="cursor-pointer"
                                      size={20}
                                    />
                                    <p className="text-sm font-medium">
                                      Thêm tài liệu đính kèm
                                    </p>
                                  </div>
                                </Upload>
                              </Form.Item>
                            </div>
                          </Form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="comment-item"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                        >
                          <p className="text-sm ml-10 mb-2">{comment?.text}</p>

                          <div className="ml-10 flex flex-wrap gap-x-3">
                            {comment?.commentFiles?.length > 0 &&
                              comment?.commentFiles?.map((file) => (
                                <div
                                  key={file?.id}
                                  className="px-2 py-1 cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block"
                                >
                                  <a
                                    href={file?.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                  >
                                    {file?.fileName}
                                  </a>
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      {comment?.user?.id === manager?.id && (
                        <div className="flex font-medium gap-x-3 text-base">
                          <motion.p
                            className="cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDelete(comment?.id)}
                          >
                            Xóa
                          </motion.p>

                          <AnimatePresence mode="wait">
                            {comment?.id === selectedCommentId ? (
                              <motion.p
                                key="cancel-update-comment"
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="cursor-pointer text-red-500"
                                onClick={() => {
                                  setSelectedCommentId();
                                  setUpdatedFileList();
                                  setListSelectedCommentFiles();
                                }}
                              >
                                Hủy
                              </motion.p>
                            ) : (
                              <motion.p
                                key="update-comment"
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedCommentId(comment?.id);
                                  setListSelectedCommentFiles(
                                    comment?.commentFiles
                                  );
                                }}
                              >
                                Chỉnh sửa
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
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
