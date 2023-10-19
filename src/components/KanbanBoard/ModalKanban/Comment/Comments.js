import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import React, { useState } from "react";
import { IoMdAttach } from "react-icons/io";

const Comments = ({ comment, taskSelected }) => {
  console.log(
    "🚀 ~ file: Comments.js:12 ~ Comments ~ taskSelected:",
    taskSelected
  );
  const { user, file, createdAt } = comment;
  const [input, setInput] = useState(comment.text);
  const [isOpenQuill, seItsOpenQuill] = useState(false);

  return (
    <div className="flex flex-row mt-8 justify-start gap-x-4 " key={comment.id}>
      <Avatar src={user.profile.avatar} />
      <div className="flex flex-col w-full justify-start gap-y-2">
        <h3 className="text-sm font-semibold text-black">
          {user.profile.fullName}{" "}
          <span className="font-normal text-xs text-gray-500">
            at {createdAt}
          </span>
        </h3>
        {isOpenQuill ? (
          <div>
            <Input
              className=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {comment.commentFiles.length > 0 &&
              comment.commentFiles.map((file) => (
                <div className="mt-2 px-2 py-[2px] cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block">
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
              comment.commentFiles.map((file) => (
                <div className="mt-2 px-2 py-[2px] cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block">
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
                  comment.commentFiles.map((file) => (
                    <div className="mt-2 px-2 py-[2px] cursor-pointer border border-blue-500 hover:border-blue-300 rounded-lg inline-block">
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
              <p
                onClick={() => seItsOpenQuill(true)}
                className="hover:text-secondary underline underline-offset-2"
              >
                chỉnh sửa
              </p>
              <p className="hover:text-secondary underline underline-offset-2">
                Xoá
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
