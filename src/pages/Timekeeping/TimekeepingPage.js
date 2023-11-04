import React, { Fragment, useEffect, useState } from "react";
import { Button, ConfigProvider, DatePicker, Input, Table } from "antd";
import moment from "moment";
import { FcCalendar } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";

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
        <div className="flex">
          <div className="flex items-center gap-x-3 bg-white px-3 py-3">
            <FcCalendar size={30} />
            <DatePicker onChange={onChange} picker="month" />
          </div>
        </div>

        <div className="flex-1 bg-white mt-5">
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

          <ConfigProvider
            theme={{
              components: {
                Table: { headerBg: "#ffffff", headerBorderRadius: 0 },
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
        </div>
      </div>
    </Fragment>
  );
};

export default TimekeepingPage;
