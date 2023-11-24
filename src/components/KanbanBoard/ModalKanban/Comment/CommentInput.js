import { SendOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Form, Upload, message } from "antd";
import Input from "antd/es/input/Input";
import React, { useState } from "react";
import { IoMdAttach } from "react-icons/io";
import { uploadFile } from "../../../../apis/files";
import { postComment } from "../../../../apis/comments";

const CommentInput = ({ staff, taskSelected }) => {
  const taskId = taskSelected.id;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState();

  // bắt chưa nhập input ko cho nhấn submit
  const SubmitButton = ({ form }) => {
    const [submittable, setSubmittable] = React.useState(false);
    // Watch all values
    const values = Form.useWatch([], form);
    React.useEffect(() => {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);
    return (
      <Button
        type="primary"
        className="flex items-center justify-center"
        htmlType="submit"
        disabled={!submittable}
      >
        <SendOutlined />
      </Button>
    );
  };

  const queryClient = useQueryClient();
  const { mutate } = useMutation((comment) => postComment(comment), {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", taskId]);
      queryClient.invalidateQueries(["parentTaskDetail"], taskId);
      form.resetFields();
      message.open({
        type: "success",
        content: "Tạo một bình luận mới thành công",
      });
    },
    onError: () => {
      message.open({
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
          file: [{ fileName: data.fileName, fileUrl: data.downloadUrl }],
          ...comment,
        };
        console.log(
          "🚀 ~ file: CommentInput.js:73 ~ CommentInput ~ variables.comment:",
          variables.comment
        );
        mutate(variables.comment);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Không thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const onFinish = (values) => {
    values = { ...values, taskID: taskId };
    if (!values.fileUrl || values.fileUrl?.length === 0) {
      console.log("NOOO FILE");
      const { fileUrl, ...restValue } = values;
      mutate(restValue);
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "comment");
      const { fileUrl, ...restValue } = values;

      uploadFileMutate({ formData, comment: restValue });
    }
  };

  return (
    <>
      <div className="flex flex-row mt-4 justify-start gap-x-4 ">
        <Avatar src={staff.avatar} />
        <div className=" flex flex-col w-full gap-y-2">
          <h3 className="text-sm font-medium text-dark">{staff.fullName}</h3>
          <div className="flex flex-row w-full justify-start">
            <Form form={form} className="min-w-full" onFinish={onFinish}>
              {/* input Comment */}
              <div className="flex flex-row gap-x-2">
                <Form.Item
                  name="content"
                  className="mb-2 flex-1"
                  rules={[
                    {
                      validateTrigger: true,
                      required: true,
                      message: "chưa nhập bình luận ",
                    },
                    {
                      validateTrigger: true,
                      whitespace: true,
                      message: "nhập tối thiểu 1 kí tự",
                    },
                    {
                      validateTrigger: true,
                      min: 1,
                      message: "nhập tối thiểu 1 kí tự bình luận ",
                    },
                  ]}
                >
                  <Input
                    id="warning"
                    placeholder="Viết bình luận ..."
                    className="placeholder:italic"
                    allowClear
                  />
                </Form.Item>
                <SubmitButton form={form} />
              </div>
              {/* uploadFile */}
              <div className="flex items-center gap-x-3">
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
                      <p className="text-sm font-medium">Tài liệu đính kèm</p>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentInput;
