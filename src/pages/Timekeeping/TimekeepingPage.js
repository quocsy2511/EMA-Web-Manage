import React, { Fragment, useEffect, useState } from "react";
import { Button, ConfigProvider, DatePicker, Input, Select, Table } from "antd";
import moment from "moment";
import { FcCalendar } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbCalendarCog, TbCalendarEvent, TbCalendarX } from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";
import EmptyTimeKeeping from "../../components/Error/EmptyTimeKeeping";

import "moment/locale/vi";
import { useQuery } from "@tanstack/react-query";
import { getFilterEvent } from "../../apis/events";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";

// const listAllDatesInMonthWithWeek = (date) => {
//   if (!date) return [];
//   const firstDayOfMonth = moment(
//     `${date?.split("-")[0]}-${date?.split("-")[1]}-01`,
//     "YYYY-MM-DD"
//   );
//   const lastDayOfMonth = firstDayOfMonth.clone().endOf("month");

//   const dates = [];

//   let currentDay = firstDayOfMonth.clone();
//   while (currentDay.isSameOrBefore(lastDayOfMonth)) {
//     dates.push({
//       date: currentDay.format("YYYY-MM-DD"),
//       weekdayVi: currentDay.format("dddd", "vi"), // Get Vietnamese weekday
//     });
//     currentDay.add(1, "day");
//   }

//   return dates;
// };

const listDatesInRange = (startDate, endDate) => {
  if (!startDate || !endDate) return [];

  const firstDayOfRange = moment(startDate, "YYYY-MM-DD");
  const lastDayOfRange = moment(endDate, "YYYY-MM-DD");

  const dates = [];

  let currentDay = firstDayOfRange.clone();

  if (firstDayOfRange.isSame(lastDayOfRange, "day")) {
    dates.push({
      date: currentDay.format("YYYY-MM-DD"),
      weekdayVi: currentDay.format("dddd", "vi"), // Get Vietnamese weekday
    });
  } else {
    while (currentDay.isSameOrBefore(lastDayOfRange)) {
      dates.push({
        date: currentDay.format("YYYY-MM-DD"),
        weekdayVi: currentDay.format("dddd", "vi"), // Get Vietnamese weekday
      });
      currentDay.add(1, "day");
    }
  }

  return dates;
};

