import React, { Fragment, memo, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import momenttz from "moment-timezone";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCustomerContactDetail } from "../../apis/contact";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  FloatButton,
  Form,
  Image,
  Input,
  Popconfirm,
  Select,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import { getEventType } from "../../apis/events";
import { createContractToCustomer } from "../../apis/contract";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";

const { RangePicker } = DatePicker;

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const ContractPage = () => {
  const location = useLocation();
  const contactId = location.state?.contactId;

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { message: messageApp } = App.useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { data: contactInfo, isLoading: contactInfoIsLoading } = useQuery(
    ["contact", contactId],
    () => getCustomerContactDetail(contactId),
    {
      select: (data) => {
        return {
          ...data,
          startDate: momenttz(data?.startDate).format("YYYY-MM-DD"),
          endDate: momenttz(data?.endDate).format("YYYY-MM-DD"),
        };
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("contactInfo > ", contactInfo);

  const { data: eventType, isLoading: eventTypeIsLoading } = useQuery(
    ["event-type"],
    getEventType
  );

  const { mutate: createContractMutate, isLoading: createContractIsLoading } =
    useMutation(
      ({ customerContactId, contract }) =>
        createContractToCustomer({ customerContactId, contract }),
      {
        onSuccess: (data) => {
          messageApp.open({
            type: "success",
            content: "Đã tạo hợp đồng thành công",
          });

          navigate("/manager/customer", {
            replace: true,
            state: { isSuccess: true },
          });
        },
        onError: (err) => {
          console.log("erorr > ", err);
          messageApi.open({
            type: "error",
            content: "Không thể tạo hợp đồng lúc này! Hãy thử lại sau",
          });
        },
      }
    );

  const setupEventValues = (values) => {
    return {
      eventName: values?.eventName,
      // ===========================================
      startDate: values?.processingDate,
      processingDate: values?.date?.[0],
      endDate: values?.date?.[1],
      // ===========================================
      location: values?.location,
      eventTypeId: values?.eventTypeId,
    };
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const eventValues = setupEventValues(values);

    const contractValues = {
      ...values.contract,
      ...eventValues,
      paymentDate: momenttz().format("YYYY-MM-DD"),
    };
    console.log("contractValues > ", contractValues);

    createContractMutate({
      customerContactId: contactId,
      contract: contractValues,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: "smooth" });

    errorInfo?.errorFields?.map((item) =>
      messageApi.open({
        type: "error",
        content: item?.errors?.[0],
      })
    );
  };

  if (contactInfoIsLoading)
    return (
      <div className="bg-white rounded-2xl flex flex-col items-center justify-center h-[75vh] space-y-3">
        <Spin size="large" />
        <p className="text-lg font-medium">
          Đang lấy thông tin dữ liệu khách hàng ...
        </p>
      </div>
    );

  return (
    <Fragment>
      {contextHolder}

      <LockLoadingModal
        isModalOpen={createContractIsLoading}
        label="Đang tạo hợp đồng và gửi cho khách hàng ..."
      />

      <motion.div
        initial={{ x: -75 }}
        animate={{ x: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to="../.." relative="path">
            Thông tin khách hàng{" "}
          </Link>
          /{" "}
          <Link to=".." state={{ contactId }} relative="path">
            Lên kế hoạch
          </Link>{" "}
          / Tạo hợp đồng
        </p>
      </motion.div>

      <motion.div
        initial={{ x: -75 }}
        animate={{ x: 0 }}
        className="bg-white mt-8 mb-20 px-10 py-5 rounded-2xl"
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
          initialValues={{
            location: contactInfo?.address,
            description: contactInfo?.note
              ? {
                  ops: JSON.parse(
                    contactInfo?.note?.startsWith(`[{"`)
                      ? contactInfo?.note
                      : parseJson(contactInfo?.note)
                  ),
                }
              : null,
            date: [
              momenttz(contactInfo?.startDate).format("YYYY-MM-DD"),
              momenttz(contactInfo?.endDate).format("YYYY-MM-DD"),
            ],
            eventTypeId: contactInfo?.eventType,
            contract: {
              customerName: contactInfo?.customerInfo?.fullName,
              customerEmail: contactInfo?.customerInfo?.email,
              customerAddress: contactInfo?.customerInfo?.address,
              customerNationalId: contactInfo?.customerInfo?.nationalId,
              customerPhoneNumber: contactInfo?.customerInfo?.phoneNumber,
              paymentMethod: "Chuyển Khoản",
            },
          }}
        >
          <>
            <div className="flex items-center space-x-5 pb-5">
              <div className="w-[3%] h-[0.5px] bg-black/10" />
              <p className="text-3xl font-medium">Thông tin khách hàng</p>
              <div className="flex-1 h-[0.5px] bg-black/10" />
            </div>
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

            <div className="flex space-x-10 items-center">
              <Form.Item
                className="w-1/3"
                label={
                  <div className="flex space-x-3 items-center">
                    <Title title="CCCD / CMND" />
                    <div className="relative group">
                      <MdOutlineRemoveRedEye className="text-xl group-hover:text-blue-500 transition-colors cursor-pointer" />
                      <div className="absolute top-0 bottom-0 right-0 left-0 opacity-0">
                        <Image
                          className="rounded-lg overflow-hidden"
                          src={
                            contactInfo?.customerInfo?.nationalImages ??
                            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                          }
                        />
                      </div>
                    </div>
                  </div>
                }
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

              <Form.Item
                className="w-1/3"
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

              <Form.Item
                className="w-1/3"
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
          </>

          <>
            <div className="flex items-center space-x-5 py-7 mt-14">
              <div className="w-[3%] h-[0.5px] bg-black/10" />
              <p className="text-3xl font-medium">Thông tin sự kiện</p>
              <div className="flex-1 h-[0.5px] bg-black/10" />
            </div>

            <div className="">
              <div className="flex space-x-10">
                <Form.Item
                  className="w-[35%]"
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
                  className="w-[65%]"
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
                            momenttz(item?.$d).format("YYYY-MM-DD")
                          ),
                        });

                        // Get date in range
                        const startDate = momenttz(value?.[0]?.$d);
                        const endDate = momenttz(value?.[1]?.$d);

                        // Get processing date in range
                        const selectedDate = momenttz(
                          form.getFieldValue("processingDate")?.$d
                        );

                        // Check if processing date is not in range  => reset processing date
                        if (
                          !selectedDate.isBetween(
                            startDate,
                            endDate,
                            null,
                            "[]"
                          ) ||
                          !value
                        ) {
                          form.resetFields(["processingDate"]);
                        }
                      }}
                      disabledDate={(current) => {
                        return current && current < momenttz().startOf("day");
                      }}
                      format={"DD/MM/YYYY"}
                    />
                  </ConfigProvider>
                </Form.Item>

                <Form.Item
                  className="flex-1"
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
                          processingDate: momenttz(value?.$d).format(
                            "YYYY-MM-DD"
                          ),
                        });
                      }}
                      disabledDate={(current) => {
                        const startDate = form.getFieldValue("date")?.[0];
                        const endDate = form.getFieldValue("date")?.[1];

                        if (!startDate && !endDate) {
                          return current && current < momenttz().startOf("day");
                        }

                        return (
                          (current && current < momenttz().startOf("day")) ||
                          current >
                            momenttz(startDate, "YYYY-MM-DD")
                              .add(1, "day")
                              .startOf("day")
                        );
                      }}
                      format={"DD/MM/YYYY"}
                    />
                  </ConfigProvider>
                </Form.Item>

                <Form.Item
                  className="w-1/3"
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
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </>

          <div className="text-center mt-8 mb-6">
            <Popconfirm
              title="Bạn đã chắc chắn với các thông tin trên ?"
              description={
                <p>
                  Các thông tin trên sẽ được đưa vào hợp đồng <br /> và gửi cho
                  khách hàng
                </p>
              }
              onConfirm={() => form.submit()}
              okText="Có"
              cancelText="Không"
              placement="top"
            >
              <Button size="large" type="primary">
                Tạo hợp đồng
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </motion.div>

      <FloatButton.BackTop />
    </Fragment>
  );
};

export default memo(ContractPage);
