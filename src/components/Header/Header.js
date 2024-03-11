import React from "react";
import { Avatar, Badge, Button, Dropdown, message } from "antd";
import { Header as HeaderLayout } from "antd/es/layout/layout";
import { HiOutlineBell, HiOutlineBellAlert } from "react-icons/hi2";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import {
  Link,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllNotification, seenNotification } from "../../apis/notifications";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import momenttz from "moment-timezone";
import { addNotification } from "../../store/Slice/notificationsSlice";
import { redirectionActions } from "../../store/redirection";
import TEXT from "../../constants/string";
import { defaultAvatar } from "../../constants/global";
import { chatsActions } from "../../store/chats";
import { closeConnectSocket } from "../../utils/socket";
import { chatDetailActions } from "../../store/chat_detail";

const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const manager = useRouteLoaderData("manager");
  const staff = useRouteLoaderData("staff");
  const administrator = useRouteLoaderData("administrator");

  const dispatch = useDispatch();
  const { redirect } = useSelector((state) => state.redirection);

  const [messageApi, contextHolder] = message.useMessage();

  const NotiLabel = ({ item }) => {
    console.log("🚀 ~ NotiLabel ~ item:", item);
    let time;
    // const currentDate = moment().subtract(7, "hours");
    // const targetDate = moment(item.createdAt);

    const currentDate = momenttz();
    const targetDate = momenttz(item?.createdAt);

    if (currentDate.diff(targetDate, "minutes") < 5) {
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
      if (item?.type === "TASK") {
        console.log("task");
        dispatch(
          redirectionActions.taskChange({
            commonId: item?.commonId,
            parentTaskId: item?.parentTaskId,
          })
        );
        if (item?.parentTaskId) {
          if (
            location.pathname !==
            `/manager/event/${item?.eventID}/${item?.paentTaskId}`
          ) {
            navigate(`/manager/event/${item?.eventID}/${item?.parentTaskId}`);
          }
        } else {
          if (
            location.pathname !==
            `/manager/event/${item?.eventID}/${item?.commonId}`
          ) {
            navigate(`/manager/event/${item?.eventID}/${item?.commonId}`);
          }
        }
      } else if (item?.type === "COMMENT") {
        console.log("comment");
        dispatch(redirectionActions.commentChange(item?.commonId));
        if (location.pathname !== "/manager/request") {
          navigate(`/manager/event/${item?.eventID}/${item?.commenId}`);
        }
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
          {item?.readFlag === 0 ? (
            <div className="w-[8px] h-[8px] bg-blue-500 rounded-full" />
          ) : (
            <div className="w-[8px] h-[8px] bg-transparent" />
          )}
        </div>
      </div>
    );
  };

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(["notifications", "10"], () => getAllNotification(10), {
    select: (data) => {
      return data?.data;
    },
    refetchOnWindowFocus: false,
  });
  console.log("notifications: ", notifications);

  const queryClient = useQueryClient();
  // const { mutate: seenNotificationMutate } = useMutation(
  //   (notificationId) => seenNotification(notificationId),
  //   {
  //     onSuccess: (data, variables) => {
  //       queryClient.setQueryData(["notifications", "10"], (oldValue) => {
  //         const updatedOldData = oldValue.map((item) => {
  //           if (item.id === variables.notificationId) {
  //             return { ...item, readFlag: 1 };
  //           }
  //           return item;
  //         });
  //         return updatedOldData;
  //       });
  //     },
  //     onError: (error) => {
  //       messageApi.open({
  //         type: "error",
  //         content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
  //       });
  //     },
  //   }
  // );

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

  const onClickNotification = (key) => {
    // if (
    //   key.key === "navigate" &&
    //   location.pathname !== "/manager/notification"
    // ) {
    //   if (manager) {
    //     navigate("/manager/notification");
    //   } else {
    //     navigate("/staff/notification");
    //   }
    // }
    // const findNoti = notifications.find((noti) => noti.id === key.key);
    // dispatch(addNotification(findNoti));
    // if (findNoti?.type === "REQUEST" && staff) {
    //   navigate("/staff/request");
    // } else if (findNoti?.type === "TASK" && staff) {
    //   navigate("/staff");
    // }
  };

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
            <Dropdown
              menu={{
                // items: notiItems,
                items: [
                  ...(notifications?.map((noti) => ({
                    key: noti.id,
                    label: (
                      <NotiLabel
                        item={noti}
                        navigate={navigate}
                        location={location}
                      />
                    ),
                  })) ?? []),
                  {
                    key: "navigate",
                    label: (
                      <p className="text-center text-blue-400">Xem tất cả</p>
                    ),
                  },
                ],
                onClick: onClickNotification,
              }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
              disabled={notifications?.length === 0}
            >
              <Badge
                size={"default"}
                count={
                  notifications?.length && notifications?.length >= 10
                    ? "9+"
                    : notifications?.length ?? 0
                }
                offset={[-2, 2]}
                title={`${notifications?.length ?? 0} thông báo`}
                onClick={(e) => e.preventDefault()}
              >
                {notifications?.length === 0 ? (
                  <HiOutlineBell size={25} />
                ) : (
                  <HiOutlineBellAlert size={25} />
                )}
              </Badge>
            </Dropdown>
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
                      ? staff.role === TEXT.STAFF && "Trưởng bộ phận"
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
