import { ThunderboltOutlined } from "@ant-design/icons";
import React from "react";

const TitleSubtask = ({ title, setTitle }) => {
  return (
    <div className="mt-8 flex flex-row gap-x-2 justify-start items-center">
      <div className="flex justify-center items-center">
        <label
          htmlFor="board-name-input" //lấy id :D
          className="text-sm dark:text-white text-gray-500 cursor-pointer"
        >
          <ThunderboltOutlined style={{ fontSize: 24 }} />
        </label>
      </div>

      <input
        className="bg-transparent px-4 py-2 rounded-md text-3xl font-bold border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full cursor-pointer"
        placeholder="e.g Web Design"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        id="board-name-input"
        type="text"
      />
    </div>
  );
};

export default TitleSubtask;
