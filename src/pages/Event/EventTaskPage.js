import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, FloatButton, Progress, Tooltip } from "antd";
import { FaLongArrowAltRight, FaUserFriends } from "react-icons/fa";
import {
  BsHourglassSplit,
  BsHourglassBottom,
  BsTagsFill,
  BsPlus,
} from "react-icons/bs";
import { RiAttachment2, RiEditFill } from "react-icons/ri";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdFilterListAlt, MdLocationPin } from "react-icons/md";
import {
  FcMoneyTransfer,
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import EventTaskSelection from "../../components/Selection/EventTaskSelection";
import TaskItem from "../../components/Task/TaskItem";
import TaskAdditionModal from "../../components/Modal/TaskAdditionModal";
import { useQuery } from "@tanstack/react-query";
import { getDetailEvent } from "../../apis/events";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import moment from "moment";
import "moment/locale/vi";
import { filterTask, getTasks } from "../../apis/tasks";
import EmptyList from "../../components/Error/EmptyList";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

moment.locale("vi"); // Set the locale to Vietnam

const Tag = ({ icon, text, width }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`flex items-center gap-x-2 px-5 py-2 rounded-full border border-slate-300 cursor-pointer ${width}`}
  >
    {icon}
    <p className="text-sm font-normal">{text}</p>
  </motion.div>
);

const color = {
  green: "hsl(156.62deg 81.93% 32.55%)",
  blue: "#1677ff",
};

