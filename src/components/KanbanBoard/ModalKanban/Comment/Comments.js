import {
  CloseOutlined,
  ExclamationCircleFilled,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Input, Modal, message } from "antd";
import React, { createContext, useState } from "react";
import { IoMdAttach } from "react-icons/io";
import { removeComment } from "../../../../apis/comments";
const ReachableContext = createContext(null);

const Comments = ({ comment, taskSelected, disableUpdate }) => {
  const { user, file, createdAt, id } = comment;
  const [input, setInput] = useState(comment.text);
  const [isOpenQuill, seItsOpenQuill] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const queryClient = useQueryClient();
  const { mutate: deletecommentMutate } = useMutation(
    (commentId) => removeComment(commentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", taskSelected.id]);
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
  const config = {
    title: "Xoá bình luận  ?",
    content: (
      <>
        <ReachableContext.Consumer>
          {(name) => `Xóa một bình luận là vĩnh viễn. Không có cách hoàn tác !`}
        </ReachableContext.Consumer>
        <br />
      </>
    ),
    footer: (_, { OkBtn, CancelBtn }) => (
      <>
        {/* <Button>Huỷ</Button>
        <Button>Xác nhận</Button> */}
        <CancelBtn>Huỷ</CancelBtn>
        <OkBtn>Xác nhận</OkBtn>
      </>
    ),
  };
  const { confirm } = Modal;
  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc chắn xóa bình luận này không?",
      icon: <ExclamationCircleFilled />,
      content: "Xóa một bình luận là vĩnh viễn. Không có cách hoàn tác",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        deletecommentMutate(id);
      },
      onCancel() {
        console.log("Cancel");
      },
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
            at {createdAt}
          </span>
        </h3>
        {disableUpdate ? (
          <div className="w-full">
            {comment.text === "" ? (
              comment.commentFiles.length > 0 &&
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
                    Tệp đính kèm
                  </a>
                </div>
              ))
            ) : (
              <>
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
                        Tệp đính kèm
                      </a>
                    </div>
                  ))}
              </>
            )}
          </div>
        ) : isOpenQuill ? (
          <div>
            <Input
              className=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
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
                    Tệp đính kèm
                  </a>
                </div>
              ))}
            <div className="flex flex-row flex-x-2 mt-2">
              <Button
                type="primary"
                className="flex items-center justify-center"
              >
                <SendOutlined />
              </Button>
              <Button type="link" className="flex items-center justify-center">
                <CloseOutlined onClick={() => seItsOpenQuill(false)} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {comment.text === "" ? (
              comment.commentFiles.length > 0 &&
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
                    Tệp đính kèm
                  </a>
                </div>
              ))
            ) : (
              <>
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
                        Tệp đính kèm
                      </a>
                    </div>
                  ))}
              </>
            )}
            <div className="flex flex-row gap-x-2 text-text4 cursor-pointer ">
              <Button onClick={showDeleteConfirm} type="link">
                Xoá
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
