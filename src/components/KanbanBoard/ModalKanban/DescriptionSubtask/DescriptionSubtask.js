import {
  AlignLeftOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";

const DescriptionSubtask = ({ description, setDescription }) => {
  const [isOpenQuill, seItsOpenQuill] = useState(false);
  return (
    <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-description-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          <AlignLeftOutlined className="text-black text-2xl" />
        </label>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-bold">Mô tả</h3>
        {isOpenQuill ? (
          <>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-[500px]"
            />
            <div className="flex flex-row">
              <Button
                type="primary"
                className="flex items-center justify-center"
              >
                <SendOutlined />
              </Button>
              <Button type="link" className="flex items-center justify-center">
                <CloseOutlined
                  onClick={() => seItsOpenQuill(false)}
                  className="text-red-400"
                />
              </Button>
            </div>
          </>
        ) : (
          <div
            className="rounded-md text-sm text-black font-normal hover:bg-slate-100 cursor-pointer w-full bg-transparent px-4 py-2"
            onClick={() => seItsOpenQuill(true)}
          >
            <p className="">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionSubtask;
