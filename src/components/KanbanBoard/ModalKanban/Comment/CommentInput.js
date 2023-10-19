import {
  SendOutlined,
  SnippetsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Form } from "antd";
import Input from "antd/es/input/Input";
import React, { useState } from "react";

const CommentInput = () => {
  return (
    <>
      <div className="mt-8 flex flex-row gap-x-6 justify-start items-start">
        <div className="flex justify-center items-center">
          <label
            htmlFor="board-description-input" //lấy id :D
            className="text-sm dark:text-white text-gray-500 cursor-pointer"
          >
            <SnippetsOutlined style={{ fontSize: 24, color: "black" }} />
          </label>
        </div>
        <div className="w-full flex flex-col">
          <h3 className="text-lg font-bold">Hoạt động</h3>
        </div>
      </div>
      <div className="flex flex-row mt-4 justify-start gap-x-4 ">
        <Avatar icon={<UserOutlined />} />
        <div className="flex flex-row w-full justify-start">
          <Form className="w-full">
            <Form.Item name="content" className="mb-2">
              <Input
                placeholder="Viết bình luận ..."
                className="placeholder:italic"
              />
            </Form.Item>
            <Button type="primary" className="flex items-center justify-center">
              <SendOutlined />
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CommentInput;
