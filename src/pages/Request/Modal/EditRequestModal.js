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
import dayjs from "dayjs";
import moment from "moment";
import React, { useState } from "react";

const EditRequestModal = ({
  isOpenEditRequest,
  setIsOpenEditRequest,
  requestSelected,
}) => {
  const handleCancel = () => {
    setIsOpenEditRequest(false);
  };
  const { RangePicker } = DatePicker;
  const today = moment();
  const [form] = Form.useForm();
  const [isFull, setIsFull] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPM, setIsPM] = useState("false");
  const onChangeDate = (value, dateString) => {
    // Chuyển đổi thành định dạng ISO 8601
    const isoStartDate = moment(dateString[0]).toISOString();
    const isoEndDate = moment(dateString[1]).toISOString();
    setStartDate(isoStartDate);
    setEndDate(isoEndDate);
  };
  const onFinish = (values) => {};
  return (
    <Modal
      title="Cập nhật yêu cầu "
      width={700}
      open={isOpenEditRequest}
      footer={false}
      onCancel={handleCancel}
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
          initialValue={requestSelected?.title}
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
          initialValue={requestSelected?.content}
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
          initialValue={requestSelected?.type}
        >
          <Select placeholder="Loại đơn ">
            <Select.Option value="A">Nghỉ phép có lương</Select.Option>
            <Select.Option value="L">Nghỉ phép không lương</Select.Option>
            <Select.Option value="M">Đi công tác</Select.Option>
          </Select>
        </Form.Item>
        {/* thời gian */}
        <Form.Item
          name="date"
          className="mb-0"
          rules={[
            {
              type: "array",
              required: true,
              message: "Please select time!",
            },
          ]}
          initialValue={[
            dayjs(requestSelected.startDate).utcOffset(7).local(),
            dayjs(requestSelected.endDate).utcOffset(7).local(),
          ]}
        >
          <RangePicker
            placeholder={["ngày bắt đầu  ", "ngày kết thúc "]}
            disabledDate={(current) =>
              current && current < today.startOf("day")
            }
            onChange={onChangeDate}
            format="YYYY/MM/DD"
            allowClear={false}
          />
        </Form.Item>
        <div className="flex gap-x-2 justify-center w-full items-center">
          {/* Cả ngày */}
          <Form.Item
            label="Cả ngày"
            name="isFull"
            valuePropName="checked"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              display: "inline-block",
              width: "60%",
            }}
            initialValue={requestSelected?.isFull}
          >
            <Checkbox
              checked={isFull}
              onChange={(e) => setIsFull(e.target.checked)}
            />
          </Form.Item>
          {/* Buổi trong ngày */}
          <Form.Item
            initialValue={requestSelected?.isPM}
            name="isPM"
            style={{
              display: "inline-block",
              width: "25%",
            }}
          >
            <Radio.Group disabled={isFull} className="">
              <Radio value="false" onChange={() => setIsPM("true")}>
                {" "}
                Buổi sáng{" "}
              </Radio>
              <Radio value="true" onChange={() => setIsPM("true")}>
                {" "}
                Buổi chiều{" "}
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
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
          <Button
            type="primary"
            htmlType="submit"
            // loading={isLoadingSubmitForm}
          >
            Gửi đơn
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRequestModal;
