import { useMutation, useQuery } from "@tanstack/react-query";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  FloatButton,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import momenttz from "moment-timezone";
import React, { Fragment, memo, useEffect, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCustomerContactDetail } from "../../apis/contact";
import {
  createContractToCustomer,
  reCreateContract,
  updateContractToCustomer,
} from "../../apis/contract";
import { getEventType } from "../../apis/events";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";

const { RangePicker } = DatePicker;

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const ContractPage = () => {
  const location = useLocation();
  const { contactId, hasContract, readOnly, totalContract } =
    location.state ?? {};

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { message: messageApp } = App.useApp();
  const [totalContractValue] = useState(totalContract ?? 0);
  const [usedTotalContractValue, setUsedTotalContractValue] = useState(0);
  const [numOfContractValue, setNumOfContractValue] = useState(0);

  const { data: contactInfo, isLoading: contactInfoIsLoading } = useQuery(
    ["contact", contactId],
    () => getCustomerContactDetail(contactId),
    {
      // select: (data) => {
      //   return {
      //     ...data,
      //     startDate: momenttz(data?.startDate).format("YYYY-MM-DD"),
      //     endDate: momenttz(data?.endDate).format("YYYY-MM-DD"),
      //   };
      // },
      refetchOnWindowFocus: false,
    }
  );
  console.log("contactInfo > ", contactInfo);

  useEffect(() => {
    if (contactInfo?.contract) {
      console.log(
        "contactInfo?.contract?.paymentMilestone > ",
        contactInfo?.contract?.paymentMilestone
      );
      setUsedTotalContractValue(
        contactInfo?.contract?.paymentMilestone?.reduce(
          (total, item) => total + item?.amount,
          0
        ) || 0
      );
      setNumOfContractValue(contactInfo?.contract?.paymentMilestone?.length);
    }
  }, [contactInfo?.contract]);

  const { data: eventType, isLoading: eventTypeIsLoading } = useQuery(
    ["event-type"],
    getEventType,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: createContractMutate, isLoading: createContractIsLoading } =
    useMutation(
      ({ customerContactId, contract }) =>
        createContractToCustomer({ customerContactId, contract }),
      {
        onSuccess: (data) => {
          messageApp.open({
            type: "success",
            content: "Đã tạo hợp đồng thành công.",
          });

          navigate("/manager/customer", {
            replace: true,
            state: { isSuccess: true },
          });
        },
        onError: (err) => {
          messageApi.open({
            type: "error",
            content: "Không thể tạo hợp đồng lúc này! Hãy thử lại sau",
          });
        },
      }
    );

  const { mutate: updateContractMutate, isLoading: updateContractIsLoading } =
    useMutation(
      ({ contractId, contract }) =>
        updateContractToCustomer({ contractId, contract }),
      {
        onSuccess: (data) => {
          reCreateContractMutate(contactId);
        },
        onError: (err) => {
          messageApi.open({
            type: "error",
            content: "Không thể tạo hợp đồng lúc này! Hãy thử lại sau",
          });
        },
      }
    );

  const {
    mutate: reCreateContractMutate,
    isLoading: reCreateContractIsLoading,
  } = useMutation((customerContactId) => reCreateContract(customerContactId), {
    onSuccess: (data) => {
      messageApp.open({
        type: "success",
        content: "Đã cập nhật lại hợp đồng thành công.",
      });

      navigate("/manager/customer", {
        replace: true,
        state: { isSuccess: true },
      });
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        content: "Không thể tạo hợp đồng lúc này! Hãy thử lại sau",
      });
    },
  });

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

      paymentMilestone: values?.["payment-rules"]?.map((item) => ({
        name: item?.title,
        startDate: item?.date?.[0],
        endDate: item?.date?.[1],
        amount: item?.value,
      })),
    };
  };

  const onFinish = (values) => {
    console.log("Onfinish > ", values);
    const eventValues = setupEventValues(values);

    const contractValues = {
      ...values.contract,
      ...eventValues,
      paymentDate: momenttz().format("YYYY-MM-DD"),
    };
    console.log(contractValues);

    if (!hasContract) {
      createContractMutate({
        customerContactId: contactId,
        contract: contractValues,
      });
    } else {
      updateContractMutate({
        contractId: hasContract?.id,
        contract: contractValues,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
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
        isModalOpen={
          createContractIsLoading ||
          updateContractIsLoading ||
          reCreateContractIsLoading
        }
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
        className="bg-white mt-8 mb-20 px-10 py-10 rounded-2xl relative overflow-hidden"
      >
        {readOnly && (
          <div className="absolute top-0 bottom-0 right-0 left-0 bg-slate-200/10 z-10" />
        )}
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
            eventName: contactInfo?.contract
              ? contactInfo?.contract?.eventName
              : hasContract
              ? hasContract?.eventName
              : null,
            processingDate: contactInfo?.contract
              ? contactInfo?.contract?.startDate
              : hasContract
              ? hasContract?.processingDate
              : null,
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
            "payment-rules": contactInfo?.contract?.paymentMilestone?.map(
              (item) => ({
                title: item?.name,
                date: [
                  momenttz(item?.startDate, "YYYY-MM-DD HH:mm:ss").format(
                    "YYYY-MM-DD"
                  ),
                  momenttz(item?.endDate, "YYYY-MM-DD HH:mm:ss").format(
                    "YYYY-MM-DD"
                  ),
                ],
                value: item?.amount,
              })
            ),
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
            <div className="flex items-center space-x-5 py-7 mt-8">
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
                  <Input placeholder="Nhập địa điểm" size="large" disabled />
                </Form.Item>
              </div>

              <div className="flex space-x-10">
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
                        contactInfo?.contract
                          ? dayjs(
                              contactInfo?.contract?.startDate,
                              "YYYY-MM-DD"
                            )
                          : hasContract
                          ? dayjs(hasContract?.processingDate, "YYYY-MM-DD")
                          : form.getFieldValue("processingDate")
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

                        if (!startDate) {
                          return (
                            current && current < momenttz().subtract(1, "day")
                          );
                        }

                        return (
                          current &&
                          (current < momenttz().subtract(1, "day") ||
                            current > momenttz(startDate, "YYYY-MM-DD"))
                        );
                      }}
                      format={"DD/MM/YYYY"}
                    />
                  </ConfigProvider>
                </Form.Item>

                <Form.Item
                  className="w-[40%] relative cursor-not-allowed"
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
                      disabled
                      size="large"
                      className="w-full"
                      defaultValue={[
                        dayjs(contactInfo?.startDate),
                        dayjs(contactInfo?.endDate),
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
                  <div className="absolute top-0 right-0 bottom-0 left-0" />
                </Form.Item>

                <Form.Item
                  className="w-1/3 relative cursor-not-allowed"
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
                    value={
                      eventType.find(
                        (item) => item?.id === contactInfo?.eventType
                      )?.id
                    }
                    options={
                      eventType?.map((item) => ({
                        value: item?.id,
                        label: item?.typeName,
                      })) ?? []
                    }
                    loading={eventTypeIsLoading}
                    placeholder="Chọn 1 thể loại"
                  />

                  <div className="absolute top-0 right-0 bottom-0 left-0" />
                </Form.Item>
              </div>
            </div>
          </>

          <>
            <div className="flex items-center space-x-5 pb-5 mt-14">
              <div className="w-[3%] h-[0.5px] bg-black/10" />
              <p className="text-3xl font-medium">Điều khoản thanh toán</p>
              <div className="flex-1 h-[0.5px] bg-black/10" />
            </div>

            <p className="text-lg mb-4">
              Tổng :{" "}
              <span className="text-2xl font-semibold">
                {(usedTotalContractValue ?? 0).toLocaleString()} /{" "}
                {(totalContractValue ?? 0).toLocaleString()} VNĐ
              </span>
            </p>

            <Form.List name="payment-rules" className="w-1/2">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    return (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label={key === 0 && <Title title="Tên thời hạn" />}
                          name={[name, "title"]}
                          rules={[
                            {
                              required: true,
                              message: "Chưa điền tên thời hạn",
                            },
                          ]}
                          initialValue={
                            key === 0
                              ? "Đặt cọc"
                              : key === 1
                              ? "Đợt 1"
                              : key === 2 && "Đợt 2"
                          }
                        >
                          <Input placeholder="Tên thời hạn" size="large" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={key === 0 && <Title title="Thời hạn" />}
                          name={[name, "date"]}
                          rules={[
                            {
                              required: true,
                              message: "Chọn ngày thực hiện và kết thúc !",
                            },
                            {
                              validator: (_, value) => {
                                if (value && value?.[0] && value?.[1]) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  "Vui lòng chọn khoảng thời gian thực hiện."
                                );
                              },
                            },
                          ]}
                        >
                          <ConfigProvider locale={viVN}>
                            <RangePicker
                              size="large"
                              defaultValue={
                                contactInfo?.contract?.paymentMilestone &&
                                key === 0 &&
                                contactInfo?.contract?.paymentMilestone
                                  ?.length >= 1
                                  ? [
                                      dayjs(
                                        contactInfo?.contract
                                          ?.paymentMilestone?.[0]?.startDate,
                                        "YYYY-MM-DD"
                                      ),
                                      dayjs(
                                        contactInfo?.contract
                                          ?.paymentMilestone?.[0]?.endDate,
                                        "YYYY-MM-DD"
                                      ),
                                    ]
                                  : key === 1 &&
                                    contactInfo?.contract?.paymentMilestone
                                      ?.length >= 2
                                  ? [
                                      dayjs(
                                        contactInfo?.contract
                                          ?.paymentMilestone?.[1]?.startDate,
                                        "YYYY-MM-DD"
                                      ),
                                      dayjs(
                                        contactInfo?.contract
                                          ?.paymentMilestone?.[1]?.endDate,
                                        "YYYY-MM-DD"
                                      ),
                                    ]
                                  : key === 2 &&
                                    contactInfo?.contract?.paymentMilestone
                                      ?.length >= 3 && [
                                      dayjs(
                                        contactInfo?.contract
                                          ?.paymentMilestone?.[2]?.startDate,
                                        "YYYY-MM-DD"
                                      ),
                                      dayjs(
                                        contactInfo?.contract
                                          ?.paymentMilestone?.[2]?.endDate,
                                        "YYYY-MM-DD"
                                      ),
                                    ]
                              }
                              onChange={(value) => {
                                const dates =
                                  form.getFieldValue("payment-rules");
                                if (
                                  dates &&
                                  dates?.length > 0 &&
                                  dates?.[0] !== undefined
                                ) {
                                  if (dates?.[key]) {
                                    dates[key].date = value?.map((item) =>
                                      momenttz(item?.$d).format("YYYY-MM-DD")
                                    );

                                    form.setFieldsValue({
                                      ["payment-rules"]: dates,
                                    });
                                  } else {
                                    dates[key] = {
                                      date: [
                                        {
                                          date: value?.map((item) =>
                                            momenttz(item?.$d).format(
                                              "YYYY-MM-DD"
                                            )
                                          ),
                                        },
                                      ],
                                    };

                                    form.setFieldsValue({
                                      ["payment-rules"]: dates,
                                    });
                                  }
                                } else {
                                  form.setFieldsValue({
                                    ["payment-rules"]: [
                                      {
                                        date: value?.map((item) =>
                                          momenttz(item?.$d).format(
                                            "YYYY-MM-DD"
                                          )
                                        ),
                                      },
                                    ],
                                  });
                                }

                                const currentMaxNum = numOfContractValue - 1;

                                switch (key) {
                                  case 0:
                                    if (key + 1 <= currentMaxNum) {
                                      const tem = currentMaxNum - key;
                                      if (tem === 1) {
                                        form.resetFields([
                                          ["payment-rules", 1, "date"],
                                        ]);
                                      }
                                      if (tem === 2) {
                                        form.resetFields([
                                          ["payment-rules", 1, "date"],
                                        ]);
                                        form.resetFields([
                                          ["payment-rules", 2, "date"],
                                        ]);
                                      }
                                    }
                                    break;
                                  case 1:
                                    if (key + 1 <= currentMaxNum) {
                                      form.resetFields([
                                        ["payment-rules", 2, "date"],
                                      ]);
                                    }
                                    break;

                                  default:
                                    break;
                                }
                              }}
                              disabledDate={(current) => {
                                const endDate = momenttz(
                                  contactInfo?.endDate,
                                  "YYYY-MM-DD"
                                );
                                switch (key) {
                                  case 0:
                                    return (
                                      current &&
                                      (current <
                                        momenttz().subtract(1, "day") ||
                                        current > endDate)
                                    );

                                  case 1:
                                    const endDate1 = form.getFieldValue([
                                      "payment-rules",
                                      0,
                                      "date",
                                    ]);
                                    return (
                                      current &&
                                      (current <=
                                        momenttz(
                                          endDate1?.[1],
                                          "YYYY-MM-DD"
                                        ).add(1, "day") ||
                                        current > endDate)
                                    );

                                  case 2:
                                    const endDate2 = form.getFieldValue([
                                      "payment-rules",
                                      1,
                                      "date",
                                    ]);
                                    return (
                                      current &&
                                      (current <=
                                        momenttz(
                                          endDate2?.[1],
                                          "YYYY-MM-DD"
                                        ).add(1, "day") ||
                                        current > endDate)
                                    );

                                  default:
                                    return (
                                      current &&
                                      (current <
                                        momenttz().subtract(1, "day") ||
                                        current > endDate)
                                    );
                                }
                              }}
                              format={"DD/MM/YYYY"}
                              className="w-full"
                            />
                          </ConfigProvider>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={
                            key === 0 && (
                              <Title title="Khoản thanh toán (VNĐ)" />
                            )
                          }
                          name={[name, "value"]}
                          rules={[
                            {
                              required: true,
                              message: "Bắt buộc",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Giá trị không hợp lệ!",
                            },
                          ]}
                        >
                          <InputNumber
                            size="large"
                            className="w-full"
                            placeholder="Nhập giá trị hợp đồng"
                            min={0}
                            max={
                              key === 0
                                ? totalContractValue -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    1,
                                    "value",
                                  ]) ?? 0) -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    2,
                                    "value",
                                  ]) ?? 0)
                                : key === 1
                                ? totalContractValue -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    0,
                                    "value",
                                  ]) ?? 0) -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    2,
                                    "value",
                                  ]) ?? 0)
                                : key === 2
                                ? totalContractValue -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    0,
                                    "value",
                                  ]) ?? 0) -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    1,
                                    "value",
                                  ]) ?? 0)
                                : null
                            }
                            step={100000}
                            defaultValue={
                              key === 0
                                ? totalContractValue
                                : key === 1
                                ? totalContractValue -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    0,
                                    "value",
                                  ]) ?? 0)
                                : key === 2
                                ? totalContractValue -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    0,
                                    "value",
                                  ]) ?? 0) -
                                  (form.getFieldValue([
                                    "payment-rules",
                                    1,
                                    "value",
                                  ]) ?? 0)
                                : undefined
                            }
                            onChange={(value) => {
                              form.setFieldsValue({
                                [["payment-rules", key, "value"]]: value,
                              });

                              switch (key) {
                                case 0:
                                  setUsedTotalContractValue(value ?? 0);

                                  if (numOfContractValue === 2)
                                    form.resetFields([
                                      ["payment-rules", 1, "value"],
                                    ]);
                                  if (numOfContractValue === 3) {
                                    form.resetFields([
                                      ["payment-rules", 1, "value"],
                                    ]);
                                    form.resetFields([
                                      ["payment-rules", 2, "value"],
                                    ]);
                                  }
                                  break;
                                case 1:
                                  setUsedTotalContractValue(
                                    (value ?? 0) +
                                      (form.getFieldValue([
                                        "payment-rules",
                                        0,
                                        "value",
                                      ]) ?? 0)
                                  );
                                  if (numOfContractValue === 3)
                                    form.resetFields([
                                      ["payment-rules", 2, "value"],
                                    ]);
                                  break;
                                case 2:
                                  setUsedTotalContractValue(
                                    (value ?? 0) +
                                      (form.getFieldValue([
                                        "payment-rules",
                                        0,
                                        "value",
                                      ]) ?? 0) +
                                      (form.getFieldValue([
                                        "payment-rules",
                                        1,
                                        "value",
                                      ]) ?? 0)
                                  );
                                  break;

                                default:
                                  break;
                              }
                            }}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => {
                              form.setFieldsValue({
                                contract: {
                                  contractValue: +value.replace(/,/g, ""),
                                },
                              });
                              return `${value}`.replace(/,/g, "");
                            }}
                            onStep={(value) => {
                              form.setFieldsValue({
                                contractValue: +value,
                              });
                            }}
                          />
                        </Form.Item>
                      </Space>
                    );
                  })}
                  {numOfContractValue < 3 && (
                    <Form.Item className="w-fit">
                      <Button
                        type="default"
                        onClick={() => {
                          const formValue = form.getFieldValue("payment-rules");

                          if (numOfContractValue === 0) {
                            if (
                              totalContractValue - usedTotalContractValue ===
                              0
                            ) {
                              messageApi.open({
                                type: "error",
                                content: "Đã sử dụng hết khoản chi",
                              });
                            } else {
                              add();
                              form.setFieldsValue({
                                [["payment-rules", 0, "value"]]:
                                  totalContractValue,
                              });
                              form.setFieldsValue({
                                [["payment-rules", 0, "title"]]: "Đặt cọc",
                              });
                              setNumOfContractValue((prev) => prev + 1);
                              setUsedTotalContractValue(totalContractValue);
                            }
                          } else if (numOfContractValue === 1) {
                            if (
                              formValue?.[0]?.title &&
                              formValue?.[0]?.date &&
                              formValue?.[0]?.value &&
                              totalContractValue - usedTotalContractValue !== 0
                            ) {
                              add();
                              setNumOfContractValue((prev) => prev + 1);
                              form.setFieldsValue({
                                [["payment-rules", 1, "value"]]:
                                  totalContractValue -
                                  form.getFieldValue([
                                    "payment-rules",
                                    0,
                                    "value",
                                  ]),
                              });
                              form.setFieldsValue({
                                [["payment-rules", 0, "title"]]: "Đợt 1",
                              });
                              setUsedTotalContractValue(totalContractValue);
                            } else if (
                              totalContractValue - usedTotalContractValue ===
                              0
                            ) {
                              messageApi.open({
                                type: "error",
                                content: "Đã sử dụng hết khoản chi !",
                              });
                            } else {
                              messageApi.open({
                                type: "error",
                                content: "Hãy điền đủ thông tin trước !",
                              });
                            }
                          } else if (numOfContractValue === 2) {
                            if (
                              formValue?.[0]?.title &&
                              formValue?.[0]?.date &&
                              formValue?.[0]?.value &&
                              formValue?.[1]?.title &&
                              formValue?.[1]?.date &&
                              formValue?.[1]?.value &&
                              totalContractValue - usedTotalContractValue !== 0
                            ) {
                              add();
                              setNumOfContractValue((prev) => prev + 1);
                              form.setFieldsValue({
                                [["payment-rules", 2, "value"]]:
                                  totalContractValue -
                                  form.getFieldValue([
                                    "payment-rules",
                                    0,
                                    "value",
                                  ]) -
                                  form.getFieldValue([
                                    "payment-rules",
                                    1,
                                    "value",
                                  ]),
                              });
                              form.setFieldsValue({
                                [["payment-rules", 0, "title"]]: "Đợt 2",
                              });
                              setUsedTotalContractValue(totalContractValue);
                            } else if (
                              totalContractValue - usedTotalContractValue ===
                              0
                            ) {
                              messageApi.open({
                                type: "error",
                                content: "Đã sử dụng hết khoản chi !",
                              });
                            } else {
                              messageApi.open({
                                type: "error",
                                content: "Hãy điền đủ thông tin trước !",
                              });
                            }
                          }
                        }}
                        block
                      >
                        Thêm đợt
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </>

          {!readOnly && (
            <div className="text-center mt-8 mb-6">
              <Popconfirm
                title="Bạn đã chắc chắn với các thông tin trên ?"
                description={
                  <p>
                    Các thông tin trên sẽ được đưa vào hợp đồng <br /> và gửi
                    cho khách hàng
                  </p>
                }
                onConfirm={() => form.submit()}
                okText="Có"
                cancelText="Không"
                placement="top"
                disabled={
                  usedTotalContractValue !== totalContractValue ||
                  numOfContractValue === 0
                }
              >
                <Button
                  size="large"
                  type={
                    usedTotalContractValue !== totalContractValue ||
                    numOfContractValue === 0
                      ? "default"
                      : "primary"
                  }
                  disabled={
                    usedTotalContractValue !== totalContractValue ||
                    numOfContractValue === 0
                  }
                >
                  {hasContract ? "Cập nhật hợp đồng" : "Tạo hợp đồng"}
                </Button>
              </Popconfirm>
            </div>
          )}
        </Form>
      </motion.div>

      <FloatButton.BackTop />
    </Fragment>
  );
};

export default memo(ContractPage);
