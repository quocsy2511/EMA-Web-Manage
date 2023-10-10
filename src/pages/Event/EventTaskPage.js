import React, { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Progress, Tooltip } from "antd";
import { FaLongArrowAltRight } from "react-icons/fa";
import {
  BsHourglassSplit,
  BsHourglassBottom,
  BsTagsFill,
  BsTagFill,
} from "react-icons/bs";
import { RiAttachment2, RiEditFill } from "react-icons/ri";
import { LiaClipboardListSolid } from "react-icons/lia";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdFilterListAlt, MdLocationPin } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FcMoneyTransfer } from "react-icons/fc";
import EventTaskSelection from "../../components/Selection/EventTaskSelection";
import TaskItem from "../../components/Task/TaskItem";
import TaskAdditionModal from "../../components/Modal/TaskAdditionModal";
import { useQuery } from "@tanstack/react-query";
import { getDetailEvent } from "../../apis/events";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi"); // Set the locale to Vietnamese

const Tag = ({ icon, text }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="flex items-center gap-x-2 px-5 py-2 rounded-full border border-slate-300 cursor-pointer"
  >
    {icon}
    <p className="text-sm font-normal">{text}</p>
  </motion.div>
);

const color = {
  green: "hsl(156.62deg 81.93% 32.55%)",
};

const EventTaskPage = () => {
  const eventId = useParams().eventId;
  console.log("eventId: ", eventId);

  const { data, isLoading, isError } = useQuery(["event-detail", eventId], () =>
    getDetailEvent(eventId)
  );

  console.log("data: ", data);

  const [tasks, setTasks] = useState([1, 2, 3]);
  const [assigneeSelection, setAssigneeSelection] = useState();
  const [prioritySelection, setPrioritySelection] = useState();
  const [devisionSelection, setDevisionSelection] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);

  let status, statusColor, statusBgColor;

  const resetFilter = () => {
    setAssigneeSelection();
    setPrioritySelection();
    setDevisionSelection();
  };

  const handleOpenModal = () => {
    setIsOpenModal((prev) => !prev);
  };

  if (data) {
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
  }

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

  return (
    <Fragment>
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
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU" />
        </Avatar.Group>

        <div className="w-5" />

        <p
          className={`text-sm font-medium px-4 py-1.5 ${statusBgColor} ${statusColor} shadow-md shadow-slate-300 rounded-xl`}
        >
          {status}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 text-end"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-[#1677ff] text-white text-base font-medium px-4 py-2 rounded-lg"
            onClick={handleOpenModal}
          >
            Tạo công việc
          </motion.button>
          <TaskAdditionModal
            isModalOpen={isOpenModal}
            setIsModalOpen={setIsOpenModal}
            // parentTaskId="1"
          />
        </motion.div>
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
          <p className="w-[60%] text-sm text-slate-400 mt-3">
            {data.description}
          </p>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-5 mt-6">
            <Tag
              icon={<MdLocationPin size={20} color={color.green} />}
              text={data.location}
            />
            <Tag
              icon={<FcMoneyTransfer size={20} />}
              text={`${data.estBudget.toLocaleString("en-US")} VNĐ`}
            />
            <Tag
              icon={<BsTagsFill size={20} color={color.green} />}
              text="5 hạng mục"
            />
            <Tag
              icon={<BsTagFill size={20} color={color.green} />}
              text="60 công việc"
            />
            <Tag
              icon={<BiSolidCommentDetail size={20} color={color.green} />}
              text="45 bình luận"
            />
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
              <p className="text-base font-semibold">Tiến độ các Task lớn</p>
              <Tooltip title="3/25 task lớn đã xong">
                <Progress percent={70} />
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl px-10 py-8 mt-10 mb-20"
      >
        <div className="flex items-center gap-x-5">
          <EventTaskSelection
            title="Người giao"
            placeholder="Chọn nhân viên"
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "jack1",
                label: "Jack1",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
            value={assigneeSelection}
            updatevalue={setAssigneeSelection}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          <EventTaskSelection
            title="Ưu tiên"
            placeholder="Mức độ"
            options={[
              {
                value: "1",
                label: "Normal",
              },
              {
                value: "2",
                label: "High",
              },
              {
                value: "3",
                label: "Risk",
              },
            ]}
            value={prioritySelection}
            updatevalue={setPrioritySelection}
          />
          <EventTaskSelection
            title="Bộ phận"
            placeholder="Chọn bộ phận"
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "jack1",
                label: "Jack1",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
            value={devisionSelection}
            updatevalue={setDevisionSelection}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            // Sort ascendingly
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
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
            {tasks.map((task, index) => (
              <TaskItem key={index} task={task} isSubtask={false} />
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end gap-x-6 mt-8">
          <div className="flex items-center gap-x-1">
            <LiaClipboardListSolid size={20} className="text-slate-400" />
            <p className="text-slate-500">{tasks.length} công việc</p>
          </div>
          <div className="flex items-center gap-x-1">
            <HiOutlineClipboardDocumentList
              size={20}
              className="text-slate-400"
            />
            <p className="text-slate-500">15 công việc con</p>
          </div>
          <div className="flex items-center gap-x-1">
            <RiAttachment2 size={20} className="text-slate-400" />
            <p className="text-slate-500">15 tài liệu đính kèm</p>
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default EventTaskPage;
