import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import React, { useState } from "react";

const NewRequestModal = ({ isOpenNewRequest, setIsOpenNewRequest }) => {
  const handleCancel = () => {
    setIsOpenNewRequest(false);
  };
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [isFull, setIsFull] = useState(false);
  const [isPM, setIsPM] = useState("false");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const today = moment();
  const onChangeDate = (value, dateString) => {
    // Chuyển đổi thành định dạng ISO 8601
    const isoStartDate = moment(dateString[0]).toISOString();
    const isoEndDate = moment(dateString[1]).toISOString();
    setStartDate(isoStartDate);
    setEndDate(isoEndDate);
  };

  const onFinish = (values) => {
    const { date, ...data } = values;
    const request = {
      ...data,
      startDate: startDate,
      endDate: endDate,
    };
    console.log(
      "🚀 ~ file: NewRequestModal.js:38 ~ onFinish ~ request:",
      request
    );
  };

  return (
    <Modal
      title="Tạo mới yêu cầu "
      width={900}
      open={isOpenNewRequest}
      footer={false}
      mask={false}
      //   maskClosable={false}
      onCancel={handleCancel}
      style={{
        position: "fixed",
        right: 30,
        top: "44%",
        margin: 0,
      }}
    >
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 18,
        }}
        layout="horizontal"
        autoComplete="off"
        onFinish={onFinish}
      >
        {/* tên */}
        <Form.Item
          name="title"
          label="Tên đơn"
          rules={[
            {
              required: true,
              message: "Tên đơn bắt buộc nhập",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Tên đơn " />
        </Form.Item>
        {/* nội dung */}
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            {
              required: true,
              message: "nội dung đơn bắt buộc nhập",
            },
          ]}
          hasFeedback
        >
          <TextArea rows={4} placeholder="Nội dung đơn " />
        </Form.Item>
        {/* loại đơn */}
        <Form.Item
          label="Loại đơn "
          name="type"
          rules={[
            {
              required: true,
              message: "Loại đơn bắt buộc chọn!",
            },
          ]}
        >
          <Select placeholder="Loại đơn ">
            <Select.Option value="A">Nghỉ phép có lương</Select.Option>
            <Select.Option value="L">Nghỉ phép không lương</Select.Option>
            <Select.Option value="M">Đi công tác</Select.Option>
          </Select>
        </Form.Item>
        {/* Thời gian */}
        <Form.Item
          label="Thời gian"
          name="date"
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
            formatDate="YYYY/MM/DD"
            // disabledDate={disabledDate}
            disabledDate={(current) =>
              current && current < today.startOf("day")
            }
            onChange={onChangeDate}
          />
        </Form.Item>
        {/* Cả ngày */}
        <Form.Item label="Cả ngày" name="isFull" valuePropName="checked">
          <Checkbox
            checked={isFull}
            onChange={(e) => setIsFull(e.target.checked)}
          />
        </Form.Item>
        {/* Buổi trong ngày */}
        <Form.Item label="Buổi trong ngày" name="isPM" initialValue={isPM}>
          <Radio.Group disabled={isFull}>
            <Radio value="false" onChange={() => setIsPM("false")}>
              {" "}
              Buổi sáng{" "}
            </Radio>
            <Radio value="true" onChange={() => setIsPM("true")}>
              {" "}
              Buổi chiều{" "}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          label=" "
          colon={false}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewRequestModal;
