import {
  LoadingOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { getEventTemplate, getEventType } from "../../apis/events";
import { getTasks } from "../../apis/tasks";
import SettingModal from "../../components/Modal/SettingModal";
import CardSetting from "./CardSetting/CardSetting";

const SettingPage = () => {
  const [selectTypeEvent, setSelectTypeEvent] = useState("");
  const [isOpenNewTaskTemplate, setIsOpenNewTaskTemplate] = useState(false);
  const [selectTemplateEvent, setSelectTemplateEvent] = useState("");
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

  const handleChangeEventType = (value) => {
    if (value) {
      const eventTypeFind = eventType?.find((item) => item?.id === value);
      setSelectTypeEvent(eventTypeFind?.typeName);
    }
  };

  useEffect(() => {
    refetchTemplateTask();
  }, [isOpenNewTaskTemplate]);
  useEffect(() => {
    if (!isLoadingTemplateEvent && !isErrorTemplateEvent) {
      setSelectTemplateEvent(templateEvent);
    }
  }, [templateEvent]);

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
        <div className="flex w-full ">
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
            <div className="w-full">
              {selectTemplateEvent?.eventType?.typeName === selectTypeEvent ? (
                <Spin spinning={isLoadingTemplateTask}>
                  <div className=" flex w-full flex-wrap flex-row gap-x-5 ">
                    {/* cardLayout */}
                    {templateTask?.length > 0 ? (
                      templateTask?.map((task, index) => (
                        <CardSetting task={task} key={task?.id} />
                      ))
                    ) : (
                      <div className="w-full h-[50vh] flex justify-center items-center">
                        <Empty description={<span>chưa có dữ liệu</span>} />
                      </div>
                    )}
                  </div>
                </Spin>
              ) : (
                <div className="flex justify-center items-center mt-2 py-4">
                  <Empty description={<span>chưa có công việc nào</span>} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpenNewTaskTemplate && !isLoadingTemplateEvent && (
        <SettingModal
          isOpenNewTaskTemplate={isOpenNewTaskTemplate}
          setIsOpenNewTaskTemplate={setIsOpenNewTaskTemplate}
          templateEvent={templateEvent}
          selectTypeEvent={selectTypeEvent}
        />
      )}
    </section>
  );
};

export default SettingPage;
