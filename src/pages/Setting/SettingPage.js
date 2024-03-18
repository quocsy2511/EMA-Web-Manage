import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getEventTemplate, getEventType } from "../../apis/events";
import {
  Button,
  Empty,
  Form,
  Input,
  Segmented,
  Select,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { getTasks } from "../../apis/tasks";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SettingModal from "../../components/Modal/SettingModal";

const SettingPage = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [selectTypeEvent, setSelectTypeEvent] = useState("");
  const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);
  const [isOpenNewTaskTemplate, setIsOpenNewTaskTemplate] = useState(false);

  const {
    data: eventType,
    isLoading: eventTypeIsLoading,
    isError: isErrorEventType,
  } = useQuery(["eventTypes"], () => getEventType(), {
    refetchOnMount: false,
  });

  const {
    data: templateEvent,
    isError: isErrorTemplateEvent,
    isLoading: isLoadingTemplateEvent,
  } = useQuery(["template-Event"], () => getEventTemplate(), {
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: templateTask,
    isError: isErrorTemplateTask,
    isLoading: isLoadingTemplateTask,
    refetch: refetchTemplateTask,
  } = useQuery(
    ["template-task"],
    () =>
      getTasks({
        fieldName: "isTemplate",
        conValue: "true",
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
    }
  );

  console.log("🚀 ~ SettingPage ~ templateTask:", templateTask);

  const onChangeChecked = (checked) => {
    console.log(`switch to ${checked}`);
    setComponentDisabled(!checked);
  };
  
  const handleChangeEventType = (value) => {
    // console.log("🚀 ~ handleChangeEventType ~ value:", value);
    if (value) {
      const eventTypeFind = eventType.find((item) => item.id === value);
      setSelectTypeEvent(eventTypeFind?.typeName);
    }
  };

  const onFinish = (value) => {};

  return (
    <section className="  w-full px-7 py-7 bg-[#f5f5f5]">
      <div className="mb-7 ">
        {/* header */}
        <div className="flex flex-row justify-between items-center mb-7">
          <h3 className="text-2xl font-medium text-[#2c323f]">
            <SettingOutlined /> Cài đặt
          </h3>
          {eventTypeIsLoading ? (
            <LoadingOutlined />
          ) : (
            <p className="text-end text-[#212529bf] font-medium text-base">
              Cài đặt /{" "}
              {selectTypeEvent ? selectTypeEvent : eventType?.[0]?.typeName}
            </p>
          )}
        </div>
        {/* content */}
        <div className="flex flex-wrap w-full">
          <div className="flex justify-start items-center flex-col w-full">
            {/* headerContent */}
            <div className="w-full flex justify-between items-center mb-8">
              <div className="flex justify-start items-center  gap-x-4 flex-row w-full ">
                <h3 className="text-[#212529bf] font-semibold text-base">
                  Loại sự kiện :
                </h3>
                <div className="flex-1">
                  {eventTypeIsLoading ? (
                    <LoadingOutlined />
                  ) : (
                    <>
                      <Select
                        size="large"
                        variant="borderless"
                        options={
                          eventType?.map((item) => ({
                            value: item?.id,
                            label: item?.typeName,
                          })) ?? []
                        }
                        loading={eventTypeIsLoading}
                        defaultValue={eventType?.[0]?.id}
                        placeholder="Chọn 1 thể loại"
                        className="min-w-[30%]"
                        onChange={handleChangeEventType}
                      />
                    </>
                  )}
                </div>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="mr-2"
                onClick={() => setIsOpenNewTaskTemplate(true)}
              >
                {" "}
                Thêm mới Công việc
              </Button>
            </div>

            {/* contentContent */}
            <Spin spinning={isLoadingTemplateTask}>
              <div className=" flex flex-wrap w-full gap-x-5 ">
                {/* cardLayout */}
                {templateTask?.length > 0 ? (
                  templateTask?.map((task, index) => (
                    <div
                      className=" flex w-[49%] bg-white h-fit mb-7 rounded-xl"
                      key={task.id}
                    >
                      {/* card */}
                      <div className="border-none rounded-xl shadow-md w-full">
                        {/* headerCard */}
                        <div className="w-full bg-white border-b border-b-gray-300 p-4 flex justify-between justify-items-center flex-row rounded-t-xl overflow-hidden">
                          <Tooltip title={task?.title}>
                            <h5 className="text-lg font-semibold w-[90%] truncate">
                              {task?.title}
                            </h5>
                          </Tooltip>
                          <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked
                            onChange={onChangeChecked}
                            className="bg-gray-300 w-auto"
                          />
                        </div>
                        {/* contentCard */}
                        <div className="p-6">
                          <Form
                            key={task.id}
                            disabled={componentDisabled}
                            name={`task-form-${task?.id}`}
                            className="m-0 p-0 w-full"
                            // form={form}
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                            initialValues={{
                              taskName: task?.title,
                              priority: task?.priority,
                              description: {
                                ops: JSON.parse(
                                  task?.description?.startsWith(`[{"`)
                                    ? task?.description
                                    : parseJson(task?.description)
                                ),
                              },
                            }}
                          >
                            <Form.Item
                              className="w-full p-0 "
                              label="Tên đề mục"
                              labelCol={{
                                style: { fontWeight: "700" },
                              }}
                              name="taskName"
                              rules={[
                                {
                                  required: true,
                                  message: "Hãy nhập tên đề mục!",
                                },
                              ]}
                            >
                              <Input
                                className="px-6 py-3 border-2 text-base font-inter font-normal"
                                disabled={componentDisabled}
                              />
                            </Form.Item>
                            {/* priority */}
                            <Form.Item
                              label="Độ ưu tiên"
                              labelCol={{
                                style: { fontWeight: "700" },
                              }}
                              name="priority"
                            >
                              <Segmented
                                options={[
                                  { label: "THẤP", value: "LOW" },
                                  { label: "TRUNG BÌNH", value: "MEDIUM" },
                                  { label: "CAO", value: "HIGH" },
                                ]}
                                value={task?.priority}
                                // onChange={(value) =>
                                //   updatePriorityFinish(value)
                                // }
                              />
                            </Form.Item>
                            {/* description */}
                            <Form.Item name="description" className="mb-0">
                              <ReactQuill
                                theme="snow"
                                onChange={(content, delta, source, editor) => {
                                  form.setFieldsValue({
                                    description: editor.getContents(),
                                  });
                                }}
                                className="bg-transparent w-full py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none  "
                              />
                            </Form.Item>

                            <Form.Item
                              wrapperCol={{
                                span: 24,
                              }}
                              className=" mt-5 flex justify-between items-baseline gap-x-3"
                            >
                              <Button
                                type="primary"
                                className="hover:scale-105 duration-300 mr-5 font-bold text-base h-fit w-fit py-3"
                                htmlType="submit"
                                //   loading={isLoading}
                              >
                                Chỉnh sửa
                              </Button>
                              <Button
                                type="default"
                                className="hover:scale-105 duration-300 font-bold text-base h-fit w-fit py-3"
                                htmlType="submit"
                                //   loading={isLoading}
                              >
                                Huỷ
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description={<span>chưa có dữ liệu</span>} />
                )}
              </div>
            </Spin>
          </div>
        </div>
      </div>
      {isOpenNewTaskTemplate && !isLoadingTemplateEvent && (
        <SettingModal
          isOpenNewTaskTemplate={isOpenNewTaskTemplate}
          setIsOpenNewTaskTemplate={setIsOpenNewTaskTemplate}
          templateEvent={templateEvent}
        />
      )}
    </section>
  );
};

export default SettingPage;
