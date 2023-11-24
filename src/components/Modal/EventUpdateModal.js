import React, { useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUser } from "../../apis/users";
import { updateDetailEvent } from "../../apis/events";
import dayjs from "dayjs";
import moment from "moment";
import { uploadFile } from "../../apis/files";

const { RangePicker } = DatePicker;

const Title = ({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
);

const EventUpdateModal = ({ isModalOpen, setIsModalOpen, event }) => {
  console.log("UPDATE MODAL: ", event);
  const { data: staffs, isLoading: staffsIsLoading } = useQuery(
    ["staffs"],
    () => getAllUser({ role: "STAFF", pageSize: 100, currentPage: 1 }),
    {
      select: (data) => {
        return data.data.map((staff) => ({
          label: `${staff.fullName} - ${staff.divisionName}`,
          value: staff.divisionId,
        }));
      },
    }
  );

  const queryClient = useQueryClient();
  const { mutate: updateEventMutate, isLoading: updateEventIsLoading } =
    useMutation((event) => updateDetailEvent(event), {
      onSuccess: () => {
        queryClient.invalidateQueries(["event-detail", event.id]);
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

  const [fileList, setFileList] = useState();

  const onFinish = (values) => {
    console.log("Success:", values);

    values = {
      ...values,
      eventId: event.id,
      description: JSON.stringify(values.description.ops),
      divisionId: values.divisions,
      startDate: values.date[0],
      endDate: values.date[1],
      estBudget: +values.estBudget,
    };

    console.log("TRANSFORM: ", values);

    if (fileList && fileList?.length !== 0) {
      console.log("HAS FILE");

      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "event");

      const { date, divisions, ...eventInfo } = values;
      console.log(eventInfo);

      uploadFileMutate({ formData, event: eventInfo });
    } else {
      console.log("NO FILE");
      values = { ...values, coverUrl: event.coverUrl };
      const { date, divisions, ...eventInfo } = values;
      console.log(eventInfo);
      updateEventMutate(eventInfo);
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
          eventName: event.eventName,
          date: [event.startDate, event.endDate],
          location: event.location,
          estBudget: event.estBudget,
          description: { ops: JSON.parse(event.description) },
          divisions: event.listDivision.map((item) => item.divisionId),
          processingDate: event.processingDate,
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
            <Input placeholder="Nhập tên sự kiện" />
          </Form.Item>

          <Form.Item
            className="w-[40%]"
            label={<Title title="Thời gian tổ chức" />}
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
                onChange={(value) => {
                  if (value)
                    form.setFieldsValue({
                      date: value.map((item) =>
                        moment(item.$d).format("YYYY-MM-DD")
                      ),
                    });
                }}
                defaultValue={[
                  dayjs(event.startDate, "YYYY-MM-DD"),
                  dayjs(event.endDate, "YYYY-MM-DD"),
                ]}
                format={"DD/MM/YYYY"}
                // disabledDate={(current) => {
                //   return current && current < moment().startOf("day");
                // }}
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
            <Input placeholder="Nhập địa điểm" />
          </Form.Item>
          <Form.Item
            className="w-[40%]"
            label={<Title title="Thời gian bắt đầu" />}
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
                  return (
                    current && current > moment(event.startDate).endOf("day")
                  );
                }}
                defaultValue={dayjs(event.processingDate, "YYYY-MM-DD")}
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
            className="h-24 mb-10"
            theme="snow"
            placeholder="Nhập mô tả"
            onChange={(content, delta, source, editor) => {
              form.setFieldsValue({ description: editor.getContents() });
            }}
          />
        </Form.Item>

        <Form.Item
          label={<Title title="Bộ phận tham gia" />}
          name="divisions"
          rules={[
            {
              required: true,
              message: "Chưa chọn bộ phận tham gia",
            },
          ]}
        >
          <Select
            mode="multiple"
            // defaultValue={event.listDivision.map((item) => item.divisionId)}
            options={staffs ?? []}
            loading={staffsIsLoading}
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
                className="w-full"
                defaultValue={event.estBudget}
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
            className="flex items-center justify-center"
            name="coverUrl"
            // label={<Title title="Ảnh về sự kiện" />}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
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
                  url: event.coverUrl,
                },
              ]}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: false,
              }}
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file && file.size > 10 * 1024 * 1024) {
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
              <p className="py-1.5 px-2">Ảnh về sự kiện</p>
            </Upload.Dragger>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EventUpdateModal;
