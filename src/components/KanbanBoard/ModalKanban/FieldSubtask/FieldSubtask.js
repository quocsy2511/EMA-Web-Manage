import {
  BulbOutlined,
  FieldTimeOutlined,
  FolderOutlined,
  PercentageOutlined,
  TagOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Avatar, Modal, Popover, Progress, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";
import ListFile from "../File/ListFile";
import FileInput from "../File/FileInput";
import PrioritySegmented from "../Priority/PrioritySegmented";
import EmployeeSelected from "../Employee/EmployeeSelected";
import InforEmployee from "../Employee/InforEmployee";
import StatusSelected from "../Status/StatusSelected";
import StatusTag from "../Status/StatusTag";
import PriorityTag from "../Priority/PriorityTag";
import RangeDate from "../DateTime/RangeDate";
import RangeDateSelected from "../DateTime/RangeDateSelected";
import EstimateTime from "../EstimateTime/EstimateTime";
import EmployeeModalSchedule from "../Employee/EmployeeModalSchedule";
dayjs.locale("vi");
dayjs.extend(utc);
dayjs.utc();

const FieldSubtask = ({
  disableEndDate,
  disableStartDate,
  taskSelected,
  taskParent,
  staff,
  disableUpdate,
  setIsOpenTaskModal,
  disableDoneTaskParent,
  completionPercentage,
}) => {
  // console.log("🚀 ~ file: FieldSubtask.js:42 ~ taskSelected:", taskSelected);
  const [updateFileList, setUpdateFileList] = useState(taskSelected?.taskFiles);
  console.log("🚀 ~ updateFileList:", updateFileList);
  const [updatePriority, setUpdatePriority] = useState(taskSelected?.priority);
  const [assignTasks, setAssignTasks] = useState(taskSelected?.assignTasks);
  const [updateStatus, setUpdateStatus] = useState(taskSelected?.status);

  const [updateStartDate, setUpdateStartDate] = useState(
    taskSelected?.startDate
  );
  // console.log("🚀 ~ updateStartDate:", updateStartDate);
  const [updateEndDate, setUpdateEndDate] = useState(taskSelected?.endDate);
  // console.log("🚀 ~ updateEndDate:", updateEndDate);
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(taskSelected?.progress);
  const [isModalAssigneeOpen, setIsModalAssigneeOpen] = useState(false);

  return (
    <div className="flex flex-col ">
      {/* member/ upload file*/}
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-1/2">
          <div className="flex flex-col  pl-12 mt-2">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <UserOutlined />
              {taskParent ? "Trưởng phòng" : "Thành Viên"}
            </h4>
            {taskParent ? (
              <div className="flex justify-start items-center mt-4 px-3">
                <div className="flex flex-row gap-x-2 justify-start items-center bg-slate-50  rounded-md p-1">
                  <Tooltip key="avatar" title={staff?.fullName} placement="top">
                    <Avatar src={staff?.avatar} size="small" />
                  </Tooltip>
                  <p className="w-full flex-1  text-sm font-semibold">
                    {staff?.fullName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-center mt-4 h-fit px-3">
                <InforEmployee taskSelected={taskSelected} />
                {!disableUpdate && (
                  <>
                    <Avatar
                      icon={<UsergroupAddOutlined />}
                      size="default"
                      className="cursor-pointer bg-lite hover:text-blue-600 hover:bg-blue-200 text-black"
                      onClick={() => setIsModalAssigneeOpen(true)}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-col  w-1/2">
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <FolderOutlined />
              Tài liệu
            </h4>
            {updateFileList && updateFileList?.length > 0 ? (
              updateFileList.map((file, index) => (
                <ListFile
                  key={index}
                  file={file}
                  updateFileList={updateFileList}
                  setUpdateFileList={setUpdateFileList}
                  taskParent={taskParent}
                  taskSelected={taskSelected}
                />
              ))
            ) : (
              <>
                {taskParent && (
                  <div className="flex justify-start items-center mt-4 px-3">
                    <Tag>Không có tài liệu</Tag>
                  </div>
                )}
              </>
            )}
            {!taskParent && !disableUpdate && (
              <div className="flex justify-start items-center mt-4">
                <FileInput
                  setUpdateFileList={setUpdateFileList}
                  setIsOpenTaskModal={setIsOpenTaskModal}
                  taskSelected={taskSelected}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* priority / status */}
      <div className=" flex flex-row gap-x-6 mt-4">
        <div className="flex flex-col w-1/2">
          {/* priority */}
          <div className="flex flex-col  pl-12 mt-2">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <VerticalAlignTopOutlined />
              Độ ưu tiên
            </h4>
            {taskParent ? (
              <>
                <div className="flex justify-start items-center mt-4">
                  {updatePriority !== null && (
                    <PriorityTag
                      updatePriority={updatePriority}
                      setIsOpenPriority={setIsOpenPriority}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-start items-center mt-4">
                  {disableUpdate ? (
                    <PriorityTag
                      updatePriority={updatePriority}
                      setIsOpenPriority={setIsOpenPriority}
                    />
                  ) : (
                    updatePriority !== null && (
                      <>
                        {!isOpenPriority ? (
                          <PriorityTag
                            updatePriority={updatePriority}
                            setIsOpenPriority={setIsOpenPriority}
                          />
                        ) : (
                          <PrioritySegmented
                            updatePriority={updatePriority}
                            taskSelected={taskSelected}
                            setUpdatePriority={setUpdatePriority}
                            setIsOpenPriority={setIsOpenPriority}
                          />
                        )}
                      </>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className=" flex flex-col  w-1/2">
          {/* Status */}
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden ">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <BulbOutlined />
              Trạng Thái
            </h4>
            {disableUpdate ? (
              <StatusTag
                taskSelected={taskSelected}
                updateStatus={updateStatus}
              />
            ) : (
              <>
                {taskParent ? (
                  <>
                    {/* disableDoneTaskParent check xem cacs task con hoan thanh chua */}
                    {!disableDoneTaskParent ? (
                      <StatusSelected
                        // disableDoneTaskParent={disableDoneTaskParent}
                        updateStatus={updateStatus}
                        setUpdateStatus={setUpdateStatus}
                        taskSelected={taskSelected}
                        taskParent={taskParent}
                        classNameStyle="w-[190px] mt-2"
                        setIsOpenTaskModal={setIsOpenTaskModal}
                        updateStartDate={updateStartDate}
                      />
                    ) : (
                      <StatusTag
                        taskSelected={taskSelected}
                        updateStatus={updateStatus}
                      />
                    )}
                  </>
                ) : (
                  <StatusSelected
                    updateStatus={updateStatus}
                    setUpdateStatus={setUpdateStatus}
                    taskSelected={taskSelected}
                    taskParent={taskParent}
                    classNameStyle="w-[190px] mt-2"
                    setIsOpenTaskModal={setIsOpenTaskModal}
                    updateStartDate={updateStartDate}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* process/ task date */}
      <div className=" flex flex-row gap-x-6 mt-4">
        <div className="flex flex-col w-1/2 mt-2 ">
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden pr-3">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <PercentageOutlined />
              Tiến độ công việc {taskParent ? "của bộ phận" : "của nhân viên"}
            </h4>
            {taskParent && completionPercentage !== undefined ? (
              <Progress
                percent={completionPercentage}
                size="small"
                className="mt-2  pr-4"
              />
            ) : (
              <Progress
                percent={updateProgress}
                size="default"
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col w-1/2 pl-12 mt-2">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2">
            <FieldTimeOutlined />
            Thời gian
          </h4>
          {taskParent ? (
            <RangeDate
              taskSelected={taskSelected}
              updateStartDate={updateStartDate}
              updateEndDate={updateEndDate}
            />
          ) : (
            <>
              {disableUpdate ? (
                <RangeDate
                  taskSelected={taskSelected}
                  updateStartDate={updateStartDate}
                  updateEndDate={updateEndDate}
                />
              ) : (
                <RangeDateSelected
                  updateEndDate={updateEndDate}
                  updateStartDate={updateStartDate}
                  taskSelected={taskSelected}
                  disableEndDate={disableEndDate}
                  disableStartDate={disableStartDate}
                  setUpdateStartDate={setUpdateStartDate}
                  setUpdateEndDate={setUpdateEndDate}
                />
              )}
            </>
          )}
        </div>
      </div>
      <EmployeeModalSchedule
        isModalAssigneeOpen={isModalAssigneeOpen}
        setIsModalAssigneeOpen={setIsModalAssigneeOpen}
        setAssignTasks={setAssignTasks}
        assignTasks={assignTasks}
        taskSelected={taskSelected}
      />
    </div>
  );
};

export default FieldSubtask;
