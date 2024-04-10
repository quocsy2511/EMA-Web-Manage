import { useQuery } from "@tanstack/react-query";
import { Avatar, ConfigProvider, Input, Select, Table } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { FcCalendar } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { TbCalendarCog, TbCalendarEvent, TbCalendarX } from "react-icons/tb";
import { getEventParticipant, getFilterEvent } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import EmptyTimeKeeping from "../../components/Error/EmptyTimeKeeping";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";

import "moment/locale/vi";
import { getTimekeeping } from "../../apis/timekeepings";

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
  const [selectedEvent, setSelectedEvent] = useState();
  const [columns, setColumns] = useState([]);
  const [searchText, setSearchText] = useState();

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
          render: (_, record) => {
            return (
              <div className="flex items-center gap-x-2">
                <Avatar src={record.avatar} />
                <p>{record.fullName}</p>
                {record.role === "STAFF" && (
                  <div className="bg-yellow-600 w-[10px] h-[10px] rounded-full" />
                )}
              </div>
            );
          },
        },
        ...datesInTimeGap.map((item) => {
          const date = item.date.split("-");
          const parseDate = `date${date[2]}${date[1]}${date[0]}`;

          return {
            title: (
              <div
                className={`text-center ${
                  (item.weekdayVi === "thứ bảy" ||
                    item.weekdayVi === "chủ nhật") &&
                  "text-red-500"
                }`}
              >
                <p className="text-xs font-normal">{item.weekdayVi}</p>
                <p className="text-base font-medium">
                  {item.date.split("-")[2]}
                </p>
              </div>
            ),
            dataIndex: parseDate,
            key: parseDate,
            render: (_, record) => {
              if (!record[parseDate])
                return (
                  <p
                    className={`${
                      (item.weekdayVi === "thứ bảy" ||
                        item.weekdayVi === "chủ nhật") &&
                      "text-red-500"
                    }`}
                  >
                    -- : --
                  </p>
                );
              const time = record[parseDate].split(":");
              return (
                <p className="border-2 py-2 rounded-2xl font-medium">{`${time[0]}h : ${time[1]}m`}</p>
              );
            },
            width: 150,
            align: "center",
          };
        }),
      ];
      setColumns(newColumns);
    }
    if (!eventParticipant) {
      eventParticipantRefetch();
      if (!timekeepings) timekeepingsFetching();
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
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: eventParticipant,
    isError: eventParticipantIsError,
    isFetching: eventParticipantIsFetching,
    refetch: eventParticipantRefetch,
  } = useQuery(
    ["event-user", selectedEvent?.id],
    () => getEventParticipant(selectedEvent?.id),
    {
      select: (data) => {
        return data.map((user) => {
          const { address, dob, gender, nationalId, phoneNumber, ...rest } =
            user;
          return rest;
        });
      },
      enabled: !!selectedEvent?.id,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: timekeepings,
    isError: timekeepingsIsError,
    isFetching: timekeepingsIsFetching,
    refetch: timekeepingsFetching,
  } = useQuery(
    ["timekeeping", selectedEvent?.id],
    () =>
      getTimekeeping({
        eventId: selectedEvent?.id,
        startDate: selectedEvent?.processingDate,
        endDate: selectedEvent?.endDate,
        me: false,
      }),
    {
      select: (data) => {
        return data;
      },
      enabled: !!selectedEvent?.id && !!eventParticipant,
      refetchOnWindowFocus: false,
    }
  );

  let renderItem = eventParticipant ?? [];
  if (!!eventParticipant && !!timekeepings) {
    renderItem = eventParticipant.map((user) => {
      timekeepings?.map((timekeeping) => {
        if (timekeeping?.user?.id === user.id) {
          const splitDate = timekeeping?.date?.split("-");
          const date = `date${splitDate[2]}${splitDate[1]}${splitDate[0]}`;
          user = { ...user, [date]: timekeeping.checkinTime };
        }
      });

      return user;
    });
  }

  const onChange = (value) => {
    const selectedEvent = events.find((event) => {
      if (event.id === value) return event;
    });
    setSelectedEvent(selectedEvent);
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
          {selectedEvent && (
            <>
              {" "}
              <motion.div
                key={selectedEvent?.processingDate}
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-[20%] flex items-center gap-x-3 bg-white px-8 py-3 rounded-md"
              >
                <TbCalendarCog size={30} />
                <div>
                  <p className="text-lg font-semibold">Ngày chuẩn bị</p>
                  <p className="text-sm font-medium">
                    {moment(selectedEvent?.processingDate).format("DD-MM-YYYY")}
                  </p>
                </div>
              </motion.div>
              <motion.div
                key={selectedEvent?.startDate}
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-[20%] flex items-center gap-x-3 bg-white px-8 py-3 rounded-md"
              >
                <TbCalendarEvent size={30} />
                <div>
                  <p className="text-lg font-semibold">Ngày diễn ra</p>
                  <p className="text-sm font-medium">
                    {moment(selectedEvent?.startDate).format("DD-MM-YYYY")}
                  </p>
                </div>
              </motion.div>
              <motion.div
                key={selectedEvent?.endDate}
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-[20%] flex items-center gap-x-3 bg-white px-8 py-3 rounded-md"
              >
                <TbCalendarX size={30} />
                <div>
                  <p className="text-lg font-semibold">Ngày kết thúc</p>
                  <p className="text-sm font-medium">
                    {moment(selectedEvent?.endDate).format("DD-MM-YYYY")}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </div>

        <div className="flex-1 bg-white mt-5 overflow-hidden rounded-md pb-5">
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
                  {timekeepings?.length !== 0 ? (
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
                          // loading={
                          //   eventParticipantIsFetching || timekeepingsIsFetching
                          // }
                          dataSource={renderItem}
                          bordered
                          scroll={{
                            x: "150%",
                            y: "100%",
                            scrollToFirstRowOnChange: true,
                          }}
                          sticky={true}
                          pagination={false}
                        />
                      </ConfigProvider>
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
