import { useQuery } from "@tanstack/react-query";
import { Avatar, Empty, Image, Popover, Tooltip } from "antd";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import momenttz from "moment-timezone";
import React, { Fragment, memo, useEffect, useState } from "react";
import { GrStatusInfo } from "react-icons/gr";
import { IoLocationSharp } from "react-icons/io5";
import { LuCalendarClock, LuCalendarX2 } from "react-icons/lu";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { getDivisionDetail } from "../../../apis/divisions";
import { getEventDivisions } from "../../../apis/events";
import defaultBanner from "../../../assets/images/default_banner_images.png";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";

const EventItem = memo(({ event, gotoEventPage }) => {
  console.log("🚀 ~ EventItem ~ event:", event);
  const LabelItem = memo(({ icon, text, tooltip }) => (
    <Tooltip title={tooltip} placement="topLeft">
      <motion.div layout className="flex space-x-3">
        {/* <IoLocationSharp className="text-xl" /> */}
        {icon}
        <span className="text-sm font-normal truncate">{text}</span>
      </motion.div>
    </Tooltip>
  ));
  let percentage = 0;
  if (event?.tasks?.length > 0) {
    percentage = (
      (event?.tasks?.filter((item) => item?.status === "DONE").length /
        (event?.tasks?.length ?? 1)) *
      100
    ).toFixed(0);
  }

  let status;
  switch (event?.status) {
    case "PENDING":
      status = "Chưa bắt đầu";
      break;
    case "PREPARING":
      status = "Đang chuẩn bị";
      break;
    case "PROCESSING":
      status = "Đang diễn ra";
      break;
    case "DONE":
      status = "Đã kết thúc";
      break;
    case "CANCEL":
      status = "Hủy bỏ";
      break;
    default:
      break;
  }
  useEffect(() => {
    document.title = "Sự kiện";
  }, []);
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="w-1/3 relative pt-4 mb-10 px-5 cursor-pointer"
      onClick={() => gotoEventPage(event)}
    >
      <div className="pt-12 px-5 pb-2 bg-white rounded-lg shadow-lg">
        <p className="text-center text-xs text-slate-400 font-medium max-w-4/5 truncate">
          {event?.typeName}
        </p>

        <Popover>
          <p className="text-base font-medium text-black truncate">
            {event?.eventName}
          </p>
        </Popover>

        <div className="space-y-2 my-4">
          <LabelItem
            icon={<IoLocationSharp className="text-xl text-blue-500" />}
            text={<p className="text-sm">{event?.location}</p>}
            tooltip="Địa điểm"
          />

          <div className="flex space-x-10">
            <div className="flex-1">
              <LabelItem
                icon={<LuCalendarClock className="text-xl text-blue-500" />}
                text={
                  <p>
                    {momenttz(event?.processingDate, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    )}
                  </p>
                }
                tooltip="Thời gian diễn ra sự kiện"
              />
            </div>

            <div className="flex-1">
              <LabelItem
                icon={<LuCalendarX2 className="text-xl text-green-500" />}
                text={
                  <p>
                    {momenttz(event?.endDate, "DD/MM/YYYY").format(
                      "DD-MM-YYYY"
                    )}
                  </p>
                }
                tooltip="Thời gian kết thúc sự kiện"
              />
            </div>
          </div>

          <div className="flex space-x-10">
            <div className="flex-1">
              <LabelItem
                icon={<LuCalendarClock className="text-xl text-orange-500" />}
                text={
                  <p>
                    {momenttz(event?.startDate, "DD/MM/YYYY").format(
                      "DD-MM-YYYY"
                    )}
                  </p>
                }
                tooltip="Thời gian bắt đầu dự án"
              />
            </div>

            <div className="flex-1">
              <LabelItem
                icon={<GrStatusInfo className="text-xl" />}
                text={<p>{status}</p>}
                tooltip="Trạng thái"
              />
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-slate-300 mb-3" />

        {/* <div>
          <div className="flex justify-between items-center">
            <p className="text=xs font-medium">Tiến độ</p>
            <p className="text-sm">
              {event?.tasks?.length > 0
                ? `${
                    event?.tasks?.filter((item) => item?.status === "DONE")
                      .length
                  }/${event?.tasks?.length} Hạng Mục`
                : "Chưa có hạng mục"}
            </p>
          </div>

          <Progress percent={percentage} type="line" />
        </div> */}
      </div>

      <div className="absolute -top-2 right-0 left-0 flex justify-center overflow-hidden">
        <Image
          src={event?.coverUrl}
          width={100}
          height={60}
          fallback={defaultBanner}
          className="rounded-lg"
        />
      </div>
    </motion.div>
  );
});

