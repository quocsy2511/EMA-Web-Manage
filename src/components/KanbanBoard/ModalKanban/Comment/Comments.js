import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Form, Input, Modal, message, Upload } from "antd";
import React, { useState } from "react";
import { IoMdAttach } from "react-icons/io";
import { removeComment, updateComment } from "../../../../apis/comments";
import { uploadFile } from "../../../../apis/files";
import { debounce } from "lodash";
import { useRouteLoaderData } from "react-router-dom";

const Comments = ({ comment, taskSelected, disableUpdate }) => {
  const { user, createdAt, id } = comment;
  const staffID = useRouteLoaderData("staff").id;
  const [input, setInput] = useState(comment?.text);
  const [isOpenInput, seItsOpenInput] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [fileList, setFileList] = useState();
  const [commentFiles, setCommentFiles] = useState(comment?.commentFiles);
  const commentDebounced = debounce((value) => {
    setInput(value);
  }, 300); // Thời gian chờ 300ms

  const queryClient = useQueryClient();
  const { mutate: deleteCommentMutate } = useMutation(
    (commentId) => removeComment(commentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", taskSelected.id]);
        queryClient.invalidateQueries(["parentTaskDetail"], taskSelected.id);
        message.open({
          type: "success",
          content: "Bình luận đã được xoá",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Không thể xóa bình luận! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: updateCommentMutate, isLoading: isLoadingUpdateComment } =
    useMutation((comment) => updateComment(comment), {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["comments", taskSelected.id]);
        queryClient.invalidateQueries(["parentTaskDetail"], taskSelected.id);
        seItsOpenInput(false);
        message.open({
          type: "success",
          content: "Cập nhật bình luận  thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể cập nhật bình luận lúc này! Hãy thử lại sau",
        });
      },
    });

  const { mutate: uploadFileMutate, isLoading: isLoadingUpdateFile } =
    useMutation(({ formData, comment }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        const comment = variables.comment;
        variables.comment = {
          file: [{ fileName: data.fileName, fileUrl: data.downloadUrl }],
          ...comment,
        };
        updateCommentMutate(variables.comment);
        setCommentFiles(variables.comment.file);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Không thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const onFinish = (values) => {
    if (!values.fileUrl || values.fileUrl?.length === 0) {
      const oldFile = commentFiles?.map((item) => {
        return {
          fileName: item.fileName,
          fileUrl: item.fileUrl,
        };
      });
      const data = {
        commentId: comment?.id,
        content: values.content,
        file: oldFile,
      };
      updateCommentMutate(data);
    } else {
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "comment");
      const data = {
        commentId: comment?.id,
        content: values.content,
      };
      uploadFileMutate({ formData, comment: data });
    }
  };

  const showDeleteConfirm = ({ type, text }) => {
    modal.confirm({
      title: `Bạn có chắc chắn xóa ${text} này không?`,
      icon: <ExclamationCircleFilled />,
      content: `Xóa một ${text} là vĩnh viễn. Không có cách hoàn tác`,
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        if (type === "comment") {
          deleteCommentMutate(id);
        } else {
          const data = {
            commentId: comment?.id,
            content: comment?.text,
            file: [],
          };
          updateCommentMutate(data);
          setCommentFiles([]);
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className="flex flex-row mt-8 justify-start gap-x-4 " key={comment.id}>
      {contextHolder}
      {user?.profile === null ? (
        <Avatar icon={<UserOutlined />} className="bg-gray-500" />
      ) : (
        <Avatar src={user?.profile?.avatar} />
      )}
      <div className="flex flex-col w-full justify-start gap-y-2">
        <h3 className="text-sm font-semibold text-black">
          {user?.profile?.fullName}{" "}
          <span className="font-normal text-xs text-gray-500">
            vào lúc {createdAt}
          </span>
        </h3>
        {disableUpdate ? (
          <div className="w-full">
            <div className="rounded-md text-sm text-black font-normal bg-slate-50 cursor-pointer w-full  px-4 py-2 ">
              <p className="">{comment.text}</p>
            </div>
            {comment.commentFiles.length > 0 &&
              comment.commentFiles.map((file, index) => (
                <div
                  key={index}
                  className="mt-2 px-2 py-[2px] cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block"
                >
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 flex flex-row "
                  >
                    <IoMdAttach className="cursor-pointer" size={20} />
                    {file.fileName}
                  </a>
                </div>
              ))}
          </div>
        ) : (
          <>
            {isOpenInput ? (
              <Form className=" w-full" onFinish={onFinish}>
                <div className="flex flex-row gap-x-2 w-full justify-start items-start">
                  <Form.Item
                    className="mb-0 flex-1 "
                    name="content"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập bình luận ",
                      },
                      {
                        whitespace: true,
                        message: "Nhập tối thiểu 1 kí tự",
                      },
                    ]}
                    initialValue={input}
                  >
                    <Input onChange={(e) => commentDebounced(e.target.value)} />
                  </Form.Item>
                  <div className="flex flex-row flex-x-2">
                    <Button
                      type="link"
                      className="flex items-center justify-center text-red-500"
                    >
                      <CloseOutlined onClick={() => seItsOpenInput(false)} />
                    </Button>
                    <Button
                      type="primary"
                      className="flex items-center justify-center"
                      htmlType="submit"
                      loading={isLoadingUpdateComment && isLoadingUpdateFile}
                    >
                      <SendOutlined />
                    </Button>
                  </div>
                </div>
                <div className="justify-start items-center gap-x-4">
                  {commentFiles.length > 0 &&
                    commentFiles?.map((file, index) => (
                      <div
                        className="flex flex-row gap-x-4 items-center my-2"
                        key={index}
                      >
                        <div className="flex flex-row">
                          <IoMdAttach className="cursor-pointer" size={20} />
                          <p className="font-semibold">Tài liệu cũ :</p>
                        </div>
                        <div className="flex flex-row gap-x-2 items-center">
                          <div className="px-2 py-[2px] cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block">
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 flex flex-row "
                            >
                              <IoMdAttach
                                className="cursor-pointer"
                                size={20}
                              />
                              {file.fileName}
                            </a>
                          </div>
                          <DeleteOutlined
                            className="hover:text-red-400 cursor-pointer"
                            // onClick={() => handleDeleteFileComment()}
                            onClick={() =>
                              showDeleteConfirm({
                                type: "file",
                                text: "Tệp đính kèm",
                              })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  <Form.Item
                    className="mb-0"
                    name="fileUrl"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e?.fileList}
                    rules={[
                      {
                        validator(_, fileList) {
                          return new Promise((resolve, reject) => {
                            if (
                              fileList &&
                              fileList[0]?.size > 10 * 1024 * 1024
                            ) {
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
                      <div className="flex items-center hover:text-green-500">
                        <IoMdAttach className="cursor-pointer" size={20} />
                        <p className="text-sm font-medium">
                          Tài liệu đính kèm mới
                        </p>
                      </div>
                    </Upload>
                  </Form.Item>
                </div>
              </Form>
            ) : (
              <div className="w-full">
                <div className="rounded-md text-sm text-black font-normal bg-slate-50 cursor-pointer w-full  px-4 py-2 ">
                  <p className="">{comment.text}</p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  {commentFiles?.length > 0 &&
                    commentFiles?.map((file, index) => (
                      <div
                        key={index}
                        className="mt-2 px-2 py-[2px] cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block"
                      >
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 flex flex-row "
                        >
                          <IoMdAttach className="cursor-pointer" size={20} />
                          {file.fileName}
                        </a>
                      </div>
                    ))}
                  {user.id === staffID && (
                    <div className="flex flex-row gap-x-2 text-text4 cursor-pointer items-center pt-2">
                      <Button
                        type="link"
                        onClick={() => seItsOpenInput(true)}
                        className="flex justify-center items-center"
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() =>
                          showDeleteConfirm({
                            type: "comment",
                            text: "bình luận",
                          })
                        }
                        type="link"
                        className="text-red-400 flex justify-center items-center"
                      >
                        Xoá
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
