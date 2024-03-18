import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getEventType } from "../../apis/events";
import { Button, Form, Input, Select, Switch } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const SettingPage = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [selectTypeEvent, setSelectTypeEvent] = useState("");
  const [defaultTypeEvent, setDefaultTypeEvent] = useState("");
  const {
    data: eventType,
    isLoading: eventTypeIsLoading,
    isError: isErrorEventType,
  } = useQuery(["eventTypes"], () => getEventType(), {
    refetchOnMount: false,
  });

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
            <div className="flex justify-start items-center  gap-x-4 flex-row w-full mb-8">
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
            {/* contentContent */}
            <div className=" flex flex-wrap w-full gap-x-5">
              {/* cardLayout */}
              <div className=" flex w-[49%] bg-white h-fit mb-7 rounded-xl">
                {/* card */}
                <div className="border-none rounded-xl shadow-md w-full">
                  {/* headerCard */}
                  <div className="w-full bg-white border-b border-b-gray-300 p-4 flex justify-between justify-items-center flex-row rounded-t-xl">
                    <h5 className="text-lg font-semibold">Tên Công việc</h5>
                    <div className="">
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        defaultChecked
                        onChange={onChangeChecked}
                        className="bg-gray-300"
                      />
                    </div>
                  </div>
                  {/* contentCard */}
                  <div className="p-6">
                    <Form
                      disabled={componentDisabled}
                      name="templateSetting"
                      className="m-0 p-0 w-full"
                      form={form}
                      onFinish={onFinish}
                      autoComplete="off"
                      layout="vertical"
                    >
                      <Form.Item
                        className="w-full p-0 "
                        label="Tên đề mục"
                        name="taskName"
                        labelCol={{
                          style: { fontWeight: "700" },
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Hãy nhập tên đề mục!",
                          },
                        ]}
                        initialValue="tên công việc"
                      >
                        <Input
                          className="px-6 py-3 border-2 text-base font-inter font-normal"
                          disabled={componentDisabled}
                        />
                      </Form.Item>
                      <Form.Item
                        name="taskName"
                        className="w-full p-0 "
                        label="Tên đề mục"
                        labelCol={{
                          style: { fontWeight: "700" },
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Hãy nhập tên đề mục!",
                          },
                        ]}
                        initialValue="tên công việc"
                      >
                        <Input
                          disabled={componentDisabled}
                          className="px-6 py-3 border-2 text-base font-inter font-normal"
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

              <div className=" flex w-[49%] bg-white h-fit mb-7 rounded-xl">
                {/* card */}
                <div className="border-none rounded-xl shadow-md w-full">
                  {/* headerCard */}
                  <div className="w-full bg-white border-b border-b-gray-300 p-4 flex justify-between justify-items-center flex-row rounded-t-xl">
                    <h5 className="text-lg font-semibold">Tên Công việc</h5>
                    <div className="">
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        defaultChecked
                        onChange={onChangeChecked}
                        className="bg-gray-300"
                      />
                    </div>
                  </div>
                  {/* contentCard */}
                  <div className="p-6">
                    <Form
                      disabled={componentDisabled}
                      name="templateSetting"
                      className="m-0 p-0 w-full"
                      form={form}
                      onFinish={onFinish}
                      autoComplete="off"
                      layout="vertical"
                    >
                      <Form.Item
                        className="w-full p-0 "
                        label="Tên đề mục"
                        name="taskName"
                        labelCol={{
                          style: { fontWeight: "700" },
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Hãy nhập tên đề mục!",
                          },
                        ]}
                        initialValue="tên công việc"
                      >
                        <Input
                          className="px-6 py-3 border-2 text-base font-inter font-normal"
                          disabled={componentDisabled}
                        />
                      </Form.Item>
                      <Form.Item
                        name="taskName"
                        className="w-full p-0 "
                        label="Tên đề mục"
                        labelCol={{
                          style: { fontWeight: "700" },
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Hãy nhập tên đề mục!",
                          },
                        ]}
                        initialValue="tên công việc"
                      >
                        <Input
                          disabled={componentDisabled}
                          className="px-6 py-3 border-2 text-base font-inter font-normal"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingPage;
