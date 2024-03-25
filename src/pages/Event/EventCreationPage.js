import React, { Fragment, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Spin,
  Steps,
  Tooltip,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import momenttz from "moment-timezone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEvent, getEventType } from "../../apis/events";
import { uploadFile } from "../../apis/files";
import { getContractInfoByContact } from "../../apis/contract";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";
import { getAllDivision } from "../../apis/divisions";
import dayjs from "dayjs";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";
import { getPlanByContact } from "../../apis/planning";
import { BsPiggyBank } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";

const { RangePicker } = DatePicker;

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const DefaultTemplateTask = memo(
  ({
    isDefault,
    custom,
    toggleSelectTemplateTasks,
    messageApi,
    task,
    handleUpdateDesc,
  }) => {
    const [descText, setDescText] = useState();

    useEffect(() => {
      let identifier;
      if (descText) {
        identifier = setTimeout(() => {
          handleUpdateDesc(task?.itemId, descText);
        }, 1000);
      }

      return () => {
        identifier && clearTimeout(identifier);
      };
    }, [descText]);

    return (
      <Tooltip title={!isDefault && !custom && "Chọn"}>
        <div
          className={clsx(
            "rounded-2xl mb-10 overflow-hidden shadow-[0_0_8px_1px_rgba(0,0,0,0.15)]",
            { "relative w-[45%] mx-[2.5%]": isDefault || custom },
            {
              "hover:scale-[102%] cursor-pointer transition-transform duration-100":
                !isDefault && !custom,
            }
          )}
          onClick={() => {
            !isDefault && !custom && toggleSelectTemplateTasks();
          }}
        >
          <div className="flex justify-between items-center space-x-5 p-5 pb-3 border-b">
            <p className="text-xl font-medium truncate max-w-[80%]">
              {task?.itemName}
            </p>
            {isDefault ? (
              <div className="flex items-center space-x-1">
                <BsPiggyBank className="text-green-600 text-xl " />
                <p className="text-sm font-medium text-green-600">
                  {(
                    task?.itemPlannedPrice * task?.itemPlannedAmount
                  ).toLocaleString()}{" "}
                  VNĐ
                </p>
              </div>
            ) : (
              custom && (
                <Popconfirm
                  title={<p>Bạn đang hạng mục này ?</p>}
                  okText="Xác nhận"
                  cancelText="Hủy bỏ"
                  onConfirm={() => toggleSelectTemplateTasks()}
                >
                  <div className="rotate-45 cursor-pointer p-2 pt-0">
                    <FaPlus className="text-xl text-red-500" />
                  </div>
                </Popconfirm>
              )
            )}
          </div>

          <div className="p-5 pt-3 pb-20">
            <div>
              <Title title="Mô tả" />

              <ReactQuill
                // value={descText}
                defaultValue={task?.itemDescription}
                className="mt-2 h-20"
                theme="snow"
                placeholder="Mô tả về công việc"
                onChange={(content, delta, source, editor) => {
                  setDescText(editor.getContents());
                }}
              />
            </div>
          </div>
        </div>
      </Tooltip>
    );
  }
);

const DrawerContainer = memo(
  ({
    isDrawerOpen,
    setIsDrawerOpen,
    toggleSelectTemplateTasks,
    messageApi,
  }) => {
    return (
      <Drawer
        title="Danh sách hạng mục mẫu"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={"30%"}
      >
        {/* Content */}
        <div className="mx-5">
          <p className="mb-6 text-lg text-black/60">Chọn các hạng mục mẫu</p>
          <DefaultTemplateTask
            toggleSelectTemplateTasks={toggleSelectTemplateTasks}
            messageApi={messageApi}
          />
          <DefaultTemplateTask
            toggleSelectTemplateTasks={toggleSelectTemplateTasks}
            messageApi={messageApi}
          />
          <DefaultTemplateTask
            toggleSelectTemplateTasks={toggleSelectTemplateTasks}
            messageApi={messageApi}
          />
        </div>
      </Drawer>
    );
  }
);

const EventCreationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const contactId = location.state?.contactId;

  const [fileList, setFileList] = useState();
  const [current, setCurrent] = useState(0);
  const [selectTemplateTasks, setSelectTemplateTasks] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState([]);

  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const { notification } = App.useApp();

  const { data: contactInfo, isLoading: contactInfoIsLoading } = useQuery(
    ["contact", contactId],
    () => getContractInfoByContact(contactId),
    {
      select: (data) => {
        return {
          ...data,
          contractTotalBudget: parseInt(data?.contractTotalBudget),
        };
      },
      refetchOnWindowFocus: false,
    }
  );

  const { data: eventType, isLoading: eventTypeIsLoading } = useQuery(
    ["event-type"],
    getEventType,
    { refetchOnWindowFocus: false }
  );

  const {
    data: divisions,
    isLoading: divisionsIsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["divisions"],
    () => getAllDivision({ pageSize: 25, currentPage: 1, mode: 1 }),
    {
      select: (data) => {
        return data?.filter((item) => item?.status);
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("divisions > ", divisions);

  const {
    data: planningData,
    isLoading: planningIsLoading,
    isError: planningIsError,
  } = useQuery(["planning", contactId], () => getPlanByContact(contactId), {
    select: (data) => {
      return data?.plan
        ?.map((category) =>
          category?.items?.map((item, index) => ({
            itemId: item?.id,
            itemName: item?.itemName,
            itemDescription: item?.description,
            itemPriority: item?.priority,
            itemPlannedUnit: item?.plannedUnit,
            itemPlannedAmount: item?.plannedAmount,
            itemPlannedPrice: item?.plannedPrice,
          }))
        )
        .flat();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    planningData && setTaskList(planningData);
  }, [planningData]);

  // Create event after upload banner image
  const { mutate: createEventMutate, isLoading: createEventIsLoading } =
    useMutation((event) => createEvent(event), {
      onSuccess: (data, variables) => {
        notification.success({
          message: <p className="font-medium">Tạo sự kiện thành công</p>,
          placement: "topRight",
          duration: 3,
        });

        navigate(`/manager/event/${data}`, { replace: true });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  // Upload banner image
  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, event }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        variables.event = {
          ...variables.event,
          coverUrl: data.downloadUrl,
          listTask: taskList?.map((item) => ({
            title: item?.itemName,
            desc: JSON.stringify(item?.itemDescription?.ops),
            priority: item?.itemPriority,
            itemId: item?.itemId,
            itemPercentage: 80, // Tiền lơi
          })),
          listDivision: selectedDivision,
          contactId,
        };
        createEventMutate(variables.event);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải ảnh lên! Hãy thử lại sau",
        });
      },
    }
  );

  const toggleSelectTemplateTasks = () => {
    setSelectTemplateTasks((prev) => [...prev, 1]);
  };

  const setupEventValues = (values) => {
    return {
      eventName: values?.eventName,
      description: JSON.stringify(values?.description.ops),
      // ===========================================
      startDate: values?.processingDate,
      processingDate: values?.date?.[0],
      endDate: values?.date?.[1],
      // ===========================================
      location: values?.location,
      estBudget: +values?.estBudget,
      eventTypeId: values?.eventTypeId,
    };
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    if (current === 0) {
      setCurrent((prev) => prev + 1);
    } else {
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "event");
      const eventValues = setupEventValues(values);
      uploadFileMutate({
        formData,
        event: eventValues,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleUpdateDesc = (itemId, desc) => {
    setTaskList((prev) =>
      prev?.map((item) => {
        if (item?.itemId === itemId) {
          return { ...item, itemDescription: desc };
        } else {
          return item;
        }
      })
    );
  };

  const handleSelectDivision = (divisionId) => {
    if (selectedDivision?.includes(divisionId)) {
      setSelectedDivision((prev) =>
        prev?.filter((item) => item !== divisionId)
      );
    } else {
      setSelectedDivision((prev) => [...prev, divisionId]);
    }
  };

  const steps = [
    {
      key: 1,
      title: "Thông tin sự kiện",
      content: (
        <div className="">
          <div className="flex space-x-10">
            <Form.Item
              className="w-[30%]"
              label={<Title title="Tên sự kiện" />}
              name="eventName"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập tên sự kiện!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({ eventName: value.target.value });
              }}
            >
              <Input placeholder="Nhập tên sự kiện" size="large" />
            </Form.Item>
            <Form.Item
              className="w-[70%]"
              label={<Title title="Địa điểm" />}
              name="location"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập địa điểm!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({ location: value.target.value });
              }}
            >
              <Input placeholder="Nhập địa điểm" size="large" />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label={<Title title="Mô tả" />}
              name="description"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập mô tả!",
                },
              ]}
            >
              <ReactQuill
                className="h-36 mb-10"
                theme="snow"
                placeholder="Nhập mô tả"
                onChange={(content, delta, source, editor) => {
                  // Update to specific field
                  form.setFieldsValue({ description: editor.getContents() });
                }}
              />
            </Form.Item>
          </div>

          <div className="flex space-x-10">
            <Form.Item
              className="w-[35%]"
              label={<Title title="Ngày bắt đầu - kết thúc sự kiện" />}
              name="date"
              rules={[
                {
                  validator: (rule, value) => {
                    if (value && value?.[0] && value?.[1]) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Chưa chọn thời gian tổ chức");
                  },
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <RangePicker
                  size="large"
                  className="w-full"
                  defaultValue={[
                    dayjs(contactInfo?.startDate, "YYYY-MM-DD"),
                    dayjs(contactInfo?.endDate, "YYYY-MM-DD"),
                  ]}
                  onChange={(value) => {
                    // Update to specific field
                    form.setFieldsValue({
                      date: value?.map((item) =>
                        moment(item?.$d).format("YYYY-MM-DD")
                      ),
                    });

                    // Get date in range
                    const startDate = moment(value?.[0]?.$d);
                    const endDate = moment(value?.[1]?.$d);

                    // Get processing date in range
                    const selectedDate = moment(
                      form.getFieldValue("processingDate")?.$d
                    );

                    // Check if processing date is not in range  => reset processing date
                    if (
                      !selectedDate.isBetween(startDate, endDate, null, "[]") ||
                      !value
                    ) {
                      form.resetFields(["processingDate"]);
                    }
                  }}
                  disabledDate={(current) => {
                    return current && current < moment().startOf("day");
                  }}
                  format={"DD/MM/YYYY"}
                />
              </ConfigProvider>
            </Form.Item>

            <Form.Item
              className="w-[25%]"
              label={<Title title="Ngày bắt đầu dự án" />}
              name="processingDate"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn ngày bắt đầu!",
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <DatePicker
                  size="large"
                  defaultValue={dayjs(
                    contactInfo?.processingDate,
                    "YYYY-MM-DD"
                  )}
                  className="w-full"
                  onChange={(value) => {
                    form.setFieldsValue({
                      processingDate: moment(value?.$d).format("YYYY-MM-DD"),
                    });
                  }}
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue("date")?.[0];
                    const endDate = form.getFieldValue("date")?.[1];

                    if (!startDate && !endDate) {
                      return current && current < moment().startOf("day");
                    }

                    return (
                      current > moment(startDate, "YYYY-MM-DD")

                      //  || current > moment(endDate, "YYYY-MM-DD").endOf("day")
                    );
                  }}
                  format={"DD/MM/YYYY"}
                />
              </ConfigProvider>
            </Form.Item>

            <Form.Item
              className="flex-1"
              label={<Title title="Thể loại sự kiện" />}
              name="eventTypeId"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn thể loại sự kiện!",
                },
              ]}
            >
              <Select
                size="large"
                defaultValue={contactInfo?.eventTypeId}
                options={
                  eventType?.map((item) => ({
                    value: item?.id,
                    label: item?.typeName,
                  })) ?? []
                }
                loading={eventTypeIsLoading}
                placeholder="Chọn 1 thể loại"
              />
            </Form.Item>
          </div>

          <div className="flex space-x-10 items-center">
            <Form.Item
              className="w-[30%]"
              label={<Title title="Ngân sách ước lượng" />}
              name="estBudget"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập ngân sách!",
                },
              ]}
            >
              <div className="flex items-center gap-x-3">
                <InputNumber
                  size="large"
                  className="w-full"
                  defaultValue={contactInfo?.contractTotalBudget}
                  min={10000}
                  step={100000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => {
                    form.setFieldsValue({
                      estBudget: value.replace(/,/g, ""),
                    });
                    return `${value}`.replace(/,/g, "");
                  }}
                  onStep={(value) => {
                    form.setFieldsValue({ estBudget: value });
                  }}
                />
                <p className="text-base font-medium">VNĐ</p>
              </div>
            </Form.Item>

            <Form.Item
              className="flex-1"
              name="coverUrl"
              label={<Title title="Ảnh về sự kiện" />}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  required: true,
                  message: "Chưa chọn ảnh đại diện",
                },
                {
                  validator(_, fileList) {
                    return new Promise((resolve, reject) => {
                      if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                        reject("File quá lớn ( <10MB )");
                      } else {
                        resolve();
                      }
                    });
                  },
                },
              ]}
            >
              <Upload
                className="flex items-center space-x-3"
                maxCount={1}
                listType="picture"
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
                <p className="hover:text-black hover:border-black transition-colors border border-slate-200 rounded-2xl border-dashed px-5 py-5 text-slate-400">
                  Kéo tập tin vào đây
                </p>
              </Upload>
            </Form.Item>
          </div>

          <div className="flex justify-end mt-10 mb-5">
            <Button
              className=""
              onClick={() => form.submit()}
              size="large"
              type="primary"
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 2,
      title: "Danh sách hạng mục",
      content: (
        <>
          <div className="flex justify-between ">
            <div className="mb-10 flex items-center space-x-5">
              <Title title="Ngân sách" />
              <div className="text-lg text-slate-500 font-medium flex items-center space-x-2">
                <BsPiggyBank className="text-green-600 text-xl " />
                <p>{contactInfo?.contractTotalBudget.toLocaleString()} VNĐ</p>
              </div>
            </div>

            <Popconfirm
              title="Xác nhận thông tin sự kiện"
              description="Bạn có chắc chắn với các thông tin trên?"
              onConfirm={() => form.submit()}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" size="large">
                Tạo sự kiện
              </Button>
            </Popconfirm>
          </div>

          <div className="mb-10">
            <Title title="Bộ phận tham gia" />
            <div className="flex flex-wrap items-center mt-5 gap-x-3 gap-y-5">
              {divisions?.map((division) => (
                <div
                  onClick={() => handleSelectDivision(division?.id)}
                  className={clsx(
                    "flex items-center gap-x-2 px-5 py-2 rounded-full border cursor-pointer",
                    {
                      "border-blue-500": selectedDivision?.includes(
                        division?.id
                      ),
                    }
                  )}
                >
                  <FaUserFriends
                    size={20}
                    className={clsx("", {
                      "text-blue-500": selectedDivision?.includes(division?.id),
                      "text-slate-400": !selectedDivision?.includes(
                        division?.id
                      ),
                    })}
                  />
                  <p
                    className={clsx("text-sm font-medium", {
                      "text-blue-500": selectedDivision?.includes(division?.id),
                    })}
                  >
                    {division?.divisionName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="mb-10">
            <Title title="Hạng mục mẫu" />
            <div className="flex flex-wrap items-center mt-5">
              {!!selectTemplateTasks?.length &&
                selectTemplateTasks?.map((item) => (
                  <DefaultTemplateTask custom />
                ))}

              <div className="w-[45%] mx-[2.5%] flex justify-center items-center">
                <div
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-28 h-28 flex justify-center items-center border-dashed border-4 rounded-xl cursor-pointer border-slate-200 group hover:border-black/30 transition-colors"
                >
                  <FaPlus className="text-2xl text-slate-200 group-hover:text-black/30 transition-colors" />
                </div>
              </div>
            </div>
          </div> */}

          <div className="">
            <Title title="Hạng mục mặc định" />
            <div className="flex flex-wrap mt-5">
              {planningData?.map((item) => (
                <DefaultTemplateTask
                  key={item?.itemId}
                  isDefault
                  task={item}
                  handleUpdateDesc={handleUpdateDesc}
                />
              ))}
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <LockLoadingModal
        isModalOpen={uploadIsLoading || createEventIsLoading}
        label="Đang khởi tạo sự kiện ..."
      />

      <DrawerContainer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        toggleSelectTemplateTasks={toggleSelectTemplateTasks}
        messageApi={messageApi}
      />

      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to=".." relative="path">
            Sự kiện{" "}
          </Link>
          / Tạo mới
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white px-8 py-5 rounded-2xl mt-6"
      >
        <Spin
          spinning={
            contactInfoIsLoading || planningIsLoading || divisionsIsLoading
          }
        >
          {contactInfoIsLoading ? (
            <div className="h-[calc(100vh/2)]" />
          ) : (
            <div className="min-h-[calc(100vh*2/3)]">
              <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                initialValues={{
                  eventName: contactInfo?.eventName,
                  location: contactInfo?.location,
                  description: contactInfo?.description
                    ? {
                        ops: JSON.parse(
                          contactInfo?.description?.startsWith(`[{"`)
                            ? contactInfo?.description
                            : parseJson(contactInfo?.description)
                        ),
                      }
                    : null,
                  date: [
                    momenttz(contactInfo?.startDate).format("YYYY-MM-DD"),
                    momenttz(contactInfo?.endDate).format("YYYY-MM-DD"),
                  ],
                  estBudget: contactInfo?.contractTotalBudget ?? 0,
                  processingDate: contactInfo?.processingDate,
                  eventTypeId: contactInfo?.eventTypeId,
                }}
              >
                <Steps direction="horizontal" current={current} items={steps} />

                <div className="mt-8">{steps[current].content}</div>

                <div className="h-0 overflow-hidden">
                  <Form.Item
                    name="eventName"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập tên sự kiện!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập địa điểm!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập mô tả!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="date"
                    rules={[
                      {
                        validator: (rule, value) => {
                          if (value && value[0] && value[1]) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Chưa chọn thời gian tổ chức");
                        },
                      },
                    ]}
                  />
                  <Form.Item
                    name="processingDate"
                    rules={[
                      {
                        required: true,
                        message: "Chưa chọn ngày bắt đầu!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="eventTypeId"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập ngân sách!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="estBudget"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập ngân sách!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="coverUrl"
                    rules={[
                      {
                        required: true,
                        message: "Chưa chọn ảnh đại diện",
                      },
                      {
                        validator(_, fileList) {
                          return new Promise((resolve, reject) => {
                            if (
                              fileList &&
                              fileList[0]?.size > 10 * 1024 * 1024
                            ) {
                              reject("File quá lớn ( <10MB )");
                            } else {
                              resolve();
                            }
                          });
                        },
                      },
                    ]}
                  />
                </div>
              </Form>
            </div>
          )}
        </Spin>
      </motion.div>

      <FloatButton.BackTop />
    </Fragment>
  );
};

export default memo(EventCreationPage);
