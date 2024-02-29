import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import React, { memo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouteLoaderData } from "react-router-dom";
import { getAllUser, getEmployeeByDate } from "../../../apis/users";
import moment from "moment";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
// import { debounce } from "lodash";
import { createTask } from "../../../apis/tasks";
import { uploadFile } from "../../../apis/files";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import viVN from "antd/locale/vi_VN";

const NewTaskModal = ({
  addNewTask,
  setAddNewTask,
  TaskParent,
  disableEndDate,
  disableStartDate,
}) => {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { id, eventID, title } = TaskParent ?? {};
  const [startDate, setStartDate] = useState("");
  console.log("🚀 ~ file: NewTaskModal.js:42 ~ startDate:", startDate);
  const [endDate, setEndDate] = useState("");
  console.log("🚀 ~ file: NewTaskModal.js:43 ~ endDate:", endDate);
  const [disabledEmployee, setDisabledEmployee] = useState(true);
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [priority, setPriority] = useState({ label: "THẤP", value: "LOW" });
  const [fileList, setFileList] = useState();
  const divisionId = useRouteLoaderData("staff").divisionID;

  const {
    data: employeesByDate,
    isError: isErrorEmployeesByDate,
    isLoading: isLoadingEmployeesByDate,
    refetch: refetchEmployees,
  } = useQuery(
    ["employees-by-Date"],
    () =>
      getEmployeeByDate({
        startDate: startDate,
        endDate: endDate,
      }),
    {
      select: (data) => {
        const filteredData = data?.filter(
          (item) =>
            item?.division?.id === divisionId && item?.typeEmployee === "FULL_TIME"
        );
        
        const listEmployee = filteredData?.map(({ ...item }) => {
          item.dob = moment(item?.dob).format("YYYY-MM-DD");
          return {
            key: item?.id,
            ...item,
          };
        });
        return listEmployee;
      },
      refetchOnWindowFocus: false,
      enabled: !!startDate && !!endDate,
    }
  );
  console.log(
    "🚀 ~ file: NewTaskModal.js:56 ~ employeesByDate:",
    employeesByDate
  );

  const queryClient = useQueryClient();
  const { mutate: submitFormTask, isLoading } = useMutation(
    (task) => createTask(task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
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

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, task }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        console.log(
          "🚀 ~ file: NewTaskModal.js:104 ~ useMutation ~ data:",
          data
        );
        const task = variables.task;
        variables.task = {
          file: [{ fileName: data?.fileName, fileUrl: data?.downloadUrl }],
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
    if (isoStartDate && isoEndDate) {
      console.log("ok");
      setDisabledEmployee(false);
      // refetchEmployees();
    } else {
      console.log("not");
      setDisabledEmployee(true);
    }
  };

  //validate pick date
  const today = moment();
  const todayFormat = moment().format("YYYY-MM-DD HH:mm:ss");
  const checkStartDateFormat = moment(disableStartDate).format("YYYY-MM-DD");
  const checkEndDateFormat = moment(disableEndDate).format("YYYY-MM-DD");

  const hourStartDate = moment(disableStartDate).format("HH");

  const minutesStartDate = moment(disableStartDate).format("mm");
  const hourCurrentDate = moment(todayFormat).format("HH");

  const minutesCurrentDate = moment(todayFormat).format("mm");

  const hourEndDate = moment(disableEndDate).format("HH");
  const minutesEndDate = moment(disableEndDate).format("mm");

  const disabledDate = (current) => {
    if (current.isBefore(disableStartDate, "day")) {
      return (
        current.isBefore(disableEndDate, "day") ||
        current.isAfter(disableEndDate, "day")
      );
    } else {
      return current.isBefore(today) || current.isAfter(disableEndDate, "day");
    }

    // return current.isBefore(today) || current.isAfter(disableEndDate, "day");
  };
  //validate pick timess
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledRangeTime = (current, type) => {
    //check xem có phải chọn ngày bắt đầu với kết thúc ko ? ko thì sẽ ko bắt time
    if (
      !current?.isAfter(disableStartDate, "day") ||
      !current?.isBefore(disableEndDate, "day")
    ) {
      if (!today.isBefore(disableStartDate, "day")) {
        //Trường hợp  ngày hôm nay nó trùng ngày bắt đầu không ?
        if (type === "start") {
          if (!current?.isBefore(disableEndDate, "day")) {
            //check xem có phải chọn ngày bắt đầu là ngày kết thúc của task ko ?
            return {
              disabledHours: () => range(hourEndDate, 24),
              disabledMinutes: () => range(minutesEndDate, 60),
            };
          } else if (!current?.isAfter(disableStartDate, "day")) {
            //check xem có phải chọn ngày bắt đầu là ngày bắt đầu của task ko ?
            return {
              disabledHours: () => range(0, hourCurrentDate),
              disabledMinutes: () => range(0, minutesCurrentDate),
            };
          }
        } else {
          // đây là chọn ngày kết thúc
          if (!current?.isAfter(disableStartDate, "day")) {
            return {
              disabledHours: () => range(0, hourCurrentDate),
              disabledMinutes: () => range(0, minutesCurrentDate),
            };
          } else if (!current?.isBefore(disableEndDate, "day")) {
            return {
              disabledHours: () => range(hourEndDate, 24),
              disabledMinutes: () => range(minutesEndDate, 60),
            };
          }
          return {
            disabledHours: () => range(hourEndDate, 24),
            disabledMinutes: () => range(minutesEndDate, 60),
          };
        }
      } else if (
        checkStartDateFormat.toString() === checkEndDateFormat.toString()
      ) {
        //Trường hợp trong 1 ngày
        if (type === "start") {
          // return {
          //   disabledHours: () => range(0, hourStartDate),
          //   disabledMinutes: () => range(0, minutesStartDate),
          // };
          return {
            disabledHours: () =>
              range(0, hourStartDate).concat(range(hourEndDate, 24)), // Sửa đoạn này
            disabledMinutes: () =>
              range(0, minutesStartDate).concat(range(minutesEndDate, 60)),
          };
        }
        return {
          disabledHours: () =>
            range(0, hourStartDate).concat(range(hourEndDate, 24)), // Sửa đoạn này
          disabledMinutes: () =>
            range(0, minutesStartDate).concat(range(minutesEndDate, 60)),
        };
      } else {
        // trường hợp ngày hôm nay trước ngày bắt đầu
        if (type === "start") {
          if (!current?.isBefore(disableEndDate, "day")) {
            // nếu chọn ngày enđate
            return {
              disabledHours: () => range(hourEndDate, 24),
              disabledMinutes: () => range(minutesEndDate, 60),
            };
          } else if (!current?.isAfter(disableStartDate, "day")) {
            //ngày bắt đầu startdate
            return {
              disabledHours: () => range(0, hourStartDate),
              disabledMinutes: () => range(0, minutesStartDate),
            };
          }
          if (!current?.isAfter(disableStartDate, "day")) {
            //chọn ngày kết thúc là ngày cuối
            return {
              disabledHours: () => range(0, hourStartDate),
              disabledMinutes: () => range(0, minutesStartDate),
            };
          }
          return {
            disabledHours: () => range(hourEndDate, 24),
            disabledMinutes: () => range(minutesEndDate, 60),
          };
        }
      }
    } else {
      //các ngày ở giữa ngày bắt đầu và kết thúc thì sẽ ko bắt gì cả
      return {
        disabledHours: () => range(0, 0),
        disabledMinutes: () => range(0, 0),
      };
    }
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

  const [form] = Form.useForm();
  return (
    <div>
      <Modal
        title={`Danh sách công việc - ${title}`}
        open={addNewTask}
        footer={false}
        onCancel={onCloseModal}
        width={900}
        className="text-lg font-bold"
      >
        <div className="mt-4 p-4">
          <Form
            form={form}
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
              label="Tên công việc"
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
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Hãy chọn thời gian!",
                },
              ]}
              hasFeedback
            >
              {/* <ConfigProvider locale={viVN}> */}
              <RangePicker
                placeholder={["ngày bắt đầu  ", "ngày kết thúc "]}
                disabledTime={disabledRangeTime}
                disabledDate={disabledDate}
                showTime={{
                  format: "HH:mm:ss",
                  hideDisabledOptions: true,
                }}
                onChange={onChangeDate}
                formatDate="YYYY/MM/DD HH:mm:ss"
              />
              {/* </ConfigProvider> */}
            </Form.Item>
            {/* member */}
            <Form.Item
              label="Phân công"
              name="assignee"
              className="text-sm font-medium mb-8"
              rules={[
                {
                  required: true,
                  message: "Hãy chọn nhân viên!",
                },
              ]}
              // validateStatus="warning"
              help="Cần chọn thời gian để chọn nhân viên"
              hasFeedback
            >
              <Select
                disabled={disabledEmployee}
                autoFocus
                allowClear
                mode="multiple"
                placeholder="Người được chọn đầu tiên là nhóm trưởng"
                style={{
                  width: "100%",
                }}
                onChange={(value) => handleChangeSelectMember(value)}
                optionLabelProp="label"
              >
                <>
                  {!isLoadingEmployeesByDate ? (
                    !isErrorEmployeesByDate ? (
                      <>
                        {employeesByDate?.map((item, index) => {
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
                                  {item.avatar ? (
                                    <Avatar src={item?.avatar} />
                                  ) : (
                                    <Avatar
                                      icon={<UserOutlined />}
                                      size="small"
                                    />
                                  )}
                                </span>
                                {item?.profile?.fullName}
                              </Space>
                            </Option>
                          );
                        })}
                      </>
                    ) : (
                      <AnErrorHasOccured />
                    )
                  ) : (
                    <LoadingComponentIndicator />
                  )}
                </>
              </Select>
            </Form.Item>
            {/* Estimated */}
            <Form.Item
              initialValue={0.0}
              label="Ước tính giờ làm"
              name="estimationTime"
              className="text-sm font-medium "
              rules={[
                // {
                //   pattern: /^\d*$/,
                //   message: "Chỉ được nhập số",
                // },
                {
                  validator: async (_, value) => {
                    if (!/^\d*$/.test(value)) {
                      throw new Error("Chỉ được nhập số");
                    }
                  },
                },
                {
                  type: "number",
                  min: 0,
                  message: "Bắt buộc nhập số lớn hơn 0",
                },
              ]}
            >
              <InputNumber
                placeholder="Chọn thời gian ước tính làm"
                className="w-1/3"
                // type="number"
                // step="0.1"
                // stringMode
              />
            </Form.Item>
            {/* priority */}
            <Form.Item
              label="Độ ưu tiên"
              name="priority"
              className="text-sm font-medium "
              initialValue={priority.value}
            >
              <Segmented
                // defaultValue="LOW"
                options={[
                  { label: "THẤP", value: "LOW" },
                  { label: "TRUNG BÌNH", value: "MEDIUM" },
                  { label: "CAO", value: "HIGH" },
                ]}
                value={priority.value}
                onChange={setPriority}
              />
            </Form.Item>
            {/* description */}
            <Form.Item
              initialValue={description}
              label="Mô tả"
              className="text-sm font-medium "
              name="desc"
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
            {/* file */}
            <Form.Item
              label="Tài liệu"
              className="text-sm font-medium "
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
                <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-9"
                loading={isLoadingUploadFile || isLoading}
              >
                Tạo công việc
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default memo(NewTaskModal);
