import React, { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
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
import { updateCustomerContacts } from "../../apis/contact";
import { uploadFile } from "../../apis/files";
import { createContract } from "../../apis/contract";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";

const { RangePicker } = DatePicker;

const Title = ({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
);

const EventCreationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fileList, setFileList] = useState();
  const [current, setCurrent] = useState(0);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (location.state) {
      form.setFieldsValue({
        location: location.state?.location,
        estBudget: location.state?.estBudget ?? 500000,
        eventType: location.state?.eventType,
      });
    }
  }, []);

  const { data: eventType, isLoading: eventTypeIsLoading } = useQuery(
    ["event-type"],
    () => getEventType()
  );

  const { mutate: updateContactMutate, isLoading: updateContactIsLoading } =
    useMutation(
      () =>
        updateCustomerContacts({
          contactId: location.state.contactId,
          status: "ACCEPTED",
        }),
      {
        onSuccess: (data, variables) => {
          // TODO -> navigation
          messageApi.open({
            type: "success",
            content: "Tạo sự kiện thành công.",
          });
          form.resetFields();
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

  const { mutate: createContractMutate, isLoading: createContractIsLoading } =
    useMutation((eventId, contract) => createContract({ eventId, contract }), {
      onSuccess: (data, variables) => {
        updateContactMutate();
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const { mutate: createEventMutate, isLoading: createEventIsLoading } =
    useMutation((event, contract) => createEvent(event), {
      onSuccess: (data, variables) => {
        console.log("createEventMutate success > ", data);
        if (variables.contract) {
          createContractMutate(data.eventId, variables.contract);
        } else {
          // TODO -> navigation
          // messageApi.open({
          //   type: "success",
          //   content: "Tạo sự kiện thành công.",
          // });
          // form.resetFields();
          updateContactMutate();
        }
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, event, contract }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        variables.event = { coverUrl: data.downloadUrl, ...variables.event };
        createEventMutate(variables.event, variables.contract);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const setupEventValues = (values) => {
    return {
      eventName: values.eventName,
      description: JSON.stringify(values.description.ops),
      startDate: values.date[0],
      processingDate: values.processingDate,
      endDate: values.date[1],
      location: values.location,
      estBudget: +values.estBudget,
      eventTypeId: values.eventTypeId,
    };
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "event");

    const eventValues = setupEventValues(values);
    console.log("TRANSORM: ", eventValues);

    uploadFileMutate({
      formData,
      event: eventValues,
      contract: values.contract,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSubmitFormWithoutContract = () => {
    console.log("getFieldsValue > ", form.getFieldsValue());
    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "event");

    const eventValues = setupEventValues(form.getFieldsValue());
    console.log("TRANSORM: ", eventValues);

    uploadFileMutate({ formData, event: eventValues });
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
              <Input placeholder="Nhập tên sự kiện" />
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
              <Input placeholder="Nhập địa điểm" />
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
                  .then((values) => {})
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
              label={<Title title="Ngày bắt đầu - kết thúc dự án" />}
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
            >
              <ConfigProvider locale={viVN}>
                <RangePicker
                  className="w-full"
                  onChange={(value) => {
                    // Update to specific field
                    form.setFieldsValue({
                      date: value?.map((item) =>
                        moment(item.$d).format("YYYY-MM-DD")
                      ),
                    });

                    // Get date in range
                    const startDate = moment(value?.[0].$d);
                    const endDate = moment(value?.[1].$d);

                    // Get processing date in range
                    const selectedDate = moment(
                      form.getFieldValue("processingDate")?.$d
                    );

                    // Check if processing date is not in range  => reset processing date
                    if (
                      !selectedDate.isBetween(startDate, endDate, null, "[]")
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
              label={<Title title="Ngày diễn ra sự kiện" />}
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
                options={
                  eventType?.map((item) => ({
                    value: item.id,
                    label: item.typeName,
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
                <p className="text-base">VNĐ</p>
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
              listType="picture-card"
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

          <div className="flex justify-between mt-5">
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
              <Input placeholder="Nhập tên khách hàng" size="large" />
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
              <Input placeholder="Nhập email khách hàng" size="large" />
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
            <Input placeholder="Nhập địa chỉ khách hàng" size="large" />
          </Form.Item>

          <div className="flex space-x-10">
            <Form.Item
              className="w-1/2"
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
                  message: "CCCD / CMND cần phải có 12 số!",
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
                type="number"
                pattern="[0-9]*"
                maxLength={12}
                placeholder="Nhập CCCD / CMND"
                size="large"
              />
            </Form.Item>

            <Form.Item
              className="w-1/2"
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
                type="number"
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
                  type: "number",
                  min: 1,
                  message: "Giá trị hợp đồng không có hiệu lực!",
                },
              ]}
            >
              {/* <Input placeholder="Nhập giá trị hợp đồng" size="large" /> */}
              <div className="flex items-center gap-x-3">
                <InputNumber
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
                loading={eventTypeIsLoading}
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
            <div className="flex space-x-5">
              <Button
                size="large"
                type="primary"
                onClick={() => handleSubmitFormWithoutContract()}
              >
                Tạo sự kiện
              </Button>
              <Button size="large" type="primary" onClick={() => form.submit()}>
                Tạo sự kiện cùng hợp đồng
              </Button>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Fragment>
      {contextHolder}
      <LockLoadingModal
        isModalOpen={
          uploadIsLoading ||
          createEventIsLoading ||
          createContractIsLoading ||
          updateContactIsLoading
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
          initialValues={{ estBudget: 500000 }}
        >
          <Steps
            className=""
            direction="horizontal"
            current={current}
            items={steps}
          />

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
                      if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
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
      </motion.div>
    </Fragment>
  );
};

export default EventCreationPage;
