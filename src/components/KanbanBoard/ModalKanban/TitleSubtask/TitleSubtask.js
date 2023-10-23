import { ThunderboltOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const TitleSubtask = ({ title, setTitle, disableUpdate }) => {
  // console.log("🚀 ~ file: TitleSubtask.js:6 ~ TitleSubtask ~ disableTask:", disableTask)
  return (
    <div className="mt-8 flex flex-row gap-x-2 justify-start items-center">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-name-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          <ThunderboltOutlined style={{ fontSize: 24, color: "black" }} />
        </label>
      </div>

      <TextArea
        autoSize={{
          minRows: 1,
          maxRows: 6,
        }}
        className="bg-transparent px-4 py-2 rounded-md text-3xl font-bold border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer h-fit"
        placeholder="e.g Web Design"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        id="board-name-input"
        type="text"
        disabled={disableUpdate}
      />
    </div>
  );
};

export default TitleSubtask;
