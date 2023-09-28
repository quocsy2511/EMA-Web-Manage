import React, { Fragment, useState } from "react";
import { ConfigProvider, DatePicker, Input } from "antd";
import { BsSearch } from "react-icons/bs";
import viVN from "antd/locale/vi_VN";
import EventItem from "../../components/Event/EventItem";
import { motion } from "framer-motion";

const EventPage = () => {
  const dummyEvents = [
    {
      title: "Lễ tốt nghiệp",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut  aliquip ex ea commodo consequat.",
      endDate: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      status: "Ongoing",
      users: [{ url: "" }, { url: "" }, { url: "" }, { url: "" }, { url: "" }],
      tasks: [
        {
          id: 1,
          title: "",
        },
        {
          id: 2,
          title: "",
        },
        {
          id: 3,
          title: "",
        },
        {
          id: 3,
          title: "",
        },
        {
          id: 3,
          title: "",
        },
      ],
    },
    {
      title: "Lễ tốt nghiệp",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut  aliquip ex ea commodo consequat.",
      endDate: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      status: "Ongoing",
      users: [{ url: "" }, { url: "" }, { url: "" }],
      tasks: [
        {
          id: 1,
          title: "",
        },
        {
          id: 2,
          title: "",
        },
        {
          id: 3,
          title: "",
        },
      ],
    },
    {
      title: "Lễ tốt nghiệp",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut  aliquip ex ea commodo consequat.",
      endDate: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      status: "Ongoing",
      users: [{ url: "" }, { url: "" }, { url: "" }],
      tasks: [
        {
          id: 1,
          title: "",
        },
        {
          id: 2,
          title: "",
        },
        {
          id: 3,
          title: "",
        },
      ],
    },
    {
      title: "Lễ tốt nghiệp",
      desc: "ris nisi ut  aliquip ex ea commodo consequat.",
      endDate: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      status: "Ongoing",
      users: [{ url: "" }, { url: "" }, { url: "" }],
      tasks: [
        {
          id: 1,
          title: "",
        },
        {
          id: 2,
          title: "",
        },
        {
          id: 3,
          title: "",
        },
      ],
    },
  ];

  const [events, setEvents] = useState(dummyEvents);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // console.log(searchText);
  console.log(searchDate);

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-8">
        <div className="flex justify-between items-center">
          <motion.p
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="text-2xl font-semibold"
          >
            Sự kiện
          </motion.p>
          <motion.button
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            whileHover={{ scale: 1.1 }}
            className="bg-[#1677ff] text-white text-base font-medium px-4 py-2 rounded-lg"
          >
            Tạo mới
          </motion.button>
        </div>

        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="flex mt-6"
        >
          <Input
            // onChange={(value) => {
            //   console.log(value)
            //   clearTimeout(identifier);
            //   identifier = setTimeout(() => {
            //     setSearchText(value.nativeEvent.data);
            //   }, 2000);
            // }}
            onPressEnter={(value) => {
              setSearchText(value.nativeEvent.target.value);
            }}
            size="large"
            placeholder="Tìm tên sự kiện"
            prefix={<BsSearch className="text-slate-500" />}
            allowClear
            className="w-[32%] cursor-pointer"
            // value={searchText}
          />

          <div className="w-[1.8%]" />

          <ConfigProvider locale={viVN}>
            <DatePicker
              type="year"
              onChange={(value) => {
                setSearchDate(value["$d"]);
              }}
              size="large"
              placeholder="Thời gian"
              className="w-[16%] cursor-pointer"
            />
          </ConfigProvider>
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-5 flex flex-wrap justify-between gap-y-7"
        >
          {events.map((event) => (
            <EventItem event={event} />
          ))}
        </motion.div>
      </div>
    </Fragment>
  );
};

export default EventPage;
