import { CloseOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React from "react";
import ReactQuill from "react-quill";

const Comments = ({ isOpenQuill, comment, setComment, seItsOpenQuill }) => {
  console.log("🚀 ~ file: Comments.js:7 ~ Comments ~ comment:", comment);

  return (
    <div className="flex flex-row mt-8 justify-start gap-x-4 ">
      <Avatar icon={<UserOutlined />} />
      <div className="flex flex-col w-full justify-start gap-y-2">
        <h3 className="text-sm font-medium text-dark">Nguyễn Quốc Sỹ</h3>
        {isOpenQuill ? (
          <div>
            <ReactQuill
              theme="snow"
              value={comment}
              onChange={setComment}
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
            <div className="rounded-md text-sm text-black font-normal bg-bgSubtask cursor-pointer w-full bg-transparent px-4 py-2 ">
              <p className="">{comment}</p>
            </div>
            <div className="flex flex-row gap-x-2 text-text4 cursor-pointer ">
              <p
                onClick={() => seItsOpenQuill(true)}
                className="hover:text-secondary underline underline-offset-2"
              >
                Edit
              </p>
              <p className="hover:text-secondary underline underline-offset-2">
                Delete
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
