import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Modal, Select, InputNumber } from "antd";
import React, { memo } from "react";
import { createContract } from "../../apis/contract";
import momenttz from "moment-timezone";

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const ContractCreatePage = ({
  isModalOpen,
  setIsModalOpen,
  messageApi,
  eventId,
}) => {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutate: createContractMutate, isLoading: createContractIsLoading } =
    useMutation(() => createContract(), {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["tasks", eventId]);
        messageApi.open({
          type: "success",
          content: "Đã tạo hợp đồng thành công.",
        });
        setIsModalOpen(false);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau !",
        });
      },
    });

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // on form submit success
  const onFinish = (values) => {
    console.log("values > ", values);

    const contractPayload = {
      ...values,
      paymentDate: momenttz().format("YYYY-MM-DD"),
    };

    createContractMutate()
  };

  // on form submit fail
  const onFinishFailed = (errorInfo) => {};

  return (
    <Modal
      title={<p className="text-center text-4xl border-b pb-5">Tạo hợp đồng</p>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      //   confirmLoading={isLoading || uploadIsLoading}
      okText="Tạo"
      cancelText="Hủy"
      centered
      width={"50%"}
    >
      <Form
        className="p-5"
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
        initialValues={{}}
      >
        <div className="flex space-x-10">
          <Form.Item
            className="w-1/2"
            label={<Title title="Tên khách hàng" />}
            name="customerName"
            rules={[
              {
                required: true,
                message: "Chưa nhập tên khách hàng!",
              },
            ]}
            onChange={(value) => {
              // Update to specific field
              form.setFieldsValue({
                customerName: value.target.value,
              });
            }}
          >
            <Input placeholder="Nhập tên khách hàng" size="large" />
          </Form.Item>

          <Form.Item
            className="w-1/2"
            label={<Title title="Email" />}
            name="customerEmail"
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
                customerEmail: value.target.value,
              });
            }}
          >
            <Input placeholder="Nhập email khách hàng" size="large" />
          </Form.Item>
        </div>

        <div className="flex space-x-10">
          <Form.Item
            className="w-3/5"
            label={<Title title="Địa chỉ" />}
            name="customerAddress"
            rules={[
              {
                required: true,
                message: "Chưa nhập địa chỉ khách hàng!",
              },
            ]}
            onChange={(value) => {
              // Update to specific field
              form.setFieldsValue({
                customerAddress: value.target.value,
              });
            }}
          >
            <Input placeholder="Nhập địa chỉ khách hàng" size="large" />
          </Form.Item>

          <Form.Item
            className="w-2/5"
            label={<Title title="Số điện thoại" />}
            name="customerPhoneNumber"
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
                customerPhoneNumber: value.target.value,
              });
            }}
          >
            <Input
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
            className="w-3/5"
            label={<Title title="Căn cước công dân / Chứng minh nhân dân" />}
            name="customerNationalId"
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
                customerNationalId: value.target.value,
              });
            }}
          >
            <Input
              pattern="[0-9]*"
              maxLength={12}
              placeholder="Nhập CCCD / CMND"
              size="large"
            />
          </Form.Item>

          <Form.Item
            className="w-2/5"
            label={<Title title="Giá trị hợp đồng" />}
            name="contractValue"
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
                    contractValue: +value,
                  });
                }}
              />
              <p className="text-base">VNĐ</p>
            </div>
          </Form.Item>
        </div>

        <Form.Item
          className=""
          label={<Title title="Hình thức thanh toán" />}
          name="paymentMethod"
          rules={[
            {
              required: true,
              message: "Chưa nhập hình thức thanh toán!",
            },
          ]}
          onChange={(value) => {
            // Update to specific field
            form.setFieldsValue({
              paymentMethod: value.target.value,
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
      </Form>
    </Modal>
  );
};

export default ContractCreatePage;
