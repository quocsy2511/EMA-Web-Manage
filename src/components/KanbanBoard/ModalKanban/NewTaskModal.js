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
import {
  CaretDownOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  HistoryOutlined,
  StarFilled,
  SwapRightOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ScheduleEmloyees from "../Schedule/ScheduleEmloyees";
import { MdEmojiEvents } from "react-icons/md";
import avatarDefault from "../../../assets/images/empty_event.png";

const NewTaskModal = ({
  addNewTask,
  setAddNewTask,
  TaskParent,
  disableEndDate,
  disableStartDate,
}) => {
  console.log("🚀 ~ TaskParent:", TaskParent);
  const eventID = TaskParent?.eventDivision?.event?.id;
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { id, title } = TaskParent ?? {};
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [priority, setPriority] = useState({ label: "THẤP", value: "LOW" });
  const [fileList, setFileList] = useState();
  const divisionId = useRouteLoaderData("staff").divisionID;
  const staffId = useRouteLoaderData("staff").id;
  const [form] = Form.useForm();

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
  const onSubmitData = () => {
    setAddNewTask(false);
  };
  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, task }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        console.log(
          "🚀 ~ file: NewTaskModal.js:104 ~ useMutation ~ data:",
          data
        );
        const task = variables.task;
        console.log("🚀 ~ useMutation ~ variables.task:", variables.task);
        variables.task = {
          file: [
            {
              fileName: data?.fileName ? data?.fileName : "tài liệu công việc",
              fileUrl: data?.downloadUrl,
            },
          ],
          ...task,
        };
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
    let listMember = [];
    if (value.length > 0) {
      listMember = [...assignee, value];
    }
    setAssignee(listMember);
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
    const { label, value, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="gold"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
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
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [checkedDateData, setCheckedDateData] = useState([]);
  console.log("🚀 ~ checkedDateData:", checkedDateData);

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
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
            // labelCol={{
            //   span: 4,
            // }}
            // wrapperCol={{
            //   span: 20,
            // }}
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
                // label="Độ ưu tiên"
                name="priority"
                className="text-sm font-medium m-0 w-1/2 flex justify-start items-center gap-x-2"
                initialValue={priority.value}
              >
                <>
                  <span className="text-sm font-medium mr-2">Độ ưu tiên: </span>
                  <Segmented
                    options={[
                      { label: "THẤP", value: "LOW" },
                      { label: "TRUNG BÌNH", value: "MEDIUM" },
                      { label: "CAO", value: "HIGH" },
                    ]}
                    value={priority.value}
                    onChange={setPriority}
                  />
                </>
              </Form.Item>
              {/* file */}
              <Form.Item
                // label="Tài liệu"
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
                <>
                  <span className="text-sm font-medium mr-2">Tài liệu : </span>
                  <Upload
                    className="upload-list-inline"
                    maxCount={1}
                    // listType="picture"
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
                    <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
                  </Upload>
                </>
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
              hasFeedback
            >
              <>
                {!isLoadingEmployees ? (
                  !isErrorEmployees ? (
                    <>
                      <Select
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
                              label={item?.profile?.fullName}
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
        <Drawer
          title="Lịch chi tiết công việc của nhân viên"
          width={550}
          closable={false}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
        >
          {checkedDateData?.length > 0 && (
            <div className="w-full py-1  h-full">
              {/* info */}
              <div className="flex flex-row justify-start items-center gap-x-3 mb-1">
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <p className="font-semibold text-sm">Độ ưu tiên :</p>
                </div>
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <Badge
                    count={
                      <ClockCircleOutlined className="pt-1 text-red-500" />
                    }
                  />
                  <p>Cao</p>
                </div>
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <Badge
                    count={<FieldTimeOutlined className="pt-1 text-gray-500" />}
                  />
                  <p>Bình thường</p>
                </div>
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <Badge
                    count={<HistoryOutlined className="pt-1 text-green-500" />}
                  />
                  <p>Thấp</p>
                </div>
              </div>
              <div className="flex flex-row justify-start items-center gap-x-3 mb-4">
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <p className="font-semibold text-sm">
                    Trạng thái công việc :
                  </p>
                </div>
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <Badge color="blue" text="Đang diễn ra" />
                </div>
                <div className="flex flex-row justify-center items-start gap-x-2">
                  <Badge color="yellow" text="Đang chuẩn bị" />
                </div>
              </div>

              {checkedDateData?.map((item) => (
                <div
                  className="w-full mb-5 border-b-2 border-b-slate-300 pt-3 "
                  key={item?.id}
                >
                  {/* header */}
                  <div className="flex justify-start items-center  mb-2 gap-x-3">
                    <Avatar src={item?.profile?.avatar} size="large" />
                    <Tooltip title="testing">
                      <p className="w-auto max-w-xs text-center text-base font-medium truncate cursor-pointer">
                        {item?.profile?.fullName}
                      </p>
                    </Tooltip>
                  </div>
                  {/* content */}
                  <div>
                    {item?.listEvent?.map((event) => (
                      <div key={event?.eventID}>
                        {/* listEvent */}
                        <div className=" px-3 py-1 rounded-lg bg-blue-400 flex flex-row justify-start items-center gap-x-1 overflow-hidden mb-2">
                          <CaretDownOutlined className="text-white" />
                          <Tooltip title={event?.eventName}>
                            <p className="text-sm text-white font-normal pr-4 truncate cursor-pointer">
                              {event?.eventName}
                            </p>
                          </Tooltip>
                        </div>

                        {/* List Task */}
                        <div className="w-full pt-3 overflow-hidden ">
                          <Timeline
                            mode="right"
                            items={event?.listTask
                              ?.filter(
                                (item) =>
                                  item.status === "PENDING" ||
                                  item.status === "PROCESSING"
                              )
                              ?.map((task) => {
                                const startDate = moment(
                                  task?.startDate
                                ).format("DD-MM-YYYY");
                                const endDate = moment(task?.endDate).format(
                                  "DD-MM-YYYY"
                                );
                                return {
                                  label: (
                                    <>
                                      <p className="flex justify-start items-center gap-x-2 font-medium text-black">
                                        {startDate}{" "}
                                        <SwapRightOutlined className="text-gray-400 font-normal" />{" "}
                                        {endDate}
                                      </p>
                                    </>
                                  ),
                                  children: (
                                    <>
                                      <p
                                        className={
                                          task?.status === "PENDING"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                        }
                                      >
                                        {task?.title}
                                      </p>
                                    </>
                                  ),
                                  dot: (
                                    <>
                                      {task?.priority === "HIGH" ? (
                                        <ClockCircleOutlined className="timeline-clock-icon text-red-500" />
                                      ) : task?.priority === "MEDIUM" ? (
                                        <FieldTimeOutlined className="timeline-clock-icon text-gray-500" />
                                      ) : (
                                        <HistoryOutlined className="timeline-clock-icon text-green-500" />
                                      )}
                                    </>
                                  ),
                                };
                              })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Drawer>
      </Drawer>
    </>
  );
};

export default memo(NewTaskModal);
