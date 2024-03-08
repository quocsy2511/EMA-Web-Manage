import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Select,
  Space,
  Tag,
  Timeline,
  Tooltip,
  Upload,
  message,
} from "antd";
import React, { memo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouteLoaderData } from "react-router-dom";
import { getEmployee } from "../../../apis/users";
import moment from "moment";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import { createTask } from "../../../apis/tasks";
import { uploadFile } from "../../../apis/files";
import { StarFilled, UploadOutlined, UserOutlined } from "@ant-design/icons";
import ScheduleEmloyees from "../Schedule/ScheduleEmloyees";
import DrawerTimeLine from "../Drawer/DrawerTimeLine";

const NewTaskModal = ({
  addNewTask,
  setAddNewTask,
  TaskParent,
  disableEndDate,
  disableStartDate,
}) => {
  // console.log("🚀 ~ TaskParent:", TaskParent);
  const eventID = TaskParent?.eventDivision?.event?.id;
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { id, title } = TaskParent ?? {};
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  // console.log("🚀 ~ assignee:", assignee);
  const [priority, setPriority] = useState({ label: "THẤP", value: "LOW" });

  const [fileList, setFileList] = useState();
  const divisionId = useRouteLoaderData("staff").divisionID;
  const staffId = useRouteLoaderData("staff").id;
  const [form] = Form.useForm();
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [checkedDateData, setCheckedDateData] = useState([]);
  const [selectedDateSchedule, setSelectedDateSchedule] = useState("");

  const {
    data: employees,
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
    // refetch: refetchEmployees,
  } = useQuery(
    ["employees"],
    () =>
      getEmployee({
        divisionId,
      }),
    {
      select: (data) => {
        // console.log("🚀 ~ data:", data?.users);

        const listEmployee = data?.users?.map(({ ...item }) => {
          item.dob = moment(item?.dob).format("YYYY-MM-DD");
          return {
            key: item?.id,
            ...item,
          };
        });
        return listEmployee;
      },
      refetchOnWindowFocus: false,
    }
  );

  const queryClient = useQueryClient();
  const { mutate: submitFormTask, isLoading } = useMutation(
    (task) => createTask(task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", staffId, eventID]);
        // queryClient.invalidateQueries("tasks-filter-member");
        message.open({
          type: "success",
          content: "Tạo một công việc mới thành công",
        });
        setAddNewTask(false);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const onCloseModal = () => {
    console.log("Close");
    setAddNewTask(false);
  };
  const onClose = () => {
    setAddNewTask(false);
  };

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, task }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        const task = variables.task;
        variables.task = {
          file: [
            {
              fileName: data?.fileName ? data?.fileName : "tài liệu công việc",
              fileUrl: data?.downloadUrl,
            },
          ],
          ...task,
        };

        console.log("🚀 ~ useMutation ~ variables.task:", variables.task);
        submitFormTask(variables.task);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  //chọn member
  const handleChangeSelectMember = (value) => {
    setAssignee(value);
  };

  const onChangeDate = (value, dateString) => {
    // Chuyển đổi thành định dạng ISO 8601
    const isoStartDate = moment(dateString?.[0]).toISOString();
    const isoEndDate = moment(dateString?.[1]).toISOString();
    setStartDate(isoStartDate);
    setEndDate(isoEndDate);
  };

  //validate pick date
  const today = moment();
  const disabledDate = (current) => {
    if (current.isBefore(disableStartDate, "day")) {
      return (
        current.isBefore(disableEndDate, "day") ||
        current.isAfter(disableEndDate, "day")
      );
    } else {
      return current.isBefore(today) || current.isAfter(disableEndDate, "day");
    }
  };
  const tagRender = (props) => {
    // const { label, value, closable, onClose } = props;
    const { closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    let matchedUsers;
    if (!isLoadingEmployees) {
      matchedUsers = assignee.map((id) => {
        const user = employees.find((employee) => employee.id === id);
        return user;
      });
    }
    const label = matchedUsers?.find((item) => item.id === props.value)?.profile
      ?.fullName;

    const color =
      matchedUsers?.findIndex((user) => user.id === props.value) === 0
        ? "green"
        : "gold";
    const avatar = matchedUsers?.find((item) => item.id === props.value)
      ?.profile?.avatar;
    return (
      <Tag
        // color={isFirstAssignee ? "green" : "gold"}
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 8,
        }}
      >
        {color === "green" && <StarFilled spin />}
        <Avatar src={avatar} className="mr-2" size="small" />
        {label}
      </Tag>
    );
  };

  const onFinish = (values) => {
    const { fileUrl, date, ...data } = values;
    const task = {
      ...data,
      eventID: eventID,
      startDate: startDate,
      endDate: endDate,
      parentTask: id,
      leader: assignee?.[0]?.toString(),
      desc: JSON.stringify(values.desc.ops),
    };

    console.log("🚀 ~ onFinish ~ task:", task);
    if (values.fileUrl === undefined || values.fileUrl?.length === 0) {
      console.log("NOOO FILE");
      submitFormTask(task);
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "task");
      uploadFileMutate({ formData, task });
    }
  };

  return (
    <>
      <Drawer
        placement="right"
        size={800}
        title={`Danh sách công việc - ${title}`}
        open={addNewTask}
        footer={false}
        onCancel={onCloseModal}
        onClose={onClose}
        width={900}
        className="text-lg font-bold overflow-hidden"
      >
        <div className="px-4 pb-4">
          <Form
            form={form}
            onFinish={onFinish}
            size="large"
            layout="vertical"
            autoComplete="off"
            className="m-0 p-0 "
          >
            {/* title */}
            <Form.Item
              label="Tên công việc"
              labelCol={{
                style: { padding: 0 },
              }}
              name="title"
              className="text-sm font-medium "
              rules={[
                {
                  required: true,
                  message: "Hãy nhập  tên công việc!",
                },
                {
                  whitespace: true,
                  message: " Tên công việc không được để trống!",
                },
                {
                  min: 3,
                  max: 200,
                  message: "tên công việc từ 3 đến 200 kí tự!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Tên công việc  ..." />
            </Form.Item>
            {/* date */}
            <Form.Item
              name="date"
              label="Thời hạn"
              className="text-sm font-medium "
              labelCol={{
                style: { padding: 0 },
              }}
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Hãy chọn thời gian!",
                },
              ]}
              hasFeedback
            >
              <RangePicker
                placeholder={["ngày bắt đầu  ", "ngày kết thúc "]}
                disabledDate={disabledDate}
                onChange={onChangeDate}
                formatDate="YYYY/MM/DD HH:mm:ss"
                className="w-full"
              />
            </Form.Item>
            {/* description */}
            <Form.Item
              initialValue={description}
              label="Mô tả"
              className="text-sm font-medium "
              name="desc"
              labelCol={{
                style: { padding: 0 },
              }}
            >
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(content, delta, source, editor) => {
                  form.setFieldsValue({ desc: editor.getContents() });
                }}
                className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full "
              />
            </Form.Item>
            <div className="flex w-full justify-between items-center my-2">
              {/* priority */}
              <Form.Item
                label="Độ ưu tiên"
                name="priority"
                className="text-sm font-medium m-0 w-1/2 justify-start items-center gap-x-2 flex"
                initialValue={priority.value}
              >
                <Segmented
                  options={[
                    { label: "THẤP", value: "LOW" },
                    { label: "TRUNG BÌNH", value: "MEDIUM" },
                    { label: "CAO", value: "HIGH" },
                  ]}
                  value={priority.value}
                  onChange={setPriority}
                />
              </Form.Item>
              {/* file */}
              <Form.Item
                label="Tài liệu"
                className="text-sm font-medium m-0 w-1/2 flex justify-start items-center gap-x-2"
                name="fileUrl"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[
                  {
                    validator(_, fileList) {
                      return new Promise((resolve, reject) => {
                        if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                          reject("File quá lớn ( dung lượng < 10MB )");
                        } else {
                          resolve();
                        }
                      });
                    },
                  },
                ]}
              >
                <Upload
                  // className="upload-list-inline"
                  maxCount={1}
                  listType="text"
                  action=""
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  showUploadList={{
                    showPreviewIcon: false,
                  }}
                  beforeUpload={(file) => {
                    return new Promise((resolve, reject) => {
                      if (file && file?.size > 10 * 1024 * 1024) {
                        reject("File quá lớn ( <10MB )");
                        return false;
                      } else {
                        setFileList(file);
                        resolve();
                        return true;
                      }
                    });
                  }}
                >
                  {/* <Button icon={<UploadOutlined />}>Tải tài liệu</Button> */}
                  <p className="flex flex-row gap-x-3 justify-center items-center hover:text-blue-400">
                    <UploadOutlined /> Thêm tài liệu
                  </p>
                </Upload>
              </Form.Item>
            </div>

            {/* member */}
            <Form.Item
              label="Phân công"
              name="assignee"
              className="text-sm font-medium mt-4"
              labelCol={{
                style: { padding: 0 },
              }}
              rules={[
                {
                  required: true,
                  message: "Hãy chọn nhân viên!",
                },
              ]}
            >
              <>
                {!isLoadingEmployees ? (
                  !isErrorEmployees ? (
                    <>
                      <Select
                        maxTagCount="responsive"
                        autoFocus
                        allowClear
                        mode="multiple"
                        placeholder="Người được chọn đầu tiên là nhóm trưởng"
                        style={{
                          width: "100%",
                        }}
                        onChange={(value) => handleChangeSelectMember(value)}
                        optionLabelProp="label"
                        tagRender={tagRender}
                      >
                        {employees?.map((item, index) => {
                          return (
                            <Option
                              value={item?.id}
                              label={
                                <span
                                  role="img"
                                  aria-label={item?.profile?.fullName}
                                >
                                  <Tooltip
                                    key="avatar"
                                    title={item?.profile?.fullName}
                                    placement="top"
                                  >
                                    <Avatar
                                      src={item?.profile?.avatar}
                                      className="mr-2"
                                      size="small"
                                    />
                                  </Tooltip>
                                  {item?.profile?.fullName}
                                </span>
                              }
                              key={item?.id}
                            >
                              <Space>
                                <span
                                  role="img"
                                  aria-label={item?.profile?.fullName}
                                >
                                  {item?.profile?.avatar ? (
                                    <Avatar src={item?.profile?.avatar} />
                                  ) : (
                                    <Avatar
                                      icon={<UserOutlined />}
                                      size="small"
                                    />
                                  )}
                                </span>
                                <span>{item?.profile?.fullName}</span>
                              </Space>
                            </Option>
                          );
                        })}
                      </Select>
                    </>
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <LoadingComponentIndicator />
                )}
              </>
            </Form.Item>
            <div className="w-full overflow-hidden ">
              <ScheduleEmloyees
                checkedDateData={checkedDateData}
                childrenDrawer={childrenDrawer}
                setCheckedDateData={setCheckedDateData}
                setChildrenDrawer={setChildrenDrawer}
                setSelectedDateSchedule={setSelectedDateSchedule}
              />
            </div>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingUploadFile || isLoading}
                block
                className="mt-9"
              >
                Tạo công việc
              </Button>
            </Form.Item>
          </Form>
        </div>

        <DrawerTimeLine
          selectedDateSchedule={selectedDateSchedule}
          checkedDateData={checkedDateData}
          childrenDrawer={childrenDrawer}
          setChildrenDrawer={setChildrenDrawer}
        />
      </Drawer>
    </>
  );
};

export default memo(NewTaskModal);
