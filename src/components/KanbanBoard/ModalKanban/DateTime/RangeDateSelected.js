import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, message, DatePicker, Button } from "antd";
import React, { useState } from "react";
import { updateTask } from "../../../../apis/tasks";
import moment from "moment";
import dayjs from "dayjs";
import { useRouteLoaderData } from "react-router-dom";
import { SwapRightOutlined } from "@ant-design/icons";

const RangeDateSelected = ({
  taskSelected,
  disableEndDate,
  disableStartDate,
  setUpdateStartDate,
  setUpdateEndDate,
  updateEndDate,
  updateStartDate,
}) => {
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
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
    if (dateString?.length > 0) {
      const formatStart = moment(dateString?.[0], "DD-MM-YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const formatEnd = moment(dateString?.[1], "DD-MM-YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const isoStartDate = moment(formatStart).toISOString();
      const isoEndDate = moment(formatEnd).toISOString();
      setStartDateUpdate(isoStartDate);
      setEndDateUpdate(isoEndDate);
    }
  };

  ///////////////validate Date
  const formattedDate = (value) => {
    const date = moment(value).format("DD-MM-YYYY HH:mm");
    return date;
  };

  const disabledDate = (current) => {
    if (current.isBefore(disableStartDate, "day")) {
      return (
        current.isBefore(disableEndDate, "day") ||
        current.isAfter(disableEndDate, "day")
      );
    } else {
      console.log("1: ", current.isBefore(today));
      return (
        (current.isBefore(today) && !current.isSame(today, "day")) ||
        current.isAfter(disableEndDate, "day")
      );
    }
  };

  const hourTodayStart = moment(today).format("HH");
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledRangeTime = (current, type) => {
    if (current?.isSame(today, "day")) {
      return {
        disabledHours: () => range(0, hourTodayStart),
      };
    }
  };

  const { mutate: updateDate, isLoading } = useMutation(
    (task) => updateTask(task),
    {
      onSuccess: () => {
        setUpdateStartDate(startDateUpdate);
        setUpdateEndDate(endDateUpdate);
        queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
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
        <div className="flex justify-start items-center mt-4 px-3 cursor-pointer">
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
                  disabledTime={disabledRangeTime}
                  format="DD-MM-YYYY HH:00"
                  onFocus={onFocusRangePicker}
                  allowClear={false}
                  showTime={{
                    format: "HH",
                    hideDisabledOptions: true,
                  }}
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
              className={` px-[6px] py-[2px] w-fit text-sm font-medium flex justify-start items-center gap-x-1 hover:text-blue-600  ${
                taskSelected.status === "CANCEL" ||
                taskSelected.status === "OVERDUE"
                  ? "bg-red-300 bg-opacity-20 text-red-600 rounded-md"
                  : taskSelected.status === "DONE"
                  ? "bg-green-300 bg-opacity-20 text-green-600 rounded-md"
                  : ""
              }`}
              onClick={() => setIsOpenDate(true)}
            >
              {formattedDate(updateStartDate)} <SwapRightOutlined />{" "}
              {formattedDate(updateEndDate)}
            </span>
          )}
        </div>
      ) : (
        <div className="flex justify-start items-center mt-4 px-3 cursor-pointer">
          <RangePicker onChange={onChangeDate} format="DD-MM-YYYY" />
        </div>
      )}
    </>
  );
};

export default RangeDateSelected;
