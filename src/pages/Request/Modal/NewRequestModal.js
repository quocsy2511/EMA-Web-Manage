import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import React, { useState } from "react";
import { createRequest } from "../../../apis/requests";

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

  const queryClient = useQueryClient();
  const { mutate: submitFormRequest, isLoading: isLoadingSubmitForm } =
    useMutation((request) => createRequest(request), {
      onSuccess: () => {
        queryClient.invalidateQueries("requests");
        message.open({
          type: "success",
          content: "Tạo một đơn yêu cầu mới thành công",
        });
        setIsOpenNewRequest(false);
      },
      onError: (data) => {
        console.log(
          "🚀 ~ file: NewRequestModal.js:49 ~ useMutation ~ data:",
          data.response.data.message
        );
        if (data?.response?.data?.message === "Not enough vacation days") {
          message.open({
            type: "error",
            content: "Bạn không còn đủ ngày nghỉ vui lòng kiểm tra lại đơn",
          });
        } else {
          message.open({
            type: "error",
            content: "Đã xãy ra lỗi bất ngờ vui lòng thử lại sau",
          });
        }
      },
    });

  const onFinish = (values) => {
    const { date, ...data } = values;
    const request = {
      ...data,
      startDate: startDate,
      endDate: endDate,
    };

    if (!request.isFull) {
      const newRequest = {
        ...request,
        isFull: "false",
      };
      console.log(
        "🚀 ~ file: NewRequestModal.js:69 ~ onFinish ~ newRequest 1:",
        newRequest
      );
      submitFormRequest(newRequest);
    } else {
      const newRequest = {
        ...request,
        isPM: "false",
      };
      console.log(
        "🚀 ~ file: NewRequestModal.js:77 ~ onFinish ~ newRequest 2:",
        newRequest
      );
      submitFormRequest(newRequest);
    }
  };

  return (
    <Modal
      title="Tạo mới yêu cầu "
      width={700}
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
            placeholder={["Ngày bắt đầu ", "ngày kết thúc"]}
            formatDate="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current < today.startOf("day")
            }
            onChange={onChangeDate}
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
          >
            <Checkbox
              checked={isFull}
              onChange={(e) => setIsFull(e.target.checked)}
            />
          </Form.Item>
          {/* Buổi trong ngày */}
          <Form.Item
            //   label="Buổi"
            name="isPM"
            initialValue={isPM}
            style={{
              display: "inline-block",
              width: "25%",
            }}
          >
            <Radio.Group disabled={isFull} className="">
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
            loading={isLoadingSubmitForm}
          >
            Gửi đơn
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewRequestModal;
