import React from "react";
import { Button, Card, Form, Input, InputNumber, Modal, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createBudget } from "../../../../apis/budgets";

const NewBudget = ({
  selectEvent,
  isOpenBudgetModal,
  setIsOpenBudgetModal,
}) => {
  const [form] = Form.useForm();
  const staffID = useRouteLoaderData("staff").id;
  const { id } = selectEvent;
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <p>VND</p>
    </Form.Item>
  );

  const queryClient = useQueryClient();
  // const { mutate: postListBudget } = useMutation(
  //   (budget) => createBudget(budget),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("listBudgetConfirming");
  //       queryClient.invalidateQueries("listBudgetConfirmed");
  //       form.resetFields();
  //       form.setFieldsValue({
  //         items: [{}],
  //       });
  //       message.open({
  //         type: "success",
  //         content: "Tạo chi phí  mới thành công",
  //       });
  //     },
  //     onError: () => {
  //       message.open({
  //         type: "error",
  //         content: "Ko thể tạo chi phí mới lúc này! Hãy thử lại sau",
  //       });
  //     },
  //   }
  // );

  const handleCancel = () => {
    setIsOpenBudgetModal(false);
  };

  const onFinish = (values) => {
    const listBudget = values.items;
    const data = listBudget.map((budget) => {
      return {
        ...budget,
        createBy: staffID,
        eventID: id,
      };
    });
  };

  return (
    <Modal
      title="Tạo mới ngân sách"
      open={isOpenBudgetModal}
      onCancel={handleCancel}
      footer={false}
      closeIcon={false}
      width={800}
      style={{
        top: 20,
      }}
    >
      <div className="w-full p-8 bg-white flex-1  rounded-xl overflow-y-auto flex justify-center items-center">
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          form={form}
          name="dynamic_form_complex"
          style={{
            width: 900,
          }}
          autoComplete="off"
          initialValues={{
            items: [{}],
          }}
          className="w-1/2"
          onFinish={onFinish}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field, index) => (
                  <Card
                    size="small"
                    title={`Chi phí ${field.name + 1} `}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    }
                  >
                    {/* tên */}
                    <Form.Item
                      label="Tên chi phí"
                      name={[field.name, "budgetName"]}
                      rules={[
                        {
                          required: true,
                          message: "Tên chi phí bắt buộc nhập",
                        },
                        {
                          whitespace: true,
                          message: "Tên chi phí không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="tên chi phí yêu cầu" />
                    </Form.Item>
                    {/* chi phí ước chừng */}
                    <Form.Item
                      label="Chi phí ước chừng"
                      name={[field.name, "estExpense"]}
                      rules={[
                        {
                          required: true,
                          message: "Số tiền bắt buộc nhập số",
                        },
                        {
                          type: "number",
                          min: 1000,
                          message: "Số tiền tối thiểu là 1000",
                        },
                      ]}
                    >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        //   Phân tích giá trị nhập vào (loại bỏ dấu ",")
                        parser={(value) => value.replace(/(,*)/g, "")}
                        addonAfter={suffixSelector}
                        style={{
                          width: "100%",
                        }}
                        placeholder="số tiền dự kiến phải chi"
                      />
                    </Form.Item>
                    {/* nhà cung */}
                    <Form.Item
                      label="Nhà cung cấp"
                      name={[field.name, "supplier"]}
                      initialValue=""
                    >
                      <Input placeholder="tên nhà cung cấp" />
                    </Form.Item>
                    {/* mô tả */}
                    <Form.Item
                      label="Mô tả"
                      name={[field.name, "description"]}
                      initialValue=""
                    >
                      <TextArea
                        rows={4}
                        placeholder="chi tiết số tiền được dùng"
                      />
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm 1 chi phí mới
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" className="w-full mt-4">
              Gửi chi phí
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default NewBudget;
