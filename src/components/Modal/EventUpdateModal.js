import React, { memo, useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUser } from "../../apis/users";
import { updateDetailEvent } from "../../apis/events";
import dayjs from "dayjs";
import moment from "moment";
import { uploadFile } from "../../apis/files";
import TEXT from "../../constants/string";

const { RangePicker } = DatePicker;

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const EventUpdateModal = ({ isModalOpen, setIsModalOpen, event }) => {
  console.log("UPDATE MODAL: ", event);

  const queryClient = useQueryClient();
  const { mutate: updateEventMutate, isLoading: updateEventIsLoading } =
    useMutation((event) => updateDetailEvent(event), {
      onSuccess: () => {
        queryClient.invalidateQueries(["event-detail", event?.id]);
        handleCancel();
        messageApi.open({
          type: "success",
          content: "Cập nhật sự kiện thành công.",
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, event }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        const event = variables.event;
        variables.event = {
          ...event,
          coverUrl: data.downloadUrl,
        };
        updateEventMutate(variables.event);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Không thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    console.log("Success:", values);

    const payload = {
      eventId: event?.id,
      eventName: values?.eventName,
      description: JSON.stringify(values?.description?.ops),
      startDate: values?.date[0],
      processingDate: values?.processingDate,
      endDate: values?.date[1],
      location: values?.location,
      estBudget: +values?.estBudget,
      eventTypeId: event?.eventTypeID,
      divisionId: event?.listDivision?.map((item) => item?.divisionId),
    };

    console.log("PAYLOAD: ", payload);

    if (values?.fileChosen) {
      console.log("HAS FILE");
      console.log("HAS FILE", values?.fileChosen?.file);

      const formData = new FormData();
      formData.append("file", values?.fileChosen?.file?.originFileObj);
      formData.append("folderName", "event");
      console.log("formData > ", formData);
      uploadFileMutate({ formData, event: payload });
    } else {
      console.log("NO FILE");
      payload.coverUrl = event?.coverUrl;
      console.log(payload);
      updateEventMutate(payload);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("errorInfo:", errorInfo);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={<p className="text-center text-4xl pb-4">Cập nhật sự kiện</p>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={uploadIsLoading || updateEventIsLoading}
      centered
      width={"45%"}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      {contextHolder}
      <Form
        className="p-2"
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
          eventName: event?.eventName,
          date: [event?.startDate, event?.endDate],
          location: event?.location,
          processingDate: event?.processingDate,

          description: {
            ops: JSON.parse(
              event?.description?.startsWith(`[{"`)
                ? event?.description
                : parseJson(event?.description)
            ),
          },

          estBudget: event?.estBudget,
        }}
      >
        <div className="flex justify-between gap-x-5">
          <Form.Item
            className="w-[60%]"
            label={<Title title="Tên sự kiện" />}
            name="eventName"
            rules={[
              {
                required: true,
                message: "Chưa nhập tên sự kiện!",
              },
            ]}
          >
            <Input placeholder="Nhập tên sự kiện" size="large" />
          </Form.Item>

          <Form.Item
            className="w-[40%]"
            label={<Title title="Thời gian diễn ra sự kiện" />}
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
                size="large"
                onChange={(value) => {
                  if (value)
                    form.setFieldsValue({
                      date: value.map((item) =>
                        moment(item?.$d).format("YYYY-MM-DD")
                      ),
                    });
                }}
                defaultValue={[
                  dayjs(event?.startDate, "YYYY-MM-DD"),
                  dayjs(event?.endDate, "YYYY-MM-DD"),
                ]}
                format={"DD/MM/YYYY"}
                disabledDate={(current) => {
                  return current && current < moment().startOf("day");
                }}
              />
            </ConfigProvider>
          </Form.Item>
        </div>

        <div className="flex justify-between gap-x-5">
          <Form.Item
            className="w-[60%]"
            label={<Title title="Địa điểm" />}
            name="location"
            rules={[
              {
                required: true,
                message: "Chưa nhập địa điểm!",
              },
            ]}
          >
            <Input disabled placeholder="Nhập địa điểm" size="large" />
          </Form.Item>

          <Form.Item
            className="w-[40%]"
            label={<Title title="Thời gian bắt đầu dự án" />}
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
                size="large"
                onChange={(value) => {
                  form.setFieldsValue({
                    processingDate: moment(value?.$d).format("YYYY-MM-DD"),
                  });
                }}
                disabledDate={(current) => {
                  return (
                    current && current > moment(event?.startDate).endOf("day")
                  );
                }}
                defaultValue={dayjs(event?.processingDate, "YYYY-MM-DD")}
                format={"DD/MM/YYYY"}
              />
            </ConfigProvider>
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
            className="h-40 mb-10"
            theme="snow"
            placeholder="Nhập mô tả"
            onChange={(content, delta, source, editor) => {
              form.setFieldsValue({ description: editor.getContents() });
            }}
          />
        </Form.Item>

        <div className="flex items-center gap-x-10">
          <Form.Item
            className="w-[40%]"
            label={<Title title="Ước lượng ngân sách" />}
            name="estBudget"
            rules={[
              {
                required: true,
                message: "Chưa nhập ngân sách!",
              },
            ]}
          >
            <div className="flex items-center gap-x-2">
              <InputNumber
                disabled
                className="w-full"
                defaultValue={event?.estBudget}
                min={500000}
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
              <p>VNĐ</p>
            </div>
          </Form.Item>

          <Form.Item
            className="flex items-center justify-center overflow-hidden"
            name="fileChosen"
          >
            <Upload.Dragger
              // className="h-40 text-center"
              className="flex items-center gap-x-3"
              maxCount={1}
              listType="picture"
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              defaultFileList={[
                {
                  name: "Ảnh sự kiện",
                  status: "done",
                  url: event?.coverUrl,
                },
              ]}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: false,
              }}
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file && file?.size > 10 * 1024 * 1024) {
                    reject("File quá lớn ( <10MB )");
                    return false;
                  } else {
                    form.setFieldsValue({ fileChosen: file });

                    resolve();
                    return true;
                  }
                });
              }}
            >
              <p className="py-1.5 px-2">Ảnh về sự kiện</p>
            </Upload.Dragger>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default memo(EventUpdateModal);