const EventStaffHomePage = () => {
  const navigate = useNavigate();
  const staff = useRouteLoaderData("staff");
  const [listEventFilter, setListEventFilter] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const {
    data: listEvent,
    isLoading: listEventIsLoading,
    isError: listEventIsError,
  } = useQuery(["events"], () => getEventDivisions(), {
    select: (data) => {
      return data?.map((item) => ({
        ...item,
        startDate: momenttz(item?.startDate).format("DD-MM-YYYY"),
        endDate: momenttz(item?.endDate).format("DD-MM-YYYY"),
      }));
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: listUsers,
    isLoading: listUserIsLoading,
    isError: listUserIsError,
  } = useQuery(
    ["division", staff?.divisionID],
    () => getDivisionDetail(staff?.divisionID),
    {
      select: (data) => {
        return (
          data?.users?.map((user) => ({
            id: user?.id,
            email: user?.email,
            fullName: user?.profile?.fullName,
            avatar: user?.profile?.avatar,
          })) ?? []
        );
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleFilterEvent = (type) => {
    if (!listEventIsLoading && !listEventIsError) {
      if (type === "ALL") {
        setListEventFilter(listEvent);
      } else {
        const filterEvent = listEvent?.filter((event) => event.status === type);
        setListEventFilter(filterEvent);
      }
    }
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    handleFilterEvent(status);
  };

  const gotoEventPage = (event) => {
    navigate(`${event?.id}`, { state: { event, listEvent } });
  };
  useEffect(() => {
    // handleFilterEvent("ALL");
    handleSelectStatus("ALL");
  }, [listEvent]);

  return (
    <Fragment>
      <div className="m-8">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-between"
        >
          {/* <div className="w-1/3 bg-white rounded-md shadow-lg flex items-center justify-center space-x-3 px-5">
            <FiSearch className="text-lg" />
            <Input
              className="text-base"
              size="large"
              bordered={false}
              placeholder="Tìm kiếm tên sự kiện"
            />
          </div> */}
          <div className="flex w-full justify-end">
            {listUserIsLoading ? (
              <></>
            ) : listUserIsError ? (
              <></>
            ) : (
              <Avatar.Group
                maxCount={4}
                maxPopoverTrigger="click"
                size="large"
                maxStyle={{
                  color: "#ffffff",
                  backgroundColor: "#1677ff",
                  cursor: "pointer",
                }}
              >
                {listUsers?.map((user) => (
                  <Tooltip key={user?.id} title={user?.fullName}>
                    <Avatar src={user?.avatar} />
                  </Tooltip>
                ))}
              </Avatar.Group>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-between items-center mt-10 border-b pb-2"
        >
          <p className="text-3xl font-semibold">Sự Kiện</p>

          <div className="flex border-[2px] border-blue-500 rounded-md">
            <p
              onClick={() => handleSelectStatus("ALL")}
              className={clsx("py-2 px-3 text-sm font-normal cursor-pointer", {
                "bg-blue-500 text-white": selectedStatus === "ALL",
              })}
            >
              Tất Cả
            </p>
            <p
              onClick={() => handleSelectStatus("PREPARING")}
              className={clsx("py-2 px-3 text-sm font-normal cursor-pointer", {
                "bg-blue-500 text-white": selectedStatus === "PREPARING",
              })}
            >
              Đang chuẩn Bị
            </p>
            <p
              onClick={() => handleSelectStatus("PROCESSING")}
              className={clsx("py-2 px-3 text-sm font-normal cursor-pointer", {
                "bg-blue-500 text-white": selectedStatus === "PROCESSING",
              })}
            >
              Đang Diễn Ra
            </p>
            <p
              onClick={() => handleSelectStatus("DONE")}
              className={clsx("py-2 px-3 text-sm font-normal cursor-pointer", {
                "bg-blue-500 text-white": selectedStatus === "DONE",
              })}
            >
              Đã Hoàn Thành
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap mt-8"
        >
          {listEventIsLoading ? (
            <div className="text-2xl font-medium flex items-center justify-center w-full min-h-[calc(100vh/2)]">
              <LoadingComponentIndicator />
            </div>
          ) : listEventIsError ? (
            <div className="text-2xl font-medium flex items-center justify-center w-full min-h-[calc(100vh/2)]">
              Chưa tham gia sự kiện nào !
            </div>
          ) : (
            <AnimatePresence>
              {listEventFilter?.length > 0 ? (
                listEventFilter?.map((event) => (
                  <EventItem
                    key={event?.id}
                    event={event}
                    gotoEventPage={gotoEventPage}
                  />
                ))
              ) : (
                <div className="w-full flex items-center justify-center ">
                  <Empty
                    description={<span>Hiện tại bạn chưa có sự kiện nào</span>}
                  />
                </div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </Fragment>
  );
};

export default memo(EventStaffHomePage);
