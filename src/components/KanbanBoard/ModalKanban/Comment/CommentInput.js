import {
  SendOutlined,
  SnippetsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React from "react";
import ReactQuill from "react-quill";

const CommentInput = ({ isOpenQuill, comment, setComment, seItsOpenQuill }) => {
  return (
    <>
      <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
        <div className="flex justify-center items-center">
          <label
            htmlFor="board-description-input" //lấy id :D
            className="text-sm dark:text-white text-gray-500 cursor-pointer"
          >
            <SnippetsOutlined style={{ fontSize: 24 }} />
          </label>
        </div>
        <div className="w-full flex flex-col">
          <h3 className="text-lg font-bold">Activity</h3>
        </div>
      </div>
      <div className="flex flex-row mt-4 justify-start gap-x-4 ">
        <Avatar icon={<UserOutlined />} />
        <div className="flex flex-row w-full justify-start">
          {isOpenQuill ? (
            <div>
              <ReactQuill
                placeholder="comment"
                theme="snow"
                value={comment}
                onChange={setComment}
                className="bg-transparent pb-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-[500px]"
              />
              <Button
                type="primary"
                className="flex items-center justify-center"
              >
                <SendOutlined />
              </Button>
            </div>
          ) : (
            <div
              className="rounded-md text-sm text-black font-normal hover:bg-slate-100 cursor-pointer w-full bg-transparent px-4 py-2 bg-bgSubtask"
              onClick={() => seItsOpenQuill(true)}
            >
              <p className="text-gray-400 italic">Write comment ...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentInput;
