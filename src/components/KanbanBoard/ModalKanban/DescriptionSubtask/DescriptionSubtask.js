import {
  AlignLeftOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DescriptionSubtask = ({ description, setDescription }) => {
  const [descriptionQuill, setDescriptionQuill] = useState("");
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
              // value={descriptionQuill}
              onChange={setDescriptionQuill}
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
            {description !== undefined && description !== null && (
              <p
                className="text-base italic text-black "
                dangerouslySetInnerHTML={{
                  __html: new QuillDeltaToHtmlConverter(
                    JSON.parse(description)
                  ).convert(),
                }}
              ></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionSubtask;
