import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tooltip,
  Upload,
  message,
} from "antd";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const user = [
  {
    id: 1,
    name: "Nguyen Vu",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 2,
    name: "Nguyen Sy",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 3,
    name: "Nguyen Tung",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 4,
    name: "Nguyen Huy",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 5,
    name: "Nguyen Thiep",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
];

const props = {
  name: "file",
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const NewTaskModal = ({ addNewTask, setAddNewTask }) => {
  const onCloseModal = () => {
    console.log("Click");
    setAddNewTask(false);
  };

  const handleChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div>
      <Modal
        title="New Task"
        open={addNewTask}
        footer={false}
        onCancel={onCloseModal}
        width={600}
        className="text-lg font-bold"
      >
        <div className="mt-4 p-4">
          <Form
            onFinish={onFinish}
            size="large"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            layout="horizontal"
            autoComplete="off"
          >
            <Form.Item
              label="Title"
              name="title"
              className="text-sm font-medium "
              rules={[
                {
                  required: true,
                  message: "Please input your Task Title!",
                },
                { whitespace: true },
                { min: 3, max: 200 },
              ]}
              hasFeedback
            >
              <Input placeholder="task title ..." />
            </Form.Item>
            <Form.Item
              label="Date"
              name="date"
              className="text-sm font-medium "
              rules={[
                {
                  type: "object",
                  required: true,
                  message: "Please select time!",
                },
              ]}
            >
              <DatePicker
                style={{
                  width: "50%",
                }}
                showTime
                // onChange={onChange}
                // onOk={onOk}
                // defaultValue={deadline}
              />
            </Form.Item>
            <Form.Item
              label="Member"
              name="member"
              className="text-sm font-medium "
              rules={[
                {
                  required: true,
                  message: "Please select member for task!",
                },
              ]}
            >
              <Select
                placeholder="Select Member "
                // bordered={false}
                style={{
                  width: "50%",
                }}
                // value={user}
                onChange={(value) => handleChangeSelect(value)}
              >
                {user.map((item, index) => {
                  return (
                    <Select.Option key={item.id} children={item}>
                      <div className="flex flex-row gap-x-2 justify-start items-center ">
                        <Tooltip
                          key={item.id}
                          title={item.name}
                          placement="top"
                        >
                          <Avatar src={item.avatar} size={18} />
                        </Tooltip>
                        <p className="text-ellipsis w-[100px] flex-1 overflow-hidden">
                          {item.name}
                        </p>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="Description" className="text-sm font-medium ">
              <ReactQuill
                theme="snow"
                // value={description}
                // onChange={setDescription}
                className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full "
              />
            </Form.Item>
            <Form.Item label="File" className="text-sm font-medium ">
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" block className="mt-9">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default NewTaskModal;
