import React, { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "antd";
import { FaLongArrowAltRight } from "react-icons/fa";
import { BsHourglassSplit, BsHourglassBottom } from "react-icons/bs";
import { RiAttachment2 } from "react-icons/ri";
import { LiaClipboardListSolid } from "react-icons/lia";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdFilterListAlt } from "react-icons/md";
import EventTaskSelection from "../../components/Selection/EventTaskSelection";
import TaskItem from "../../components/Task/TaskItem";

const EventTaskPage = () => {
  const eventId = useParams().eventId;

  const [tasks, setTasks] = useState([1, 2, 3]);
  const [assigneeSelection, setAssigneeSelection] = useState();
  const [prioritySelection, setPrioritySelection] = useState();
  const [devisionSelection, setDevisionSelection] = useState();

  console.log(assigneeSelection);
  console.log(prioritySelection);
  console.log(devisionSelection);

  const resetFilter = () => {
    setAssigneeSelection();
    setPrioritySelection();
    setDevisionSelection();
  };

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-8 pt-4">
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="flex justify-between items-center"
        >
          <p className="text-base font-medium text-slate-400">
            <Link to=".." relative="path">
              Sự kiện
            </Link>
            / Khai giảng
          </p>
          {/* <motion.button
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            whileHover={{ scale: 1.1 }}
            className="bg-[#1677ff] text-white text-base font-medium px-4 py-2 rounded-lg"
          >
            Tạo mới
          </motion.button> */}
        </motion.div>

        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="flex items-center"
        >
          <p className="text-2xl font-semibold">Khai giảng</p>

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
            className={`text-sm font-medium px-4 py-1.5 bg-green-200 text-green-400 rounded-xl`}
          >
            Ongoing
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 text-end"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-[#1677ff] text-white text-base font-medium px-4 py-2 rounded-lg "
            >
              Tạo công việc
            </motion.button>
          </motion.div>

          <div className="w-[6%]" />

          <div className="flex justify-end gap-x-6">
            <div className="text-center">
              <p className="mb-2 text-sm">Ngày diễn ra</p>
              <div className="flex items-center px-3 py-1.5 bg-green-200 text-green-400 rounded-xl">
                <BsHourglassSplit size={15} />
                <div className="w-4" />
                <p className="text-sm font-medium">28/9/2023</p>
              </div>
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm">Ngày kết thúc</p>
              <div className="flex items-center px-3 py-1.5 bg-green-200 text-green-400 rounded-xl">
                <BsHourglassBottom size={15} />
                <div className="w-4" />
                <p className="text-sm font-medium">28/9/2023</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl px-10 py-8 mt-5"
        >
          <div className="flex items-center justify-between">
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
              state={assigneeSelection}
              setState={setAssigneeSelection}
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
              state={prioritySelection}
              setState={setPrioritySelection}
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
              state={devisionSelection}
              setState={setDevisionSelection}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              // Sort ascendingly
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
            />

            <motion.button
              whileHover={{
                color: "white",
                backgroundColor: "rgb(239, 68, 68)",
                scale: 1.1,
              }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={resetFilter}
              className="flex items-center gap-x-2 border border-red-500 text-red-500 text-base px-3 py-1.5 rounded-lg"
            >
              Reset
              <MdFilterListAlt size={18} />
            </motion.button>
          </div>

          <div className="flex flex-col gap-y-6 mt-8">
            <AnimatePresence>
              {tasks.map((task) => (
                <TaskItem task={task} />
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
      </div>
    </Fragment>
  );
};

export default EventTaskPage;
