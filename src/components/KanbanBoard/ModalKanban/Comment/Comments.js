import { CloseOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";

const Comments = ({ comment, setComment }) => {
  const [input, setInput] = useState(comment.title);
  const [isOpenQuill, seItsOpenQuill] = useState(false);

  return (
    <div className="flex flex-row mt-8 justify-start gap-x-4 " key={comment.id}>
      <Avatar src={comment.avatar} />
      <div className="flex flex-col w-full justify-start gap-y-2">
        <h3 className="text-sm font-medium text-dark">{comment.createBy}</h3>
        {isOpenQuill ? (
          <div>
            <ReactQuill
              theme="snow"
              value={input}
              onChange={setInput}
              className="bg-transparent pb-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-[500px]"
            />
            <div className="flex flex-row flex-x-2">
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
            <div className="rounded-md text-sm text-black font-normal bg-slate-50 cursor-pointer w-full  px-4 py-2 ">
              <p className="">{comment.title}</p>
            </div>
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
