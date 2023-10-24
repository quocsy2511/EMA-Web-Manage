import React from "react";
import { Button, Card, Form, Input, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const NewBudget = ({ selectEvent }) => {
  console.log(
    "🚀 ~ file: NewBudget.js:7 ~ NewBudget ~ selectEvent:",
    selectEvent
  );
  const [form] = Form.useForm();

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <p>VND</p>
    </Form.Item>
  );

  return (
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
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Số tiền"
                    name={[field.name, "estExpense"]}
                    rules={[
                      {
                        required: true,
                        message: "Số tiền bắt buộc nhập",
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
                    />
                  </Form.Item>
                  <Form.Item label="Mô tả" name={[field.name, "description"]}>
                    <TextArea rows={4} />
                  </Form.Item>

                  {/* Nest Form.List */}
                  {/* <Form.Item label="List">
                    <Form.List name={[field.name, "list"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item
                                noStyle
                                name={[subField.name, "first"]}
                              >
                                <Input placeholder="first" />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name={[subField.name, "second"]}
                              >
                                <Input placeholder="second" />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />
                            </Space>
                          ))}

                          <Button
                            type="dashed"
                            onClick={() => subOpt.add()}
                            block
                          >
                            + Add Sub Item
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item> */}
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Add Item
              </Button>
            </div>
          )}
        </Form.List>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Gửi chi phí
          </Button>
        </Form.Item>

        {/* <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default NewBudget;
