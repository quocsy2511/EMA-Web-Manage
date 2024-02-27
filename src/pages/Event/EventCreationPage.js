import React, { Fragment, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Spin,
  Steps,
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
import { createContract } from "../../apis/contract";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";
import {
  getCustomerContactDetail,
  updateCustomerContacts,
} from "../../apis/contact";
import dayjs from "dayjs";
import clsx from "clsx";

const { RangePicker } = DatePicker;

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const EventCreationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fileList, setFileList] = useState();
  const [current, setCurrent] = useState(0);

  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const { notification } = App.useApp();

  const { data: contactInfo, isLoading: contactInfoIsLoading } = useQuery(
    ["contact", location.state?.contactId],
    () => getCustomerContactDetail(location.state?.contactId),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("contactInfo > ", contactInfo);

  const { data: eventType, isLoading: eventTypeIsLoading } = useQuery(
    ["event-type"],
    () => getEventType(),
    { refetchOnWindowFocus: false }
  );

  const { mutate: updateContactMutate, isLoading: updateContactIsLoading } =
    useMutation(
      ({ contactId, status }) => updateCustomerContacts({ contactId, status }),
      {
        onSuccess: (data, variables) => {
          notification.success({
            message: <p className="font-medium">Tạo sự kiện thành công</p>,
            // description: "Hello, Ant Design!!",
            placement: "topRight",
            duration: 3,
          });
          navigate(-1);
        },
        onError: (error) => {
          messageApi.open({
            type: "error",
            content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
          });
        },
      }
    );

  // Create contract after create event
  const { mutate: createContractMutate, isLoading: createContractIsLoading } =
    useMutation(
      ({ eventId, contract }) => createContract({ eventId, contract }),
      {
        onSuccess: (data, variables) => {
          updateContactMutate({
            contactId: location.state?.contactId,
            status: "SUCCESS",
          });
        },
        onError: (error) => {
          messageApi.open({
            type: "error",
            content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
          });
        },
      }
    );

  // Create event after upload banner image
  const { mutate: createEventMutate, isLoading: createEventIsLoading } =
    useMutation(({ event, contract }) => createEvent(event), {
      onSuccess: (data, variables) => {
        createContractMutate({
          eventId: data?.split(" ")?.[0],
          contract: variables?.contract,
        });
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
    ({ formData, event, contract }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        console.log("variables upload > ", variables);
        variables.event = { coverUrl: data.downloadUrl, ...variables.event };
        createEventMutate({
          event: variables.event,
          contract: variables.contract,
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải ảnh lên! Hãy thử lại sau",
        });
      },
    }
  );

  const setupEventValues = (values) => {
    return {
      eventName: values?.eventName,
      description: JSON.stringify(values?.description.ops),
      startDate: values?.date?.[0],
      processingDate: values?.processingDate,
      endDate: values?.date?.[1],
      location: values?.location,
      estBudget: +values?.estBudget,
      eventTypeId: values?.eventTypeId,
    };
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "event");

    const eventValues = setupEventValues(values);

    const contractValues = {
      ...values.contract,
      contractValue: `${values.contract.contractValue}`,
      paymentDate: momenttz().format("YYYY-MM-DD"),
    };

    uploadFileMutate({
      formData,
      event: eventValues,
      contract: contractValues,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const steps = [
    {
      key: 1,
      title: "Thông tin cơ bản",
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

          <div className="flex justify-end mt-5">
            <Button
              className=""
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    setCurrent((prev) => prev + 1);
                  })
                  .catch((errorInfo) => {
                    console.log("Validation Fields:", errorInfo);
                    const values = errorInfo.values;
                    if (
                      !!values.eventName &&
                      !!values.location &&
                      !!values.description
                    ) {
                      setCurrent((prev) => prev + 1);
                    }
                  });
              }}
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
      title: "Thông tin chi tiết",
      content: (
        <>
          <div className="flex space-x-10">
            <Form.Item
              className="w-[40%]"
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
              className="w-[30%]"
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
                  defaultValue={
                    form.getFieldValue("processingDate")
                      ? dayjs(
                          form.getFieldValue("processingDate"),
                          "YYYY-MM-DD"
                        )
                      : null
                  }
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
                      current <
                        moment(startDate, "YYYY-MM-DD").startOf("day") ||
                      current > moment(endDate, "YYYY-MM-DD").endOf("day")
                    );
                  }}
                  format={"DD/MM/YYYY"}
                />
              </ConfigProvider>
            </Form.Item>
          </div>

          <div className="flex space-x-10">
            <Form.Item
              className="w-[40%]"
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
                  defaultValue={form.getFieldValue("estBudget")}
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
          </div>

          <Form.Item
            className="w-[20%]"
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
            <Upload.Dragger
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
              Kéo tập tin vào đây
            </Upload.Dragger>
          </Form.Item>

          <div
            className={clsx(
              "flex justify-between",
              { "mt-5": fileList },
              { "mt-10": !fileList }
            )}
          >
            <Button
              onClick={() => setCurrent((prev) => prev - 1)}
              size="large"
              type="default"
            >
              Quay lại
            </Button>
            <Button
              className=""
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    console.log("success > ", values);
                    setCurrent((prev) => prev + 1);
                  })
                  .catch((errorInfo) => {
                    console.log("Validation Fields:", errorInfo);
                    const values = errorInfo.values;
                    if (
                      !!values.date &&
                      !!values.processingDate &&
                      !!values.description &&
                      !!values.estBudget &&
                      !!values.coverUrl
                    ) {
                      setCurrent((prev) => prev + 1);
                    }
                  });
              }}
              size="large"
              type="primary"
            >
              Tiếp tục
            </Button>
          </div>
        </>
      ),
    },
    {
      key: 3,
      title: "Điều khoản hợp đồng",
      content: (
        <>
          <div className="flex space-x-10">
            <Form.Item
              className="w-1/2"
              label={<Title title="Tên khách hàng" />}
              // name="customerName"
              name={["contract", "customerName"]}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập tên khách hàng!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({
                  contract: { customerName: value.target.value },
                });
              }}
            >
              <Input disabled placeholder="Nhập tên khách hàng" size="large" />
            </Form.Item>

            <Form.Item
              className="w-1/2"
              label={<Title title="Email" />}
              // name="customerEmail"
              name={["contract", "customerEmail"]}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập email khách hàng!",
                },
                {
                  type: "email",
                  message: "Địa chỉ email không hợp lệ!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({
                  contract: { customerEmail: value.target.value },
                });
              }}
            >
              <Input
                disabled
                placeholder="Nhập email khách hàng"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            className="w-full"
            label={<Title title="Địa chỉ" />}
            // name="customerAddress"
            name={["contract", "customerAddress"]}
            rules={[
              {
                required: true,
                message: "Chưa nhập địa chỉ khách hàng!",
              },
            ]}
            onChange={(value) => {
              // Update to specific field
              form.setFieldsValue({
                contract: { customerAddress: value.target.value },
              });
            }}
          >
            <Input
              disabled
              placeholder="Nhập địa chỉ khách hàng"
              size="large"
            />
          </Form.Item>

          <div className="flex space-x-10">
            <Form.Item
              className="flex-1"
              label={<Title title="Căn cước công dân / Chứng minh nhân dân" />}
              // name="customerNationalId"
              name={["contract", "customerNationalId"]}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập CCCD / CMND!",
                },
                {
                  pattern: /^[0-9]{12}$/,
                  message: "CCCD / CMND cần bao gồm 12 số!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({
                  contract: { customerNationalId: value.target.value },
                });
              }}
            >
              <Input
                disabled
                pattern="[0-9]*"
                maxLength={12}
                placeholder="Nhập CCCD / CMND"
                size="large"
              />
            </Form.Item>

            <div className="w-[10%] rounded-lg overflow-hidden">
              <Image
                className="rounded-lg overflow-hidden"
                src={
                  contactInfo?.customerInfo?.nationalImages ??
                  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                }
              />
            </div>

            <Form.Item
              className="flex-1"
              label={<Title title="Số điện thoại" />}
              // name="customerPhoneNumber"
              name={["contract", "customerPhoneNumber"]}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập số điện thoại khách hàng!",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại cần phải có 10 số!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({
                  contract: { customerPhoneNumber: value.target.value },
                });
              }}
            >
              <Input
                disabled
                pattern="[0-9]*"
                maxLength={10}
                max={10}
                placeholder="Nhập số điện thoại khách hàng"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="flex space-x-10">
            <Form.Item
              className="w-[30%]"
              label={<Title title="Giá trị hợp đồng" />}
              name={["contract", "contractValue"]}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập giá trị hợp đồng!",
                },
                {
                  pattern: /^[0-9,]*$/,
                  message: "Giá trị hợp đồng không có hiệu lực!!",
                },
              ]}
            >
              {/* <Input placeholder="Nhập giá trị hợp đồng" size="large" /> */}
              <div className="flex items-center gap-x-3">
                <InputNumber
                  size="large"
                  value={form.getFieldsValue().contract?.contractValue}
                  className="w-full"
                  placeholder="Nhập giá trị hợp đồng"
                  min={0}
                  step={100000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => {
                    form.setFieldsValue({
                      contract: { contractValue: +value.replace(/,/g, "") },
                    });
                    return `${value}`.replace(/,/g, "");
                  }}
                  onStep={(value) => {
                    form.setFieldsValue({
                      contract: { contractValue: +value },
                    });
                  }}
                />
                <p className="text-base">VNĐ</p>
              </div>
            </Form.Item>
            <Form.Item
              className="w-[30%]"
              label={<Title title="Hình thức thanh toán" />}
              // name="paymentMethod"
              name={["contract", "paymentMethod"]}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập hình thức thanh toán!",
                },
              ]}
              onChange={(value) => {
                // Update to specific field
                form.setFieldsValue({
                  contract: { paymentMethod: value.target.value },
                });
              }}
            >
              <Select
                options={[
                  {
                    value: "Tiền Mặt",
                    label: "Tiền Mặt",
                  },
                  {
                    value: "Chuyển Khoản",
                    label: "Chuyển Khoản",
                  },
                ]}
                placeholder="Chọn hình thức thanh toán"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="flex justify-between mt-5">
            <Button
              onClick={() => setCurrent((prev) => prev - 1)}
              size="large"
              type="default"
            >
              Quay lại
            </Button>

            <Button size="large" type="primary" onClick={() => form.submit()}>
              Tạo sự kiện
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <LockLoadingModal
        isModalOpen={
          uploadIsLoading ||
          createEventIsLoading ||
          createContractIsLoading ||
          createContractIsLoading
        }
        label="Đang khởi tạo sự kiện ..."
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
        className="bg-white p-8 rounded-2xl mt-6"
      >
        <Spin spinning={contactInfoIsLoading}>
          {contactInfoIsLoading ? (
            <div className="h-[calc(100vh/2)]" />
          ) : (
            <div className="min-h-[calc(100vh/2)]">
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
                  location: contactInfo?.address,
                  description: contactInfo?.note
                    ? {
                        ops: JSON.parse(
                          contactInfo?.note?.startsWith(`[{"insert":"`)
                            ? contactInfo?.note
                            : parseJson(contactInfo?.note)
                        ),
                      }
                    : null,
                  date: [contactInfo?.startDate, contactInfo?.endDate],
                  eventTypeId: location.state?.eventType,
                  estBudget: contactInfo?.budget ?? 0,
                  contract: {
                    customerName: contactInfo?.customerInfo?.fullName,
                    customerEmail: contactInfo?.customerInfo?.email,
                    customerAddress: contactInfo?.customerInfo?.address,
                    customerNationalId: contactInfo?.customerInfo?.nationalId,
                    customerPhoneNumber: contactInfo?.customerInfo?.phoneNumber,
                  },
                }}
              >
                <Steps direction="horizontal" current={current} items={steps} />

                <div className="mt-10">{steps[current].content}</div>

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

                  <Form.Item
                    // name="customerName"
                    name={["contract", "customerName"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập tên khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerNationalId"
                    name={["contract", "customerNationalId"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập CCCD / CMND!",
                      },
                      {
                        pattern: /^[0-9]{12}$/,
                        message: "CCCD / CMND cần phải có 12 số!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerAddress"
                    name={["contract", "customerAddress"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập địa chỉ khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerEmail"
                    name={["contract", "customerEmail"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập email khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerPhoneNumber"
                    name={["contract", "customerPhoneNumber"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập số điện thoại khách hàng!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại cần phải có 10 số!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="contractValue"
                    name={["contract", "contractValue"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập giá trị hợp đồng khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="paymentMethod"
                    name={["contract", "paymentMethod"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập hình thức thanh toán!",
                      },
                    ]}
                  />
                </div>
              </Form>
            </div>
          )}
        </Spin>
      </motion.div>
    </Fragment>
  );
};

export default memo(EventCreationPage);
