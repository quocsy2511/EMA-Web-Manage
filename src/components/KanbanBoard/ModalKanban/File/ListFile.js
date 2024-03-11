import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";
import React from "react";
import { IoMdAttach } from "react-icons/io";
import { deleteFileTask } from "../../../../apis/files";
import { useRouteLoaderData } from "react-router-dom";

const ListFile = ({
  file,
  updateFileList,
  setUpdateFileList,
  taskParent = false,
  taskSelected,
}) => {
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
  const FileID = file.id;
  const taskID = file.taskID;
  const [modal, contextHolder] = Modal.useModal();
  const queryClient = useQueryClient();
  const { mutate: deleteFileTaskMutate } = useMutation(
    ({ taskId: taskID, data }) => deleteFileTask({ taskId: taskID, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        message.open({
          type: "success",
          content: "Cập nhật file  thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "không thể Cập nhật file  lúc này! Hãy thử lại sau",
        });
      },
    }
  );

  const showDeleteConfirm = (FileID) => {
    const filterFile = updateFileList.filter((file) => file.id !== FileID);
    const data = filterFile.map((file) => {
      return {
        fileName: file.fileName,
        fileUrl: file.fileUrl,
      };
    });
    const newListFile = filterFile.map((file) => {
      return {
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        taskID: file.taskID,
        id: file.id,
      };
    });
    modal.confirm({
      title: "Bạn có chắc chắn xóa tài liệu này không?",
      icon: <ExclamationCircleFilled />,
      content: "Xóa một tài liệu là vĩnh viễn. Không có cách hoàn tác",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        setUpdateFileList(newListFile);
        deleteFileTaskMutate({ taskId: taskID, data });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className="flex flex-row justify-between gap-x-2 mt-4">
      {contextHolder}
      <a
        href={file.fileUrl}
        className="text-ellipsis max-w-full overflow-hidden flex mt-1 text-green-500"
      >
        <IoMdAttach className="cursor-pointer" size={20} />
        {file.fileName}
      </a>
      {!taskParent && (
        <DeleteOutlined
          // onClick={handleDeleteFile}
          onClick={() => showDeleteConfirm(FileID)}
          className="hover:text-red-400"
        />
      )}
    </div>
  );
};

export default ListFile;
