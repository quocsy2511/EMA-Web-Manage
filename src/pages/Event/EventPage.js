import React, { Fragment, useState } from "react";
import { ConfigProvider, DatePicker, Input } from "antd";
import { BsSearch } from "react-icons/bs";
import viVN from "antd/locale/vi_VN";
import EventItem from "../../components/Event/EventItem";
import { motion } from "framer-motion";
import {
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllEvent } from "../../apis/events";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";

const EventPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery(["event", page], () =>
    getAllEvent({ pageSize: 6, currentPage: page })
  );

  console.log("data: ", data);

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const goToCreateEventPage = () => {
    navigate("addition");
  };

  return (
    <Fragment>
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
          onClick={goToCreateEventPage}
        >
          Tạo mới
        </motion.button>
      </div>

      <div className="mt-6">
        {!isLoading ? (
          isError ? (
            <AnErrorHasOccured />
          ) : (
            <>
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="flex"
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
              >
                <div className="mt-5 flex flex-wrap justify-between gap-y-7">
                  {data.data.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}

                  {/* {data.data.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))} */}
                </div>
                <div className="flex items-center justify-center gap-x-3 mt-8">
                  <MdOutlineKeyboardArrowLeft
                    className={`text-slate-500 ${
                      data.prevPage
                        ? "cursor-pointer hover:text-blue-600"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => data.prevPage && setPage((prev) => prev - 1)}
                    size={25}
                  />
                  {Array.from({ length: data.lastPage }, (_, index) => (
                    <div
                      key={index}
                      className={`border border-slate-300 rounded-xl px-4 py-2 text-base font-medium cursor-pointer hover:bg-blue-200 ${
                        page === index + 1 &&
                        "text-blue-600 border-blue-800 bg-blue-100"
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </div>
                  ))}
                  <MdOutlineKeyboardArrowRight
                    className={`text-slate-500 ${
                      data.nextPage
                        ? "cursor-pointer hover:text-blue-600"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => data.nextPage && setPage((prev) => prev + 1)}
                    size={25}
                  />
                </div>
              </motion.div>
            </>
          )
        ) : (
          <LoadingComponentIndicator />
        )}
      </div>
    </Fragment>
  );
};

export default EventPage;
