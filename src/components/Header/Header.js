import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Avatar, Badge, Button, Dropdown } from "antd";
import { Header as HeaderLayout } from "antd/es/layout/layout";
import clsx from "clsx";
import momenttz from "moment-timezone";
import React from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { HiOutlineBell, HiOutlineBellAlert } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { getAllNotification, seenNotification } from "../../apis/notifications";
import { defaultAvatar } from "../../constants/global";
import TEXT from "../../constants/string";
import { chatDetailActions } from "../../store/chat_detail";
import { chatsActions } from "../../store/chats";
import { closeConnectSocket } from "../../utils/socket";

const NotiLabel = ({
  item,
  navigate,
  location,
  manager,
  staff,
  seenNotificationMutate,
}) => {
  let time;

  const currentDate = momenttz();
  const targetDate = momenttz(item?.createdAt);

  if (currentDate.diff(targetDate, "minutes") < 2) {
    time = `bây giờ`;
  } else if (currentDate.diff(targetDate, "hours") < 1) {
    time = `${currentDate.diff(targetDate, "minutes")} phút trước`;
  } else if (currentDate.diff(targetDate, "days") < 1) {
    time = `${currentDate.diff(targetDate, "hours")} giờ trước`;
  } else if (currentDate.diff(targetDate, "weeks") < 1) {
    time = `${currentDate.diff(targetDate, "days")} ngày trước`;
  } else if (currentDate.diff(targetDate, "months") < 1) {
    time = `${currentDate.diff(targetDate, "weeks")} tuần trước`;
  } else if (currentDate.diff(targetDate, "years") < 1) {
    time = `${currentDate.diff(targetDate, "months")} tháng trước`;
  } else if (currentDate.diff(targetDate, "years") >= 1) {
    time = `${currentDate.diff(targetDate, "years")} năm trước`;
  }

  const handleNavigate = () => {
    if (item?.isRead === 0) seenNotificationMutate(item?.id);

    switch (item?.type) {
      case "TASK":
        if (!!manager) {
          if (
            location?.pathname !==
            `/manager/event/${item?.eventID}/${item?.commonId}`
          ) {
            // Navigate to event -> entry task
            navigate(`/manager/event/${item?.eventID}`, {
              state: {
                isNavigate: true,
                parentTaskId: item?.commonId,
              },
              replace: true,
            });
          }
        }

        if (!!staff) {
          if (location?.pathname !== `/staff/event/${item?.eventID}`) {
            // Navigate to event -> entry task
            navigate(`/staff/event/${item?.eventID}`, {
              state: {
                isNavigate: true,
                parentTaskId: item?.commonId,
              },
              replace: true,
            });
          }
        }
        break;

      case "SUBTASK":
        if (!!manager) {
          if (
            location?.pathname !==
            `/manager/event/${item?.eventID}/${item?.parentTaskId}`
          ) {
            // Navigate to event -> entry task -> open subtask
            navigate(`/manager/event/${item?.eventID}`, {
              state: {
                isNavigate: true,
                parentTaskId: item?.parentTaskId,
                subtaskId: item?.commonId,
              },
              replace: true,
            });
          }
        }

        if (!!staff) {
          navigate(`/staff/event/${item?.eventID}`, {
            state: {
              isNavigate: true,
              taskId: item?.commonId,
            },
            replace: true,
          });
        }
        break;

      case "COMMENT":
        if (!!manager) {
          if (
            location?.pathname !==
            `/manager/event/${item?.eventID}/${item?.commonId}`
          ) {
            // Navigate to event -> entry task -> show comment
            navigate(`/manager/event/${item?.eventID}`, {
              state: {
                isNavigate: true,
                parentTaskId: item?.commonId,
              },
              replace: true,
            });
          }
        }

        if (!!staff) {
          navigate(`/staff/event/${item?.eventID}`, {
            state: {
              isNavigate: true,
              taskId: item?.commonId,
            },
            replace: true,
          });
        }
        break;

      case "COMMENT_SUBTASK":
        if (!!manager) {
          if (
            location?.pathname !==
            `/manager/event/${item?.eventID}/${item?.parentTaskId}`
          ) {
            // Navigate to event -> entry task -> open subtask -> show comment
            navigate(`/manager/event/${item?.eventID}`, {
              state: {
                isNavigate: true,
                parentTaskId: item?.parentTaskId,
                subtaskId: item?.commonId,
              },
              replace: true,
            });
          }
        }

        if (!!staff) {
          navigate(`/staff/event/${item?.eventID}`, {
            state: {
              isNavigate: true,
              taskId: item?.commonId,
              parentTaskId: item?.parentTaskId,
            },
            replace: true,
          });
        }
        break;

      case "CONTRACT":
        if (!!manager) {
          if (location?.pathname !== `/manager/customer`) {
            navigate(`/manager/customer`, {
              state: {
                isNavigate: true,
                contractId: item?.commonId,
              },
              replace: true,
            });
          }
        }

        if (!!staff) {
        }
        break;

      case "BUDGET":
        if (!!manager) {
          if (location?.pathname !== `/manager/event/${item?.eventID}/budget`) {
            navigate(`/manager/event/${item?.eventID}`, {
              state: {
                isNavigate: true,
                isBudget: true,
              },
              replace: true,
            });
          }
        }

        if (!!staff) {
          navigate(`/staff/event/${item?.eventID}`, {
            state: {
              isNavigate: true,
              isBudget: true,
              parentTaskId: item?.parentTaskId,
              contractId: item?.contractId,
            },
            replace: true,
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center gap-x-3 min-w-[300px]"
    >
      <Avatar size={45} src={item?.avatarSender} />
      <div className="flex-1">
        <p className="text-sm max-w-[280px] overflow-hidden">
          <span className="font-bold">{item?.content.split("đã")[0]}</span>
          đã {item?.content.split("đã")[1]}
        </p>
        <p className="text-blue-400">{time}</p>
      </div>
      <div>
        <div
          className={clsx(
            "w-[8px] h-[8px] rounded-full",
            {
              "bg-blue-500": item?.isRead === 0,
            },
            {
              "bg-transparent": item?.isRead === 1,
            }
          )}
        />
      </div>
    </div>
  );
};

const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const manager = useRouteLoaderData("manager");
  const staff = useRouteLoaderData("staff");
  const administrator = useRouteLoaderData("administrator");

  const { message } = App.useApp();

  const dispatch = useDispatch();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(
    ["notifications", 10, 1, "ALL"],
    () => getAllNotification(10, 1, "ALL"),
    {
      select: (data) => {
        return data?.data;
      },
      refetchOnWindowFocus: false,
      enabled: !administrator,
    }
  );

  const queryClient = useQueryClient();
  const { mutate: seenNotificationMutate } = useMutation(
    (notificationId) => seenNotification(notificationId),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(
          ["notifications", 10, 1, "ALL"],
          (oldValue) => {
            const updatedOldData = {
              ...oldValue,

              data: {
                totalUnreadNotifications:
                  oldValue?.data?.totalUnreadNotifications - 1,
                notifications: oldValue?.data?.notifications?.map((item) => {
                  if (item?.id === variables) {
                    return { ...item, isRead: 1 };
                  }
                  return item;
                }),
              },
            };
            return updatedOldData;
          }
        );
      },
      onError: (error) => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra!",
        });
      },
    }
  );

  const logout = () => {
    localStorage.removeItem("token");

    closeConnectSocket();
    dispatch(chatsActions.resetChats());
    dispatch(chatDetailActions.resetChatDetail());

    navigate("/");
  };

  const userItems = [
    {
      key: "1",
      label: manager ? (
        <Link to="/manager/profile">Hồ sơ</Link>
      ) : (
        <Link to="/staff/profile">Hồ sơ</Link>
      ),
    },

    {
      key: "2",
      danger: true,
      label: (
        <div onClick={logout} className="flex items-center space-x-2">
          <IoLogOutOutline size={20} />
          <p className="text-sm">Đăng xuất</p>
        </div>
      ),
    },
  ];

  return (
    <HeaderLayout
      className={`${
        collapsed ? "w-[calc(100%-80px)]" : "w-[calc(100%-230px)]"
      } p-0 bg-white border-b-2 h-16 fixed z-50`}
    >
      <div className="flex justify-between items-center pr-8">
        <Button
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        >
          {collapsed ? (
            <AiOutlineMenuUnfold size={25} />
          ) : (
            <AiOutlineMenuFold size={25} />
          )}
        </Button>

        <div className="flex items-center">
          <div className="cursor-pointer flex items-center">
            {(!!manager || !!staff) && (
              <Dropdown
                menu={{
                  // items: notiItems,
                  items: [
                    ...(notifications?.notifications?.map((noti) => ({
                      key: noti.id,
                      label: (
                        <NotiLabel
                          item={noti}
                          navigate={navigate}
                          location={location}
                          manager={manager}
                          staff={staff}
                          seenNotificationMutate={seenNotificationMutate}
                        />
                      ),
                    })) ?? []),
                    {
                      key: "navigate",
                      label: (
                        <p
                          onClick={() =>
                            !!manager
                              ? navigate("/manager/notification")
                              : !!staff && navigate("/staff/notification")
                          }
                          className="text-center text-blue-400"
                        >
                          Xem tất cả
                        </p>
                      ),
                    },
                  ],
                }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <Badge
                  size={"default"}
                  count={
                    notifications?.totalUnreadNotifications &&
                    notifications?.totalUnreadNotifications >= 10
                      ? "9+"
                      : notifications?.totalUnreadNotifications ?? 0
                  }
                  offset={[-2, 2]}
                  title={`${
                    notifications?.totalUnreadNotifications ?? 0
                  } thông báo`}
                  onClick={(e) => e.preventDefault()}
                >
                  {notifications?.totalUnreadNotifications === 0 ? (
                    <HiOutlineBell size={25} />
                  ) : (
                    <HiOutlineBellAlert size={25} />
                  )}
                </Badge>
              </Dropdown>
            )}›
          </div>

          <div className="w-10" />

          <div className="cursor-pointer">
            <Dropdown
              menu={{
                items: userItems,
              }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center">
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold">
                    {manager
                      ? manager.fullName ?? "Tên người dùng"
                      : staff
                      ? staff.fullName ?? "Tên người dùng"
                      : administrator
                      ? administrator.fullName ?? "Tên người dùng"
                      : "Tên người dùng"}
                  </p>
                  <p className="text-xs font-normal">
                    {manager
                      ? manager.role === TEXT.MANAGER && "Quản lý"
                      : staff
                      ? staff.role === TEXT.STAFF && "Trưởng nhóm"
                      : administrator
                      ? administrator.role === TEXT.ADMINISTRATOR && "Admin"
                      : "Vai trò"}
                  </p>
                </div>
                <div className="w-2" />
                <Avatar
                  size={40}
                  icon={
                    <div className="flex items-center justify-center h-full">
                      <FaUser />
                    </div>
                  }
                  alt="user_image"
                  src={
                    manager?.avatar ??
                    staff?.avatar ??
                    administrator?.avatar ??
                    defaultAvatar
                  }
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Header;