const EventTaskPage = () => {
  const eventId = useParams().eventId;

  const [assigneeSelection, setAssigneeSelection] = useState();
  const [prioritySelection, setPrioritySelection] = useState();
  const [statusSelection, setStatusSelection] = useState();

  const { data, isLoading, isError } = useQuery(["event-detail", eventId], () =>
    getDetailEvent(eventId)
  );
  console.log("DATA : ", data);

  const {
    data: tasks,
    isLoading: taskIsLoading,
    isError: taskIsError,
  } = useQuery(
    ["tasks", eventId],
    () =>
      getTasks({
        fieldName: "eventID",
        conValue: eventId,
        pageSize: 50,
        currentPage: 1,
      }),
    {
      select: (data) => {
        return data.filter((item) => !item.parent);
      },
    }
  );
  console.log("tasks: ", tasks);

  const {
    data: filterTasks,
    isLoading: filterTaskIsLoading,
    isError: filterTaskIsError,
    refetch,
  } = useQuery(
    ["filter-tasks"],
    () =>
      filterTask({
        assignee: assigneeSelection,
        eventID: eventId,
        priority: prioritySelection,
        status: statusSelection,
      }),
    {
      select: (data) => {
        return data.filter((item) => !item.parent);
      },
    }
  );
  console.log("filterTasks: ", filterTasks);

  useEffect(() => {
    if (assigneeSelection || prioritySelection || statusSelection) {
      refetch();
    }
  }, [assigneeSelection, prioritySelection, statusSelection]);

  const [isOpenModal, setIsOpenModal] = useState(false);

  let status, statusColor, statusBgColor;

  const resetFilter = () => {
    setAssigneeSelection();
    setPrioritySelection();
    setStatusSelection();
  };

  const handleOpenModal = () => {
    setIsOpenModal((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-128px)]">
        <LoadingComponentIndicator />;
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[calc(100vh-128px)]">
        <AnErrorHasOccured />;
      </div>
    );
  }

  switch (data.status) {
    case "PENDING":
      status = "Chờ bắt đầu";
      statusColor = "text-slate-500";
      statusBgColor = "bg-slate-100";
      break;
    case "PROCESSING":
      status = "Đang diễn ra";
      statusColor = "text-orange-500";
      statusBgColor = "bg-orange-100";
      break;
    case "DONE":
      status = "Đã kết thúc";
      statusColor = "text-green-500";
      statusBgColor = "bg-green-100";
      break;
    case "CANCEL":
      status = "Hủy bỏ";
      statusColor = "text-red-500";
      statusBgColor = "bg-red-100";
      break;
    default:
      break;
  }

  return (
    <Fragment>
      <FloatButton
        onClick={handleOpenModal}
        icon={<BsPlus />}
        type="primary"
        tooltip={<p>Tạo công việc</p>}
      />
      <TaskAdditionModal
        isModalOpen={isOpenModal}
        setIsModalOpen={setIsOpenModal}
        eventId={eventId}
        date={[data.startDate, data.endDate]}
        staffs={data.listDivision}
      />
      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to=".." relative="path">
            Sự kiện{" "}
          </Link>
          / {data.eventName}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex items-center"
      >
        <p className="text-2xl font-semibold">{data.eventName}</p>

        <div className="w-5" />

        <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />

        <FaLongArrowAltRight className="mx-3" color="#9A9A9A" size={20} />

        <Avatar.Group
          maxCount={3}
          maxPopoverTrigger="hover"
          maxStyle={{ color: "#D25B68", backgroundColor: "#F4D7DA" }}
        >
          {data.listDivision.map((item) => (
            <Tooltip
              title={`${item.fullName} - bộ phận ${item.divisionName}`}
              placement="top"
            >
              <Avatar
                className="bg-slate-300 cursor-pointer"
                src={
                  // item.avatar ??
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
                }
                alt="avatar"
              />
            </Tooltip>
          ))}
        </Avatar.Group>

        <div className="w-5" />

        <p
          className={`text-sm font-medium px-4 py-1.5 ${statusBgColor} ${statusColor} shadow-md shadow-slate-300 rounded-xl`}
        >
          {status}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl mt-8 overflow-hidden"
      >
        <div className="bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg')] bg-auto bg-center h-40" />
        <div className="mx-10 my-8">
          <div className="flex items-center gap-x-5">
            <p className="flex-1 text-3xl font-bold">{data.eventName}</p>
            <Link to="budget">
              <motion.div
                whileHover={{ y: -4 }}
                className="text-base text-slate-400 border border-slate-400 px-3 py-1 rounded-md cursor-pointer"
              >
                Ngân sách
              </motion.div>
            </Link>
            <RiEditFill className="cursor-pointer text-slate-400" size={20} />
          </div>

          <div
            className="w-[60%] text-sm text-slate-400 mt-3"
            dangerouslySetInnerHTML={{
              __html: new QuillDeltaToHtmlConverter(
                JSON.parse(data.description)
              ).convert(),
            }}
          />

          <div className="flex items-center flex-wrap gap-x-4 gap-y-5 mt-6">
            <Tag
              icon={<MdLocationPin size={20} color={color.green} />}
              text={data.location}
              width={"max-w-[20%] truncate"}
            />
            <Tag
              icon={<FcMoneyTransfer size={20} />}
              text={`${data.estBudget.toLocaleString("en-US")} VNĐ`}
            />
            <Tag
              icon={<BsTagsFill size={20} color={color.green} />}
              text={`${tasks?.length ?? 0} hạng mục`}
            />
          </div>

          <div className="mt-6">
            <p className=" font-medium">Bộ phận chịu trách nhiệm</p>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-3 mt-3">
              {data.listDivision.map((division) => (
                <Tag
                  icon={<FaUserFriends size={20} color={color.blue} />}
                  text={`${division.fullName} - ${division.divisionName}`}
                  width={"truncate"}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-20 gap-y-5 mt-10">
            <div>
              <div className="flex items-center gap-x-2">
                <BsHourglassSplit size={20} color={color.green} />
                <p className="text-lg font-semibold">Ngày diễn ra</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-5" />
                <p className="text-xs text-slate-400">
                  {new Date(data.startDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <BsHourglassBottom size={20} color={color.green} />
                <p className="text-lg font-semibold">Ngày kết thúc</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-5" />
                <p className="text-xs text-slate-400">
                  {/* {moment(data.endDate).format("dddd, D [tháng] M, YYYY")} */}
                  {new Date(data.endDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="w-[40%]">
              <p className="text-base font-semibold">Tiến độ các hạng mục</p>
              {tasks && tasks?.length !== 0 ? (
                <Tooltip
                  title={`${
                    tasks.filter((item) => item.status === "DONE").length
                  }/${tasks.length} hạng mục đã xong`}
                >
                  <Progress
                    percent={
                      tasks.filter((item) => item.status === "DONE").length /
                      tasks.length
                    }
                  />
                </Tooltip>
              ) : (
                <p className="text-slate-500">Chưa có hạng mục</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl px-10 py-8 mt-10 mb-20"
      >
        {!taskIsLoading && !filterTaskIsLoading ? (
          taskIsError || filterTaskIsError ? (
            <AnErrorHasOccured />
          ) : (
            <>
              <div className="flex items-center gap-x-5">
                <EventTaskSelection
                  title="Trưởng phòng"
                  placeholder="Chọn trưởng phòng"
                  options={data.listDivision.map((division) => ({
                    value: division.userId,
                    label: division.fullName,
                  }))}
                  value={assigneeSelection}
                  updatevalue={setAssigneeSelection}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
                <EventTaskSelection
                  title="Ưu tiên"
                  placeholder="Mức độ"
                  options={[
                    {
                      value: "LOW",
                      label: (
                        <div className="flex items-center gap-x-2">
                          <FcLowPriority />
                          <span>Thấp</span>
                        </div>
                      ),
                    },
                    {
                      value: "MEDIUM",
                      label: (
                        <div className="flex items-center gap-x-2">
                          <FcMediumPriority />
                          <span>Trung bình</span>
                        </div>
                      ),
                    },
                    {
                      value: "HIGH",
                      label: (
                        <div className="flex items-center gap-x-2">
                          <FcHighPriority />
                          <span>Cao</span>
                        </div>
                      ),
                    },
                  ]}
                  value={prioritySelection}
                  updatevalue={setPrioritySelection}
                />
                <EventTaskSelection
                  title="Trạng thái"
                  placeholder="Chọn trạng thái"
                  options={[
                    {
                      value: "PENDING",
                      label: <p className="text-gray-400">Đang kiểm thực</p>,
                    },
                    {
                      value: "PROCESSING",
                      label: <p className="text-blue-400">Đang thực hiện</p>,
                    },
                    {
                      value: "DONE",
                      label: <p className="text-green-500">Hoàn thành</p>,
                    },
                    {
                      value: "CONFIRM",
                      label: <p className="text-pink-500">Đã xác thực</p>,
                    },
                    {
                      value: "CANCEL",
                      label: <p className="text-red-500">Hủy bỏ</p>,
                    },
                    {
                      value: "OVERDUE",
                      label: <p className="text-orange-500">Quá hạn</p>,
                    },
                  ]}
                  value={statusSelection}
                  updatevalue={setStatusSelection}
                />

                <div className="flex-1" />

                <motion.button
                  whileHover={{
                    scale: 1.1,
                  }}
                  transition={{ type: "spring", duration: 0.5 }}
                  onClick={resetFilter}
                  className="flex items-center gap-x-2 border hover:bg-red-500 hover:text-white border-red-500 text-red-500 text-base px-3 py-1.5 rounded-lg"
                >
                  Đặt lại bộ lọc
                  <MdFilterListAlt size={18} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-y-6 mt-8">
                <AnimatePresence mode="await">
                  {assigneeSelection || prioritySelection || statusSelection ? (
                    filterTasks.length === 0 ? (
                      <EmptyList
                        key="empty-task"
                        title="Chưa có công việc nào!"
                      />
                    ) : (
                      filterTasks.map((task) => (
                        <TaskItem key={task.id} task={task} isSubtask={false} />
                      ))
                    )
                  ) : tasks.length === 0 ? (
                    <EmptyList
                      key="empty-task"
                      title="Chưa có công việc nào!"
                    />
                  ) : (
                    tasks.map((task) => (
                      <TaskItem key={task.id} task={task} isSubtask={false} />
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-end gap-x-6 mt-8">
                <div className="flex items-center gap-x-1">
                  <LiaClipboardListSolid size={20} className="text-slate-400" />
                  <p className="text-slate-500">
                    {assigneeSelection || prioritySelection || statusSelection
                      ? filterTasks.length
                      : tasks.length}{" "}
                    công việc
                  </p>
                </div>
                {/* <div className="flex items-center gap-x-1">
                  <HiOutlineClipboardDocumentList
                    size={20}
                    className="text-slate-400"
                  />
                  <p className="text-slate-500">15 công việc con</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <RiAttachment2 size={20} className="text-slate-400" />
                  <p className="text-slate-500">15 tài liệu đính kèm</p>
                </div> */}
              </div>
            </>
          )
        ) : (
          <LoadingComponentIndicator />
        )}
      </motion.div>
    </Fragment>
  );
};

export default EventTaskPage;
