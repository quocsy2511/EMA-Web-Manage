import {
  AlignLeftOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Form } from "antd";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DescriptionSubtask = ({
  description,
  setDescription,
  disableUpdate,
  taskParent,
}) => {
  const [descriptionQuill, setDescriptionQuill] = useState({
    ops: JSON.parse(description),
  });
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
        {taskParent ? (
          <>
            <div className="rounded-md text-sm text-black font-normal bg-slate-100 cursor-pointer w-full bg-transparent px-4 py-2">
              {description !== undefined && description !== null ? (
                <p
                  className="text-base italic text-black "
                  dangerouslySetInnerHTML={{
                    __html: new QuillDeltaToHtmlConverter(
                      JSON.parse(description)
                    ).convert(),
                  }}
                ></p>
              ) : (
                <p className="text-base italic text-black bg-slate-100 p-4 rounded-md opacity-40">
                  Add more detail description ....
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {isOpenQuill && !disableUpdate ? (
              <>
                <Form>
                  <Form.Item
                    name="desc"
                    initialValue={descriptionQuill}
                    className="mb-0"
                  >
                    <ReactQuill
                      theme="snow"
                      onChange={setDescriptionQuill}
                      className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full"
                    />
                  </Form.Item>

                  <div className="flex flex-row">
                    <Button
                      type="primary"
                      className="flex items-center justify-center"
                    >
                      <SendOutlined />
                    </Button>
                    <Button
                      htmlType="submit"
                      type="link"
                      className="flex items-center justify-center"
                    >
                      <CloseOutlined
                        onClick={() => seItsOpenQuill(false)}
                        className="text-red-400"
                      />
                    </Button>
                  </div>
                </Form>
              </>
            ) : (
              <div
                className="rounded-md text-sm text-black font-normal bg-slate-100 cursor-pointer w-full bg-transparent px-4 py-2"
                onClick={() => seItsOpenQuill(true)}
              >
                {description !== undefined && description !== null ? (
                  <p
                    className="text-base italic text-black "
                    dangerouslySetInnerHTML={{
                      __html: new QuillDeltaToHtmlConverter(
                        JSON.parse(description)
                      ).convert(),
                    }}
                  ></p>
                ) : (
                  <p className="text-base italic text-black bg-slate-100 p-4 rounded-md opacity-40">
                    Add more detail description ....
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DescriptionSubtask;
