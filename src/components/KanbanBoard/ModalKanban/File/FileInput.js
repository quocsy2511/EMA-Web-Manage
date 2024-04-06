import { CheckOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Upload, message } from "antd";
import React, { useState } from "react";
import { uploadFile, uploadFileTask } from "../../../../apis/files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteLoaderData } from "react-router-dom";

const FileInput = ({ taskSelected, setUpdateFileList }) => {
  const taskID = taskSelected?.id;
  const [fileList, setFileList] = useState();
  const [disableSendButton, setDisableSendButton] = useState(true);
  const [form] = Form.useForm();
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
  const queryClient = useQueryClient();
  const { mutate: uploadNewFileTask, isLoading: isLoadingPostFile } =
    useMutation((file) => uploadFileTask(file), {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        queryClient.invalidateQueries(["parentTaskDetail"], taskID);
        form.resetFields("");
        setDisableSendButton(true);
        message.open({
          type: "success",
          content: "Cập nhật tài liệu  thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "không thể Cập nhật file  lúc này! Hãy thử lại sau",
        });
      },
    });

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, task }) => uploadFile(formData), {
      onSuccess: (data) => {
        setUpdateFileList((prev) => [
          ...prev,
          {
            fileName: data?.fileName ? data?.fileName : "tài liệ công việc",
            fileUrl: data?.downloadUrl,
            taskID: taskID,
          },
        ]);
        const fileObj = {
          fileName: data?.fileName ? data?.fileName : "tài liệ công việc",
          fileUrl: data?.downloadUrl,
          taskID,
        };

        uploadNewFileTask(fileObj);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "task");
    uploadFileMutate({ formData });
  };

  return (
    <div>
      <Form className="mb-0" onFinish={onFinish} form={form}>
        <Form.Item
          className="text-sm font-medium mb-0 px-3"
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
            onRemove={(file) => {
              setDisableSendButton(true);
            }}
            className="upload-list-inline "
            maxCount={1}
            listType="text"
            action=""
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            showUploadList={{
              showPreviewIcon: false,
            }}
            beforeUpload={(file) => {
              setDisableSendButton(false);
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
            <Button icon={<UploadOutlined />} size="small">
              Tải tài liệu
            </Button>
          </Upload>
        </Form.Item>
        {!disableSendButton && (
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            loading={isLoadingUploadFile || isLoadingPostFile}
            className="flex justify-center items-center"
          >
            <CheckOutlined />
            Gửi tài liệu
          </Button>
        )}
      </Form>
    </div>
  );
};

export default FileInput;
