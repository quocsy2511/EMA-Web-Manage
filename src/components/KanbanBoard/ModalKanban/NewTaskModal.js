import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Segmented,
  Select,
  Tag,
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
  CloseCircleOutlined,
  DoubleRightOutlined,
  StarFilled,
  SwapOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ScheduleEmloyees from "../Schedule/ScheduleEmloyees";
import DrawerTimeLine from "../Drawer/DrawerTimeLine";

const NewTaskModal = ({
  setAddNewTask,
  TaskParent,
  disableEndDate,
  disableStartDate,
  setHideDescription,
  templateTask,
  addNewTaskTemplate,
  setAddNewTaskTemplate,
}) => {
  // console.log("🚀 ~ TaskParent:", TaskParent);
  const eventID = TaskParent?.eventDivision?.event?.id;
  const { RangePicker } = DatePicker;
  const { id } = TaskParent ?? {};
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
  const [selectedTaskTemplate, setSelectedTaskTemplate] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  console.log("🚀 ~ selectedLeader:", selectedLeader);
  const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

  const handleChangeTaskTemplate = (value) => {
    if (value) {
      const TaskTemplateFind = templateTask.find((item) => item.id === value);
      setSelectedTaskTemplate(TaskTemplateFind?.title);
      const descriptionTemplate = {
        ops: JSON.parse(
          TaskTemplateFind?.description?.startsWith(`[{"`)
            ? TaskTemplateFind?.description
            : parseJson(TaskTemplateFind?.description)
        ),
      };
      const parseDes = descriptionTemplate?.ops?.[0].insert.replace(".\n", "");
      form.setFieldsValue({
        title: `${TaskTemplateFind?.title}`,
        desc: `${parseDes}`,
        priority: `${TaskTemplateFind.priority}`,
      });
    } else {
      form.resetFields();
    }
  };
  //search templateTask
  const filterOptionTaskTemplate = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  //search Employee
  const filterOption = (input, option) =>
    (option?.label?.props?.label ?? "")
      .toLowerCase()
      .includes(input.toLowerCase());

  const {
    data: employees,
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
  } = useQuery(
    ["employees"],
    () =>
      getEmployee({
        divisionId,
      }),
    {
      select: (data) => {
        const listEmployee = data?.users
          ?.filter((user) => user.role.roleName === "Nhân Viên")
          ?.map(({ ...item }) => {
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
        setHideDescription(false);
        setAddNewTask(false);
        setAddNewTaskTemplate(false);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

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

  const handleCloseNewTask = () => {
    setHideDescription(false);
    setAddNewTask(false);
    setAddNewTaskTemplate(false);
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

    const handlerCloseTag = (value) => {
      console.log("🚀 ~ handlerCloseTag ~ value:", value);
      if (value && value === selectedLeader?.id) {
        setSelectedLeader("");
      }
      onClose();
    };
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    let matchedUsers;
    if (!isLoadingEmployees && !selectedLeader) {
      // console.log("1");
      matchedUsers = assignee.map((id, index) => {
        const user = employees.find((employee) => employee.id === id);
        const isLeader = index === 0; //xem có phải index đầu không thì true
        const data = { ...user, isLeader };
        return data;
      });
    } else {
      matchedUsers = assignee.map((id, index) => {
        // console.log("2");
        const user = employees.find((employee) => employee.id === id);
        const isLeader = id === selectedLeader?.id; //xem có phải id giống không thì true
        const data = { ...user, isLeader };
        return data;
      });
    }

    const handleSelectLeader = (value) => {
      setSelectedLeader(value);
    };
    const defaultLeader = matchedUsers?.find((user) => user.id === props.value)
      ?.isLeader
      ? "green"
      : "gold";

    const leader = matchedUsers?.find((item) => item.id === props.value);
    const label = matchedUsers?.find((item) => item.id === props.value)?.profile
      ?.fullName;

    const avatar = matchedUsers?.find((item) => item.id === props.value)
      ?.profile?.avatar;

    return (
      <Tag
        color={defaultLeader}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={() => handlerCloseTag(props.value)}
        className="mr-4 py-2 cursor-pointer"
        onClick={() => handleSelectLeader(leader)}
      >
        {defaultLeader === "green" && <StarFilled spin />}
        <Avatar src={avatar} className="mr-2" size="small" />
        {label}
      </Tag>
    );
  };
  const handleClearSelectEmployee = () => {
    setSelectedLeader("");
  };

  const onFinish = (values) => {
    const { fileUrl, date, ...data } = values;

    let leader;
    if (selectedLeader) {
      leader = selectedLeader?.id;
    } else {
      leader = assignee?.[0]?.toString();
    }

    const task = {
      ...data,
      eventID: eventID,
      startDate: startDate,
      endDate: endDate,
      parentTask: id,
      leader: leader,
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
      <div className="px-16 mt-1  py-8 rounded-lg ">
        {/* header */}
        <div className="flex flex-row w-full  py-2">
          <div className="flex flex-row w-full justify-between items-center mb-2 ">
            <div className="w-[50%] flex flex-col justify-center items-start  py-2">
              <h3 className="font-bold text-3xl text-blueBudget mb-2">
                Thêm mới công việc
              </h3>
              <p className="mb-2 text-blueSecondBudget inline-block">
                Thêm công việc cho đề mục -{" "}
                <b className="text-base text-blueBudget">{TaskParent?.title}</b>{" "}
              </p>
            </div>
            <div className="w-[50%] flex justify-end text-end">
              <ul className="pl-0 list-none inline-block mt-6">
                <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                  <span
                    className="cursor-pointer hover:text-blue-500 text-blueBudget"
                    onClick={handleCloseNewTask}
                  >
                    <span className="font-bold">Bảng công việc</span>
                  </span>
                  <DoubleRightOutlined />
                </li>
                <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                  <span className="cursor-pointer hover:text-blueBudget">
                    <span className="font-bold">Thêm mới</span>
                  </span>
                </li>
                {selectedTaskTemplate && (
                  <li className="relative float-left mr-0 text-blueSecondBudget">
                    <DoubleRightOutlined className="mr-1" />
                    <span>{selectedTaskTemplate}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* content */}
        <div className="px-14 py-8 rounded-lg w-full flex justify-center flex-col bg-white">
          {addNewTaskTemplate && (
            <div className="w-full flex flex-col justify-start items-start gap-y-3 mb-4">
              <h3 className="font-bold">
                <StarFilled className="text-yellow-400 mr-2" /> Chọn nhanh các
                công việc có sẵn
              </h3>
              <Select
                allowClear
                showSearch
                autoFocus={addNewTaskTemplate}
                size="large"
                optionFilterProp="children"
                filterOption={filterOptionTaskTemplate}
                options={
                  templateTask?.map((item) => ({
                    value: item?.id,
                    label: item?.title,
                  })) ?? []
                }
                placeholder="Chọn công mẫu"
                className="w-full"
                onChange={handleChangeTaskTemplate}
              />
            </div>
          )}

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
                style: { padding: 0, fontWeight: 700 },
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
              <Input
                placeholder="Tên công việc  ..."
                autoFocus={!addNewTaskTemplate}
              />
            </Form.Item>
            {/* date */}
            <Form.Item
              name="date"
              label="Thời hạn"
              className="text-sm font-medium "
              labelCol={{
                style: { padding: 0, fontWeight: 700 },
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
                style: { padding: 0, fontWeight: 700 },
              }}
            >
              <ReactQuill
                theme="snow"
                // value={description}
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
                labelCol={{
                  style: { padding: 0, fontWeight: 700 },
                }}
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
                labelCol={{
                  style: { padding: 0, fontWeight: 700 },
                }}
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
                style: { padding: 0, fontWeight: 700 },
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
                        allowClear
                        onClear={handleClearSelectEmployee}
                        mode="multiple"
                        placeholder="Người được chọn đầu tiên là nhóm trưởng"
                        style={{
                          width: "100%",
                        }}
                        onChange={(value) => handleChangeSelectMember(value)}
                        optionLabelProp="label"
                        tagRender={tagRender}
                        showSearch
                        optionFilterProp="children"
                        filterOption={filterOption}
                        options={employees?.map((item) => {
                          return {
                            label: (
                              <span
                                key={item?.id}
                                label={item?.profile?.fullName}
                              >
                                <Avatar
                                  src={item?.profile?.avatar}
                                  className="mr-2"
                                  size="small"
                                />
                                {item?.profile?.fullName}
                              </span>
                            ),
                            value: item?.id,
                          };
                        })}
                      />
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
        {/* Drawer */}
        <DrawerTimeLine
          selectedDateSchedule={selectedDateSchedule}
          checkedDateData={checkedDateData}
          childrenDrawer={childrenDrawer}
          setChildrenDrawer={setChildrenDrawer}
        />
      </div>
    </>
  );
};

export default memo(NewTaskModal);
