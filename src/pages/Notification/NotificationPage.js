import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Dropdown, message } from "antd";
import { Fragment } from "react";
import { BsCheck2, BsThreeDots } from "react-icons/bs";
import {
  getAllNotification,
  seenAllNotification,
  seenNotification,
} from "../../apis/notifications";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import { motion } from "framer-motion";
import moment from "moment";
import { defaultAvatar } from "../../constants/global";
import { useRouteLoaderData } from "react-router-dom";

const NotificationPage = () => {
  const manager = useRouteLoaderData("manager");
  const staff = useRouteLoaderData("staff");

  const [isSeeAll, setIsSeeAll] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);

  const [renderNotifications, setRenderNotifications] = useState([]);
  console.log("renderNotifications > ", renderNotifications);

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["notifications"],
    () => getAllNotification(10, currentPage, isSeeAll ? "ALL" : "UNREAD"),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    currentPage === 1 && refetch();
  }, [isSeeAll]);

  useEffect(() => {
    notifications?.currentPage === 1
      ? setRenderNotifications(notifications?.data ?? [])
      : setRenderNotifications((prev) => [
          ...prev,
          ...(notifications?.data ?? []),
        ]);
  }, [notifications]);

  const queryClient = useQueryClient();
  const {
    mutate: seenAllNotificationMutate,
    isLoading: seenAllNotificationIsLoading,
  } = useMutation(seenAllNotification, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const { mutate: seenNotificationMutate } = useMutation(
    (notificationId) => seenNotification(notificationId),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(["notifications"], (oldValue) => {
          console.log("oldValue: ", oldValue);
          const updatedOldData = oldValue.data.map((item) => {
            if (item.id === variables.notificationId) {
              return { ...item, readFlag: 1 };
            }
            return item;
          });
          return updatedOldData;
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const hanleClickNotification = (notification) => {
    notification?.isRead === 0 && seenNotificationMutate(notification?.id);

    if (manager) {
    } else if (staff) {
    }
  };

  const changeMode = () => {
    setIsSeeAll((prev) => !prev);
  };

  if (isLoading)
    return (
      <div className="w-full min-h-[calc(100vh-64px)]">
        <LoadingComponentIndicator />
      </div>
    );

  if (isError)
    return (
      <div className="w-full min-h-[calc(100vh-64px)]">
        <AnErrorHasOccured />
      </div>
    );

  return (
    <Fragment>
      {contextHolder}
      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] pt-10 pb-20 flex flex-col items-center justify-center"
      >
        <div className="bg-white rounded-xl py-4 px-4 w-2/5">
          <div className="flex justify-between items-center px-2">
            <p className="text-lg font-bold">Thông báo</p>
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div
                        onClick={(e) => {
                          // e.stopPropagation();
                          seenAllNotificationMutate();
                        }}
                        className="flex items-center gap-x-2"
                      >
                        <BsCheck2 size={15} className="text-green-600" />
                        <p className="text-xs font-medium">
                          Đánh dấu tất cả là đã đọc
                        </p>
                      </div>
                    ),
                    key: "0",
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <BsThreeDots size={15} className="cursor-pointer text-xl" />
            </Dropdown>
          </div>

          <div className="flex mt-1 px-2 space-x-2">
            <div
              className={`cursor-pointer px-2 py-1 rounded-full font-medium border-2 border-transparent ${
                isSeeAll && "bg-blue-100/50 border-blue-500 text-blue-600"
              }`}
              onClick={changeMode}
            >
              Tất cả
            </div>
            <div
              className={`cursor-pointer px-2 py-1 rounded-full font-medium border-2 border-transparent ${
                !isSeeAll && "bg-blue-100/50 border-blue-500 text-blue-600"
              }`}
              onClick={changeMode}
            >
              Chưa đọc
            </div>
          </div>

          <div className="mt-3 space-y-1 min-h-[50vh] relative">
            {!renderNotifications?.length ? (
              <div className="absolute top-0 bottom-5 right-0 left-0 flex items-center justify-center">
                <p className="text=lg font-medium">Không có thông báo nào.</p>
              </div>
            ) : (
              renderNotifications?.map((noti) => {
                let time;
                const currentDate = moment().subtract(7, "hours");
                const targetDate = moment(noti?.createdAt);
                const duration = moment.duration(currentDate.diff(targetDate));

                if (duration.asMinutes() < 1) {
                  // Less than 1 minute
                  time = `bây giờ`;
                } else if (duration.asHours() < 1) {
                  time = `${Math.floor(duration.asMinutes())} phút trước`;
                } else if (duration.asDays() < 1) {
                  // Less than 1 day
                  time = `${Math.floor(duration.asHours())} giờ trước`;
                } else if (duration.asDays() < 7) {
                  // Less than 1 week
                  time = `${Math.floor(duration.asDays())} ngày trước`;
                } else if (duration.asMonths() < 1) {
                  // Less than 1 month
                  time = `${Math.floor(duration.asDays() / 7)} tuần trước`;
                } else {
                  // More than 1 month
                  time = `${Math.floor(duration.asMonths())} tháng trước`;
                }

                return (
                  <motion.div
                    key={noti?.id}
                    className="flex items-center px-2 py-3 gap-x-3 cursor-pointer hover:bg-slate-100 rounded-lg"
                    onClick={() => {
                      hanleClickNotification(noti);
                    }}
                  >
                    <Avatar
                      size={40}
                      src={noti?.avatarSender ?? defaultAvatar}
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {noti?.content?.split("đã")[0]}{" "}
                        </span>
                        đã {noti?.content?.split("đã")[1]}
                      </p>
                      <p className="text-blue-400">{time}</p>
                    </div>
                    {noti?.isRead === 0 ? (
                      <div className="w-[8px] h-[8px] bg-blue-600 rounded-full" />
                    ) : (
                      <div className="w-[8px]" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {notifications?.nextPage && (
            <p
              className="mt-5 w-full py-1 text-center text-base text-blue-400 font-normal cursor-pointer hover:bg-slate-500/10 transition-colors border-lg"
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
              }}
            >
              Tải thêm
            </p>
          )}
        </div>
      </motion.div>
    </Fragment>
  );
};

export default NotificationPage;
