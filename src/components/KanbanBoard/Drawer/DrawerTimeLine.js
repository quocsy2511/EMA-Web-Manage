import {
  CaretDownOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Drawer, Timeline, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import clsx from "clsx";

const DrawerTimeLine = ({
  selectedDateSchedule,
  childrenDrawer,
  setChildrenDrawer,
  checkedDateData,
}) => {
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  return (
    <Drawer
      title={`Danh sách công việc của nhân viên (${moment(
        selectedDateSchedule
      ).format("DD-MM-YYYY")}) `}
      width={550}
      closable={false}
      onClose={onChildrenDrawerClose}
      open={childrenDrawer}
    >
      {checkedDateData && (
        <div className="w-full py-1  h-full">
          {/* info */}
          <div className="flex flex-row justify-start items-center gap-x-3 mb-1">
            <div className="flex flex-row justify-center items-start gap-x-2">
              <p className="font-semibold text-sm">Độ ưu tiên :</p>
            </div>
            <div className="flex flex-row justify-center items-start gap-x-2">
              <Badge
                count={<ClockCircleOutlined className="pt-1 text-red-500" />}
              />
              <p>Cao</p>
            </div>
            <div className="flex flex-row justify-center items-start gap-x-2">
              <Badge
                count={<FieldTimeOutlined className="pt-1 text-gray-500" />}
              />
              <p>Bình thường</p>
            </div>
            <div className="flex flex-row justify-center items-start gap-x-2">
              <Badge
                count={<HistoryOutlined className="pt-1 text-green-500" />}
              />
              <p>Thấp</p>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-x-3 mb-4">
            <div className="flex flex-row justify-center items-start gap-x-2">
              <p className="font-semibold text-sm">Trạng thái công việc :</p>
            </div>
            <div className="flex flex-row justify-center items-start gap-x-2">
              <Badge color="blue" text="ĐANG DIỄN RA" />
            </div>
            <div className="flex flex-row justify-center items-start gap-x-2">
              <Badge color="yellow" text="ĐANG CHUẨN BỊ" />
            </div>
          </div>

          <div
            className="w-full mb-5 border-b-2 border-b-slate-300 pt-3 "
            key={checkedDateData?.id}
          >
            {/* header */}
            <div className="flex justify-start items-center  mb-2 gap-x-3">
              <Avatar src={checkedDateData?.profile?.avatar} size="large" />
              <Tooltip title="testing">
                <p className="w-auto max-w-xs text-center text-base font-medium truncate cursor-pointer">
                  {checkedDateData?.profile?.fullName}
                </p>
              </Tooltip>
            </div>
            {/* content */}
            <div>
              {checkedDateData?.listEvent?.map((event) => (
                <div key={event?.eventID}>
                  {/* listEvent */}
                  <div className=" px-3 py-2 rounded-lg bg-blue-400 flex flex-row justify-start items-center gap-x-1 overflow-hidden mb-2">
                    <CaretDownOutlined className="text-white" />
                    <Tooltip title={event?.eventName}>
                      <p className="text-base text-white pr-4 truncate cursor-pointer font-medium">
                        {event?.eventName}
                      </p>
                    </Tooltip>
                  </div>

                  {/* List Task */}
                  <div className="w-full pt-3 overflow-hidden pl-10">
                    <Timeline
                      items={event?.listTask
                        ?.filter(
                          (item) =>
                            item.status === "PENDING" ||
                            item.status === "PROCESSING"
                        )
                        ?.map((task) => {
                          return {
                            children: (
                              <>
                                <p
                                  className={clsx("text-base text-blue-500", {
                                    "text-yellow-500":
                                      task?.status === "PENDING",
                                  })}
                                >
                                  {task?.title}
                                </p>
                              </>
                            ),
                            dot: (
                              <>
                                {task?.priority === "HIGH" ? (
                                  <ClockCircleOutlined className="text-lg timeline-clock-icon text-red-500" />
                                ) : task?.priority === "MEDIUM" ? (
                                  <FieldTimeOutlined className="text-lg timeline-clock-icon text-gray-500" />
                                ) : (
                                  <HistoryOutlined className="text-lg timeline-clock-icon text-green-500" />
                                )}
                              </>
                            ),
                          };
                        })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default DrawerTimeLine;
