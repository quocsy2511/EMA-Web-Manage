import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SwapRightOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Avatar, Empty, Timeline, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

const HistoryAssignee = ({ taskSelected }) => {
  // console.log("🚀 ~ HistoryAssignee ~ taskSelected:", taskSelected);

  const startDate = moment(taskSelected?.startDate).format("DD-MM-YYYY");
  const endDate = moment(taskSelected?.endDate).format("DD-MM-YYYY");
  const status = taskSelected?.status;
  let assignTaskSelected = taskSelected?.assignTasks ?? [];
  // console.log("🚀 ~ HistoryAssignee ~ assignTaskSelected:", assignTaskSelected);
  const [assignTasks, setAssignTasks] = useState([]);
  console.log("🚀 ~ HistoryAssignee ~ assignTasks:", assignTasks);

  useEffect(() => {
    if (assignTaskSelected?.length > 0) {
      //so 2 filed Update va cratedAt rồi tạo
      const processedTasks = assignTaskSelected.map((task) => {
        if (moment(task.updatedAt).isAfter(moment(task.createdAt))) {
          task.newAt = task.updatedAt;
        } else {
          task.newAt = task.createdAt;
        }
        return task;
      });
      // console.log("🚀 ~ processedTasks ~ processedTasks:", processedTasks);

      processedTasks.sort((a, b) => moment(a.newAt).diff(moment(b.newAt)));
      setAssignTasks(processedTasks);
    }
  }, [taskSelected]);

  return (
    <div className="w-full">
      {assignTasks.length > 0 ? (
        <Timeline
          className=" py-3"
          items={[
            {
              children: (
                <p className="text-xl font-semibold px-2 ">
                  {startDate} <SwapRightOutlined /> {endDate}
                </p>
              ),
              dot: (
                <ClockCircleOutlined className="timeline-clock-icon text-xl" />
              ),
              color: `${
                status === "OVERDUE"
                  ? "red"
                  : status === "CONFIRM"
                  ? "green"
                  : "blue"
              }`,
            },
            ...assignTasks.map((user) => {
              return {
                children: (
                  <div
                    className={`${
                      user?.status === "inactive"
                        ? "bg-slate-200 opacity-30"
                        : "bg-slate-100"
                    }  px-2 py-2 w-full rounded-md `}
                    key={user?.id}
                  >
                    <div className="flex flex-col items-start justify-start gap-y-2 w-full ">
                      <div className="w-full flex flex-row items-center gap-x-2">
                        <Avatar
                          src={<EditOutlined className="text-purple-500" />}
                          className="bg-purple-100"
                          size="small"
                        />
                        <p className="font-medium text-sm text-blueSecondBudget">
                          Chỉnh sửa công việc
                        </p>
                      </div>
                      <div className="w-full overflow-hidden ml-8">
                        <div className="w-full flex flex-row items-center gap-x-2 mb-2">
                          <Avatar
                            src={user?.user?.profile?.avatar}
                            className="bg-purple-100"
                            size="small"
                          />
                          <p
                            className={`${
                              user?.status === "inactive" &&
                              "decoration-red-700 decoration-2 line-through text-blueSecondBudget"
                            } font-medium text-sm text-black`}
                          >
                            {user?.user?.profile?.fullName}
                          </p>
                        </div>
                        <Tooltip title="note">
                          {user?.status === "inactive" ? (
                            <p className="w-full line-clamp-2 font-normal text-sm text-black ml-8">
                              Nhân viên <b> {user?.user?.profile?.fullName}</b>{" "}
                              không còn làm công việc{" "}
                              <b>{taskSelected?.title}</b>
                            </p>
                          ) : (
                            <p className="w-full line-clamp-2 font-normal text-sm text-black ml-8">
                              Nhân viên <b> {user?.user?.profile?.fullName}</b>{" "}
                              đã được thêm vào công việc{" "}
                              <b>{taskSelected?.title}</b>
                            </p>
                          )}
                        </Tooltip>
                      </div>
                      <div className="w-full ml-16">
                        <p className="font-medium text-xs text-blueSecondBudget text-start">
                          {moment(user?.newAt).format("DD-MM-YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
                dot: (
                  <>
                    {user?.status === "inactive" ? (
                      <CloseCircleOutlined className="timeline-clock-icon text-xl" />
                    ) : (
                      <SyncOutlined
                        className="timeline-clock-icon text-xl"
                        spin={user?.status === "inactive" ? false : true}
                      />
                    )}
                  </>
                ),
                color: `${user?.status === "inactive" ? "red" : "green"}`,
              };
            }),
          ]}
        />
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default HistoryAssignee;