const TimekeepingPage = () => {
  // const [datePicker, setDatePicker] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [columns, setColumns] = useState([]);
  const [searchText, setSearchText] = useState();
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (selectedEvent) {
      const datesInTimeGap = listDatesInRange(
        selectedEvent.processingDate,
        selectedEvent.endDate
      );
      const newColumns = [
        {
          title: "Nhân viên",
          dataIndex: "user",
          key: "user",
          fixed: "left",
          width: 250,
        },
        ...datesInTimeGap.map((item) => ({
          title: (
            <div
              className={`text-center ${
                (item.weekdayVi === "thứ bảy" ||
                  item.weekdayVi === "chủ nhật") &&
                "text-red-500"
              }`}
            >
              <p className="text-xs font-normal">{item.weekdayVi}</p>
              <p className="text-base font-medium">{item.date.split("-")[2]}</p>
            </div>
          ),
          dataIndex: item.date.split("-")[2],
          key: item.date.split("-")[2],
          width: 150,
        })),
      ];
      setColumns(newColumns);
    }
  }, [selectedEvent]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      // refetch();
    }, 1500);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchText]);

  const {
    data: events,
    isLoading: eventsIsLoading,
    isError: eventsIsError,
  } = useQuery(
    ["events"],
    () =>
      getFilterEvent({ pageSize: 100, currentPage: 1, nameSort: "createdAt" }),
    {
      select: (data) => {
        return data.data.map((event) => ({
          id: event.id,
          eventName: event.eventName,
          processingDate: moment(event.processingDate).format("YYYY-MM-DD"),
          startDate: event.startDate,
          endDate: event.endDate,
        }));
      },
    }
  );

  const onChange = (value) => {
    const selectedEvent = events.find((event) => {
      if (event.id === value) return event;
    });
    console.log("selectedEvent: ", selectedEvent);
    setSelectedEvent(selectedEvent);

    // setDatePicker([selectedEvent.processingDate, selectedEvent.endDate]);
  };

  if (eventsIsLoading)
    return (
      <div className="h-[calc(100vh-64px)] w-full">
        <LoadingComponentIndicator />
      </div>
    );

  if (eventsIsError)
    return (
      <div className="h-[calc(100vh-64px)] w-full">
        <AnErrorHasOccured />
      </div>
    );

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] px-10 pt-5 pb-10 flex flex-col">
        <div className="flex gap-x-10">
          <div className="w-[20%] flex items-center gap-x-3 bg-white px-3 py-3 rounded-md">
            <FcCalendar size={30} />
            <Select
              className="w-full"
              options={events.map((event) => ({
                value: event.id,
                label: event.eventName,
              }))}
              placeholder="Chọn 1 sự kiện"
              onChange={onChange}
            />
          </div>
          <div className="w-[20%] flex items-center gap-x-3 bg-white px-8 py-3 rounded-md">
            <TbCalendarCog size={30} />
            <div>
              <p className="text-lg font-semibold">Ngày chuẩn bị</p>
              <p className="text-sm font-medium">
                {moment(selectedEvent?.processingDate).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>
          <div className="w-[20%] flex items-center gap-x-3 bg-white px-8 py-3 rounded-md">
            <TbCalendarEvent size={30} />
            <div>
              <p className="text-lg font-semibold">Ngày diễn ra</p>
              <p className="text-sm font-medium">
                {moment(selectedEvent?.startDate).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>
          <div className="w-[20%] flex items-center gap-x-3 bg-white px-8 py-3 rounded-md">
            <TbCalendarX size={30} />
            <div>
              <p className="text-lg font-semibold">Ngày kết thúc</p>
              <p className="text-sm font-medium">
                {moment(selectedEvent?.endDate).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white mt-5 overflow-hidden rounded-md">
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key="has-date"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
              >
                <div className="mx-4 my-3">
                  <Input
                    prefix={<FiSearch className="mr-1" />}
                    className="w-[20%]"
                    placeholder="Tìm kiếm theo tên nhân viên"
                    // value={searchText}
                    allowClear
                    onChange={(e) => {
                      // setSearchText(e.target.value);
                      // if (e.target.value === "") {
                      //   setFilteredData();
                      // }
                    }}
                    // onPressEnter={searchGlobal}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {1 + 1 === 2 ? (
                    <motion.div
                      key="timekeepings"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                    >
                      <ConfigProvider
                        theme={{
                          components: {
                            Table: {
                              headerBg: "#ffffff",
                              headerBorderRadius: 0,
                            },
                          },
                        }}
                      >
                        <Table
                          columns={columns}
                          dataSource={[]}
                          bordered
                          scroll={{
                            x: "150%",
                            y: "100%",
                            scrollToFirstRowOnChange: true,
                          }}
                          // sticky={{
                          //   offsetHeader: 64,
                          // }}
                          sticky={true}
                        />
                      </ConfigProvider>
                      <div className="mt-4 mr-4 flex items-center justify-end gap-x-3">
                        <Select
                          value={pageSize}
                          options={[
                            { label: "10 / trang", value: 10 },
                            { label: "20 / trang", value: 20 },
                            { label: "50 / trang", value: 50 },
                          ]}
                        />

                        <div className="flex items-centerflex items-center text-xs gap-x-3">
                          <p>
                            Từ
                            <span className="mx-1 font-semibold">1</span>
                            đến
                            <span className="mx-1 font-semibold">15</span>
                            bản ghi
                          </p>
                          <IoIosArrowBack
                            size={15}
                            className={`text-slate-400 cursor-pointer`}
                          />
                          <IoIosArrowForward
                            size={15}
                            className={`text-slate-400 cursor-pointer`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <EmptyTimeKeeping key="no-timekeeping" />
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyTimeKeeping key="no-date" isEmptyDate={true} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Fragment>
  );
};

export default TimekeepingPage;
