import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { AnimatePresence, motion } from "framer-motion";

const NotificationPage = () => {
  const [isSeeAll, setIsSeeAll] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: notifications,
    isLoading,
    isError,
    isRefetching,
  } = useQuery(["notifications"], getAllNotification, {
    select: (data) => {
      return data.data;
    },
  });
  console.log("isRefetching notifications: ", isRefetching);
  console.log("notifications: ", notifications);

  const {
    mutate: seenAllNotificationMutate,
    isLoading: seenAllNotificationIsLoading,
  } = useMutation(seenAllNotification, {
    onSuccess: (data) => {},
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
      onSuccess: (data) => {},
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const hanleSeenNotification = (notificationId) => {
    seenNotificationMutate(notificationId);
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

  let renderNotifications;
  if (isSeeAll) renderNotifications = notifications;
  else
    renderNotifications = notifications.filter((item) => item.readFlag === 1);

  return (
    <Fragment>
      {contextHolder}
      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] px-10 sm:px-20 md:px-72 pt-5 pb-10 flex flex-col"
      >
        <div className="bg-white rounded-xl py-4 px-4">
          <div className="flex justify-between items-center px-2">
            <p className="text-lg font-bold">Thông báo</p>
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div className="flex items-center gap-x-2">
                        <BsCheck2 size={15} />
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
              <BsThreeDots size={15} className="cursor-pointer" />
            </Dropdown>
          </div>

          <div className="flex mt-1 px-2 space-x-2">
            <div
              className={`cursor-pointer px-2 py-1 rounded-full font-medium border-2 border-transparent ${
                isSeeAll && "bg-blue-200 border-blue-500 text-blue-500"
              }`}
              onClick={changeMode}
            >
              Tất cả
            </div>
            <div
              className={`cursor-pointer px-2 py-1 rounded-full font-medium border-2 border-transparent ${
                !isSeeAll && "bg-blue-200 border-blue-500 text-blue-500"
              }`}
              onClick={changeMode}
            >
              Chưa đọc
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {renderNotifications.map((noti) => {
              return (
                <motion.div
                  key={noti.id}
                  // whileHover={{ backgroundColor: "rgb(255,255,255,0.5)" }}
                  className="flex items-center px-2 py-3 gap-x-3 cursor-pointer hover:bg-slate-100 rounded-lg"
                  onClick={() => {
                    hanleSeenNotification(noti.id);
                  }}
                >
                  <Avatar size={40} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">Huy Đoàn </span>
                      đã thêm bạn vào sự kiện đã thêm bạn vào sự kiện đã thêm
                      bạn vào sự kiện đã thêm bạn vào sự kiện
                    </p>
                  </div>
                  {noti.readFlag === 0 ? (
                    <div className="w-[8px] h-[8px] bg-blue-600 rounded-full" />
                  ) : (
                    <div className="w-[8px]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default NotificationPage;
