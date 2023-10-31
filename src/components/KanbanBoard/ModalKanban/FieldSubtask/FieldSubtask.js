import {
  BulbOutlined,
  FieldTimeOutlined,
  FolderOutlined,
  TagOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Avatar, Popover, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
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
}) => {
  const [updateFileList, setUpdateFileList] = useState(taskSelected?.taskFiles);
  const [updatePriority, setUpdatePriority] = useState(taskSelected?.priority);
  const [assignTasks, setAssignTasks] = useState(taskSelected?.assignTasks);
  const [updateStatus, setUpdateStatus] = useState(taskSelected?.status);
  const [updateStartDate, setUpdateStartDate] = useState(
    taskSelected?.startDate
  );
  const [updateEndDate, setUpdateEndDate] = useState(taskSelected?.endDate);
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [updateEstimateTime, setUpdateEstimateTime] = useState(
    taskSelected?.estimationTime
  );

  // useEffect(() => {
  //   setUpdateFileList(taskSelected?.taskFiles);
  //   setUpdatePriority(taskSelected?.priority);
  //   setAssignTasks(taskSelected?.assignTasks);
  //   setUpdateStatus(taskSelected?.status);
  //   setUpdateStartDate(taskSelected?.startDate);
  //   setUpdateEndDate(taskSelected?.endDate);
  // }, [taskSelected]);

  return (
    <div className="flex flex-col ">
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-1/2">
          {/* task member */}
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
                  <Popover
                    placement="right"
                    title="Danh sách nhân viên"
                    content={
                      <div className="flex justify-start items-center mt-4 h-fit">
                        <EmployeeSelected
                          setAssignTasks={setAssignTasks}
                          assignTasks={assignTasks}
                          taskSelected={taskSelected}
                        />
                      </div>
                    }
                    trigger="click"
                  >
                    <Avatar
                      icon={<UsergroupAddOutlined className="text-black" />}
                      size="default"
                      className="cursor-pointer bg-lite"
                    />
                  </Popover>
                )}
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-col  w-1/2">
          {/* upload file */}
          <div className="flex flex-col w-full pl-12 mt-2 overflow-hidden">
            <h4 className="text-sm font-semibold flex flex-row gap-x-2">
              <FolderOutlined />
              Tài liệu
            </h4>
            {updateFileList &&
              updateFileList?.length > 0 &&
              updateFileList.map((file, index) => (
                <ListFile
                  key={index}
                  file={file}
                  updateFileList={updateFileList}
                  setUpdateFileList={setUpdateFileList}
                />
              ))}
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
      <div className=" flex flex-row gap-x-6">
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
              <StatusSelected
                updateStatus={updateStatus}
                setUpdateStatus={setUpdateStatus}
                taskSelected={taskSelected}
                taskParent={taskParent}
              />
            )}
          </div>
          {/* !isOpenStatus ? (
              <StatusTag
                updateStatus={updateStatus}
                taskSelected={taskSelected}
                setIsOpenStatus={setIsOpenStatus}
              />
            ) : (
              <StatusSelected
                updateStatus={updateStatus}
                setUpdateStatus={setUpdateStatus}
                taskSelected={taskSelected}
                taskParent={taskParent}
                setIsOpenStatus={setIsOpenStatus}
              />
            ) */}
        </div>
      </div>
      {/* task EstimateTimeout */}
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-full pl-12 mt-4">
          <h4 className="text-sm font-semibold flex flex-row gap-x-2 mb-2">
            <TagOutlined />
            Thời gian làm ước tính (giờ)
          </h4>
          <>
            {disableUpdate ? (
              <EstimateTime
                taskParent={taskParent}
                taskSelected={taskSelected}
                updateEstimateTime={updateEstimateTime}
                setUpdateEstimateTime={setUpdateEstimateTime}
                disableUpdate={disableUpdate}
              />
            ) : (
              <EstimateTime
                taskParent={taskParent}
                taskSelected={taskSelected}
                updateEstimateTime={updateEstimateTime}
                setUpdateEstimateTime={setUpdateEstimateTime}
                disableUpdate={false}
              />
            )}
          </>
        </div>
      </div>

      {/* task date */}
      <div className=" flex flex-row gap-x-6">
        <div className="flex flex-col w-full pl-12 mt-4">
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
    </div>
  );
};

export default FieldSubtask;
