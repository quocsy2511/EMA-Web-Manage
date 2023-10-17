import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Slider,
  Space,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouteLoaderData } from "react-router-dom";
import { getAllUser } from "../../../apis/users";
import moment from "moment";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { createTask } from "../../../apis/tasks";

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

const NewTaskModal = ({ addNewTask, setAddNewTask, TaskParent }) => {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { id, eventID, title } = TaskParent;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [estimationTime, setEstimationTime] = useState(1);
  const [priority, setPriority] = useState("LOW");
  const divisionId = useRouteLoaderData("staff").divisionID;
  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
  } = useQuery(
    ["users-division"],
    () => getAllUser({ divisionId, pageSize: 10, currentPage: 1 }),
    {
      select: (data) => {
        const listUsers = data.data.map((item) => {
          item.dob = moment(item.dob).format("YYYY-MM-DD");
          return {
            key: item.id,
            ...item,
          };
        });
        return listUsers;
      },
    }
  );

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((task) => createTask(task), {
    onSuccess: (data, division) => {
      queryClient.invalidateQueries("tasks");
      setAddNewTask(false);
    },
    onError: () => {
      message.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const onCloseModal = () => {
    console.log("Close");
    setAddNewTask(false);
  };

  //chọn member
  const handleChangeSelectMember = (value) => {
    let listMember = [];
    if (value.length > 0) {
      listMember = [...assignee, value];
    }
    setAssignee(listMember);
  };

  const onChangeDate = (value, dateString) => {
    // Chuyển đổi thành định dạng ISO 8601
    const isoStartDate = moment(dateString[0]).toISOString();
    const isoEndDate = moment(dateString[1]).toISOString();
    setStartDate(isoStartDate);
    setEndDate(isoEndDate);
  };

  //hàm để bắt ko chọn ngày đã  qua
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const descriptionDebounced = debounce((value) => {
    setDescription(value);
  }, 500); // Thời gian chờ 500ms

  //Render Estimated Time
  const onChangeEstimatedTime = (newValue) => {
    setEstimationTime(newValue);
  };
  //tooltip estimateEstimationTime
  const formatter = (value) => `${value} giờ`;

  const onFinish = (values) => {
    console.log("Success: ", values);
    const data = {
      ...values,
      eventID: eventID,
      startDate: startDate,
      endDate: endDate,
      parentTask: id,
      leader: assignee[0].toString(),
      fileUrl: "",
    };
    console.log("🚀 ~ file: NewTaskModal.js:125 ~ onFinish ~ data:", data);
    mutate(data);
  };

  return (
    <div>
      <Modal
        title={`Danh sách công việc - ${title}`}
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
            {/* title */}
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
            {/* date */}
            <Form.Item
              label="Date"
              className="text-sm font-medium "
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Please select time!",
                },
              ]}
              hasFeedback
            >
              <RangePicker
                disabledDate={disabledDate}
                showTime={{
                  format: "HH:mm:ss",
                }}
                onChange={onChangeDate}
                formatDate="YYYY/MM/DD HH:mm:ss"
              />
            </Form.Item>
            {/* Estimated */}
            <Form.Item
              initialValue={estimationTime}
              label="Estimated"
              name="estimationTime"
              className="text-sm font-medium "
            >
              <Slider
                tooltip={{ formatter }}
                min={1}
                max={100}
                onChange={onChangeEstimatedTime}
                value={estimationTime}
              />
            </Form.Item>
            {/* member */}
            <Form.Item
              label="Assignee"
              name="assignee"
              className="text-sm font-medium "
              rules={[
                {
                  required: true,
                  message: "Please select member for task!",
                },
              ]}
              hasFeedback
            >
              {!isLoadingUsers ? (
                !isErrorUsers ? (
                  <Select
                    autoFocus
                    allowClear
                    mode="multiple"
                    placeholder="The first Member you choose will be the leader "
                    style={{
                      width: "100%",
                    }}
                    onChange={(value) => handleChangeSelectMember(value)}
                    optionLabelProp="label"
                  >
                    {users?.map((item, index) => {
                      return (
                        <Option
                          value={item.id}
                          label={item.fullName}
                          key={item.id}
                        >
                          <Space>
                            <span role="img" aria-label={item.fullName}>
                              <Avatar src={item.avatar} />
                            </span>
                            {item.fullName}
                          </Space>
                        </Option>
                      );
                    })}
                  </Select>
                ) : (
                  <AnErrorHasOccured />
                )
              ) : (
                <LoadingComponentIndicator />
              )}
            </Form.Item>
            {/* priority */}
            <Form.Item
              label="Priority"
              name="priority"
              className="text-sm font-medium "
              initialValue={priority}
            >
              <Segmented
                // defaultValue="LOW"
                options={["LOW", "MEDIUM", "HIGH"]}
                value={priority}
                onChange={setPriority}
              />
            </Form.Item>
            {/* description */}
            <Form.Item
              initialValue={description}
              label="Description"
              className="text-sm font-medium "
              name="desc"
            >
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(value) => descriptionDebounced(value)}
                className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full "
              />
            </Form.Item>
            {/* file */}
            <Form.Item label="File" className="text-sm font-medium ">
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-9"
                loading={isLoading}
              >
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
