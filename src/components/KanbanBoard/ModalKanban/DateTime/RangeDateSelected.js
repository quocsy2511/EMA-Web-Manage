import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, message, DatePicker, Button } from "antd";
import React, { useState } from "react";
import { updateTask } from "../../../../apis/tasks";
import moment from "moment";
import dayjs from "dayjs";

const RangeDateSelected = ({
  taskSelected,
  disableEndDate,
  disableStartDate,
  setUpdateStartDate,
  setUpdateEndDate,
  updateEndDate,
  updateStartDate,
}) => {
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [startDateUpdate, setStartDateUpdate] = useState("");
  const [endDateUpdate, setEndDateUpdate] = useState("");
  const [isRangePickerFocused, setIsRangePickerFocused] = useState(false);
  const [isRangePickerCancel, setIsRangePickerCancel] = useState(false);
  const today = moment();

  const { RangePicker } = DatePicker;
  const eventID = taskSelected?.eventDivision?.event?.id;
  const parentTask = taskSelected?.parent?.id;
  const queryClient = useQueryClient();
  const taskID = taskSelected?.id;

  const onFocusRangePicker = () => {
    setIsRangePickerFocused(true);
    setIsRangePickerCancel(true);
  };
  const onBlurRangePicker = () => {
    setIsRangePickerFocused(false);
    setIsRangePickerCancel(false);
  };

  const onChangeDate = (value, dateString) => {
    const isoStartDate = moment(dateString[0]).toISOString();
    const isoEndDate = moment(dateString[1]).toISOString();
    setStartDateUpdate(isoStartDate);
    setEndDateUpdate(isoEndDate);
  };

  ///////////////validate Date
  const formattedDate = (value) => {
    const date = moment(value).format("DD/MM");
    return date;
  };

  const disabledDate = (current) => {
    if (current.isBefore(disableStartDate, "day")) {
      return (
        current.isBefore(disableEndDate, "day") ||
        current.isAfter(disableEndDate, "day")
      );
    } else {
      return current.isBefore(today) || current.isAfter(disableEndDate, "day");
    }
  };

  const { mutate: updateDate, isLoading } = useMutation(
    (task) => updateTask(task),
    {
      onSuccess: () => {
        setUpdateStartDate(startDateUpdate);
        setUpdateEndDate(endDateUpdate);
        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["subtaskDetails"], taskID);
        setIsRangePickerFocused(false);
        setIsRangePickerCancel(false);
        message.open({
          type: "success",
          content: "Cập nhật thời gian công việc  thành công",
        });
        setIsOpenDate(false);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Cập nhật thời gian công việc thất bại",
        });
      },
    }
  );
  const updateTimeFinish = (value) => {
    const {
      approvedBy,
      assignTasks,
      createdAt,
      createdBy,
      event,
      id,
      modifiedBy,
      parent,
      status,
      subTask,
      taskFiles,
      updatedAt,
      ...rest
    } = taskSelected;
    const data = {
      ...rest,
      startDate: startDateUpdate,
      endDate: endDateUpdate,
      eventID: eventID,
      parentTask: parentTask,
      taskID: taskID,
    };
    updateDate(data);
  };

  return (
    <>
      {taskSelected?.startDate && taskSelected?.endDate !== null ? (
        <div className="flex justify-start items-center mt-4 px-3">
          {isOpenDate ? (
            <Form onFinish={updateTimeFinish} name="date">
              <Form.Item
                name="date"
                className="mb-0"
                rules={[
                  {
                    type: "array",
                    required: true,
                    message: "Please select time!",
                  },
                ]}
                initialValue={[
                  dayjs(taskSelected.startDate).utcOffset(7).local(),
                  dayjs(taskSelected.endDate).utcOffset(7).local(),
                ]}
              >
                <RangePicker
                  placeholder={["ngày bắt đầu  ", "ngày kết thúc "]}
                  disabledDate={disabledDate}
                  onChange={onChangeDate}
                  format="YYYY/MM/DD"
                  onFocus={onFocusRangePicker}
                  allowClear={false}
                />
              </Form.Item>
              <div className="flex flex-row gap-x-2">
                {isRangePickerFocused && (
                  <Button type="link" htmlType="submit" loading={isLoading}>
                    Lưu
                  </Button>
                )}
                {isRangePickerCancel && (
                  <Button type="link" onClick={() => onBlurRangePicker()}>
                    Huỷ
                  </Button>
                )}
              </div>
            </Form>
          ) : (
            <span
              className={` px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 ${
                taskSelected.status === "CANCEL" ||
                taskSelected.status === "OVERDUE"
                  ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                  : taskSelected.status === "DONE"
                  ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                  : ""
              }`}
              onClick={() => setIsOpenDate(true)}
            >
              {formattedDate(updateStartDate)} - {formattedDate(updateEndDate)}
            </span>
          )}
        </div>
      ) : (
        <div className="flex justify-start items-center mt-4 px-3">
          <RangePicker
            showTime={{
              format: "HH:mm:ss",
            }}
            onChange={onChangeDate}
            format="YYYY/MM/DD HH:mm:ss"
          />
        </div>
      )}
    </>
  );
};

export default RangeDateSelected;
