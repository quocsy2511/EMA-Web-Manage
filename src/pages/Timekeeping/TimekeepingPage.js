import React, { Fragment, useEffect, useState } from "react";
import { Button, ConfigProvider, DatePicker, Input, Select, Table } from "antd";
import moment from "moment";
import { FcCalendar } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import EmptyTimeKeeping from "../../components/Error/EmptyTimeKeeping";

import "moment/locale/vi";

const listAllDatesInMonthWithWeek = (date) => {
  if (!date) return [];
  const firstDayOfMonth = moment(
    `${date?.split("-")[0]}-${date?.split("-")[1]}-01`,
    "YYYY-MM-DD"
  );
  const lastDayOfMonth = firstDayOfMonth.clone().endOf("month");

  const dates = [];

  let currentDay = firstDayOfMonth.clone();
  while (currentDay.isSameOrBefore(lastDayOfMonth)) {
    dates.push({
      date: currentDay.format("YYYY-MM-DD"),
      weekdayVi: currentDay.format("dddd", "vi"), // Get Vietnamese weekday
    });
    currentDay.add(1, "day");
  }

  return dates;
};

const TimekeepingPage = () => {
  const [datePicker, setDatePicker] = useState();
  const [columns, setColumns] = useState([]);
  const [searchText, setSearchText] = useState();
  const [pageSize, setPageSize] = useState(10);

  const onChange = (date, dateString) => {
    console.log(dateString.split("-")[0]);
    console.log(dateString.split("-")[1]);
    setDatePicker(dateString);
  };

  useEffect(() => {
    const datesInMonthWithWeek = listAllDatesInMonthWithWeek(datePicker);
    const newColumns = [
      {
        title: "Nhân viên",
        dataIndex: "user",
        key: "user",
        fixed: "left",
        width: 250,
      },
      ...datesInMonthWithWeek.map((item) => ({
        title: (
          <div
            className={`text-center ${
              (item.weekdayVi === "thứ bảy" || item.weekdayVi === "chủ nhật") &&
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
  }, [datePicker]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      // refetch();
    }, 1500);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchText]);

  console.log("columns: ", columns);

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] px-10 pt-5 pb-10 flex flex-col">
        <div className="flex gap-x-2">
          <div className="w-[15%] flex items-center gap-x-3 bg-white px-3 py-3">
            <FcCalendar size={30} />
            <DatePicker className="w-full" onChange={onChange} picker="month" />
          </div>
        </div>

        <div className="flex-1 bg-white mt-5 overflow-hidden">
          <AnimatePresence mode="wait">
            {datePicker ? (
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
