import {
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Segmented,
  Select,
  Spin,
  Tag,
  Upload,
  message,
} from "antd";
import clsx from "clsx";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouteLoaderData } from "react-router-dom";
import { uploadFile } from "../../../apis/files";
import { createTask, getTasks } from "../../../apis/tasks";
import { getEmployee } from "../../../apis/users";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import DrawerTimeLine from "../Drawer/DrawerTimeLine";
import ScheduleEmloyees from "../Schedule/ScheduleEmloyees";

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const DrawerContainer = memo(
  ({
    isDrawerOpen,
    setIsDrawerOpen,
    selectedTaskTemplate,
    setSelectedTaskTemplate,
  }) => {
    const {
      data: templateTask,
      isLoading: isLoadingTemplateTask,
      isError: isErrorTemplateTask,
    } = useQuery(
      ["template-task"],
      () =>
        getTasks({
          fieldName: "isTemplate",
          conValue: "true",
          pageSize: 50,
          currentPage: 1,
        }),
      {
        refetchOnWindowFocus: false,
      }
    );

    return (
      <Drawer
        title="Danh sách công việc mẫu"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={"30%"}
      >
        {/* Content */}
        <div className="mx-5">
          <p className="mb-6 text-lg text-black/60">Chọn các hạng mục mẫu</p>

          <Spin spinning={isLoadingTemplateTask}>
            {templateTask?.map((task) => (
              <div
                key={task?.id}
                className={clsx(
                  "rounded-2xl mb-10 overflow-hidden shadow-[0_0_8px_1px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform cursor-pointer"
                  // { "shadow-blue-500": chosenTemplateTask?.id === task?.id }
                )}
                onClick={() => {
                  setSelectedTaskTemplate(task);
                }}
              >
                <div className="pb-3 overflow-hidden">
                  <p className="px-5 pb-2 pt-3 text-xl font-medium truncate border-b overflow-hidden">
                    {task?.title}
                  </p>

                  <div className="p-5 pt-3 pb-14">
                    <p className="text-lg font-medium">Mô tả</p>

                    <ReactQuill
                      // defaultValue={task?.description}
                      defaultValue={{
                        ops: JSON.parse(
                          task?.description?.startsWith(`[{"`)
                            ? task?.description
                            : parseJson(task?.description)
                        ),
                      }}
                      className="mt-2 h-20"
                      theme="snow"
                      placeholder="Mô tả về công việc"
                      onChange={(content, delta, source, editor) => {}}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </Spin>
        </div>
      </Drawer>
    );
  }
);

const NewTaskModal = ({
  setAddNewTask,
  TaskParent,
  disableEndDate,
  disableStartDate,
  setHideDescription,
  templateTask,
  addNewTaskTemplate,
  setAddNewTaskTemplate,
  setIsHideHeaderEvent,
}) => {
  const eventID = TaskParent?.eventDivision?.event?.id;
  const itemId = TaskParent?.item?.id;
  const { RangePicker } = DatePicker;
  const { id } = TaskParent ?? {};
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (selectedTaskTemplate) {
      const parseDes =
        selectedTaskTemplate?.description?.ops?.[0].insert.replace(".\n", "");

      form.setFieldsValue({
        title: `${selectedTaskTemplate?.title}`,
        desc: {
          ops: JSON.parse(
            selectedTaskTemplate?.description?.startsWith(`[{"`)
              ? selectedTaskTemplate?.description
              : parseJson(selectedTaskTemplate?.description)
          ),
        },
        priority: selectedTaskTemplate?.priority,
      });

      setIsDrawerOpen(false);
    }
  }, [selectedTaskTemplate]);

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
        setIsHideHeaderEvent(false);
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
    if (dateString?.length > 0) {
      // Chuyển đổi thành định dạng ISO 8601
      const formatStart = moment(dateString?.[0], "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      const formatEnd = moment(dateString?.[1], "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      const isoStartDate = moment(formatStart).toISOString();
      const isoEndDate = moment(formatEnd).toISOString();
      setStartDate(isoStartDate);
      setEndDate(isoEndDate);
    }
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
      matchedUsers = assignee.map((id, index) => {
        const user = employees.find((employee) => employee.id === id);
        const isLeader = index === 0; //xem có phải index đầu không thì true
        const data = { ...user, isLeader };
        return data;
      });
    } else {
      matchedUsers = assignee.map((id, index) => {
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
        className="mr-4 py-2 cursor-pointer flex justify-center items-center "
        onClick={() => handleSelectLeader(leader)}
      >
        {defaultLeader === "green" ? (
          <UserOutlined className="text-lg text-green-500" />
        ) : (
          <TeamOutlined className="text-lg text-yellow-500" />
        )}
        <Avatar src={avatar} className="mr-2" size="small" />
        <p className="font-semibold text-sm">{label}</p>
        {defaultLeader === "green" && (
          <span className="text-green-500">-(Nhóm trưởng) </span>
        )}
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
      itemId: itemId,
      desc: JSON.stringify(values.desc.ops),
    };

    if (values.fileUrl === undefined || values.fileUrl?.length === 0) {
      submitFormTask(task);
    } else {
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "task");
      uploadFileMutate({ formData, task });
    }
  };

  return (
    <>
      <DrawerContainer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedTaskTemplate={selectedTaskTemplate}
        setSelectedTaskTemplate={setSelectedTaskTemplate}
      />
      <div className="px-10 py-8 rounded-lg ">
        {/* header */}
        <div className="flex flex-row w-full">
          <div className="flex flex-row w-full justify-between items-center mb-2">
            <div className="w-[50%] flex flex-col justify-center items-start">
              <h3 className="font-semibold text-4xl text-blueBudget mb-2">
                Tạo công việc
              </h3>
              <p className="mb-2 text-blueSecondBudget inline-block">
                Thêm công việc cho hạng mục -{" "}
                <b className="text-base text-blueBudget">{TaskParent?.title}</b>{" "}
              </p>
            </div>
            <div className="w-[50%] flex justify-end text-end">
              <Button
                type="primary"
                icon={<WalletOutlined />}
                onClick={() => setIsDrawerOpen(true)}
              >
                Công việc mẫu
              </Button>
            </div>
          </div>
        </div>
        {/* content */}
        <div className="px-10 py-6 rounded-lg w-full flex justify-center flex-col bg-white">
          <Form
            form={form}
            onFinish={onFinish}
            size="large"
            layout="vertical"
            autoComplete="off"
            className="m-0 p-0 "
          >
            <div className="flex space-x-5">
              {/* title */}
              <Form.Item
                label="Tên công việc"
                labelCol={{
                  style: { padding: 0, fontWeight: 700 },
                }}
                name="title"
                className="w-2/3 text-sm font-medium "
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
                  size="large"
                  placeholder="Tên công việc  ..."
                  autoFocus={!addNewTaskTemplate}
                />
              </Form.Item>
              {/* date */}
              <Form.Item
                name="date"
                label="Thời hạn"
                className="flex-1 text-sm font-medium "
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
                  // locale={locale}
                  placeholder={["Ngày bắt đầu  ", "Ngày kết thúc "]}
                  disabledDate={disabledDate}
                  onChange={onChangeDate}
                  format="DD-MM-YYYY"
                  className="w-full"
                />
              </Form.Item>
            </div>
            {/* description */}
            <Form.Item
              initialValue={description}
              label="Mô tả"
              className="text-sm font-medium mb-12"
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
                className="bg-transparent py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full h-28"
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
                  size="large"
                  options={[
                    { label: "THẤP", value: "LOW" },
                    { label: "VỪA", value: "MEDIUM" },
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
                  className="flex items-center space-x-5"
                  maxCount={1}
                  listType="picture"
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
                        size="large"
                        maxTagCount="responsive"
                        allowClear
                        onClear={handleClearSelectEmployee}
                        mode="multiple"
                        placeholder="Chọn người thực hiện"
                        className="w-full"
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
                employees={employees}
              />
            </div>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingUploadFile || isLoading}
                block
                className="mt-9"
                size="large"
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
