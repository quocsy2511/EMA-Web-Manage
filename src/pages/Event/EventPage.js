import React, { Fragment, useEffect, useState } from "react";
import { ConfigProvider, DatePicker, Input, Select } from "antd";
import { BsSearch } from "react-icons/bs";
import viVN from "antd/locale/vi_VN";
import EventItem from "../../components/Event/EventItem";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFilterEvent } from "../../apis/events";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { PiSortAscending, PiSortDescending } from "react-icons/pi";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import moment from "moment/moment";
import emptyEventImg from "../../assets/images/empty_event.png";

const EventPage = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState();
  const [searchDate, setSearchDate] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [sort, setSort] = useState("DESC");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery(["event", page], () =>
    getFilterEvent({
      pageSize: 6,
      currentPage: page,
      nameSort: "createdAt",
      eventName: searchText,
      monthYear: searchDate,
      status: searchStatus,
      sort,
    })
  );
  console.log("data: ", data);

  useEffect(() => {
    refetch();
  }, [searchDate, searchStatus, sort]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      refetch();
    }, 1500);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchText]);

  const goToCreateEventPage = () => {
    navigate("addition");
  };

  const handleButtonClick = (newSort) => {
    setIsButtonDisabled(true);

    if (newSort === "ASC") {
      setSort("ASC");
    } else {
      setSort("DESC");
    }

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
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

      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="flex items-center mt-6"
      >
        <Input
          onPressEnter={(value) => {
            if (value) setSearchText(value.nativeEvent.target.value);
            else setSearchText();
          }}
          onChange={(value) => {
            if (value) setSearchText(value.nativeEvent.target.value);
            else setSearchText();
          }}
          size="large"
          placeholder="Tìm tên sự kiện"
          prefix={<BsSearch className="text-slate-500" />}
          allowClear
          className="w-[32%] cursor-pointer"
          // value={searchDate ? searchDate : null}
        />

        <div className="w-[1.8%]" />

        <ConfigProvider locale={viVN}>
          <DatePicker
            type="year"
            picker="month"
            onChange={(value, dateString) => {
              if (value) setSearchDate(dateString);
              else setSearchDate();
            }}
            size="large"
            placeholder="Thời gian"
            className="w-[16%] cursor-pointer"
            value={searchDate ? moment(searchDate, "YYYY-MM") : null}
          />
        </ConfigProvider>

        <div className="w-[1.8%]" />

        <Select
          className="w-[14.5%]"
          placeholder="Trạng thái"
          onChange={(value) => {
            if (value) setSearchStatus(value);
            else setSearchStatus();
          }}
          size="large"
          options={[
            {
              value: "",
              label: "Tất cả",
            },
            {
              value: "PENDING",
              label: "Đang chuẩn bị",
            },
            {
              value: "PROCESSING",
              label: "Đang diễn ra",
            },
            {
              value: "DONE",
              label: "Đã kết thúc",
            },
            {
              value: "CANCEL",
              label: "Hủy bỏ",
            },
          ]}
          value={searchStatus}
        />

        <div className="flex-1 flex flex-col items-end">
          <AnimatePresence mode="wait">
            {sort === "DESC" ? (
              <motion.div
                key="desc"
                initial={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PiSortAscending
                  onClick={() => !isButtonDisabled && handleButtonClick("ASC")}
                  className="cursor-pointer"
                  size={25}
                />
              </motion.div>
            ) : (
              <motion.div
                key="asc"
                initial={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PiSortDescending
                  onClick={() => !isButtonDisabled && handleButtonClick("DESC")}
                  className="cursor-pointer"
                  size={25}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-6">
        {!isLoading ? (
          isError ? (
            <AnErrorHasOccured />
          ) : (
            <>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="mt-5 flex flex-wrap gap-x-[2%] gap-y-7">
                  {data.data.length > 0 ? (
                    <AnimatePresence>
                      {data.data.map((event) => (
                        <EventItem key={event.id} event={event} />
                      ))}
                    </AnimatePresence>
                  ) : (
                    <div className="flex-1 flex flex-col items-center gap-y-4 justify-center bg-white m-auto py-[5%] rounded-2xl">
                      <img src={emptyEventImg} className="w-64 h-64" />
                      <p className="text-lg font-medium">
                        Không tìm thấy sự kiện nào!
                      </p>
                    </div>
                  )}
                </div>
                {data.data.length === 6 && (
                  <div className="flex items-center justify-center gap-x-3 mt-8">
                    <MdOutlineKeyboardArrowLeft
                      className={`text-slate-500 ${
                        data.prevPage
                          ? "cursor-pointer hover:text-blue-600"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() =>
                        data.prevPage && setPage((prev) => prev - 1)
                      }
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
                      onClick={() =>
                        data.nextPage && setPage((prev) => prev + 1)
                      }
                      size={25}
                    />
                  </div>
                )}
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
