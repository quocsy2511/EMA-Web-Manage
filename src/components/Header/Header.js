import React from "react";
import { Avatar, Badge, Button, Dropdown, message } from "antd";
import { Header as HeaderLayout } from "antd/es/layout/layout";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
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
import { addNotification } from "../../store/Slice/notificationsSlice";

const NotiLabel = ({ item }) => {
  let time;
  const currentDate = moment().subtract(7, "hours");
  const targetDate = moment(item.createdAt);
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
    <div className="flex items-center gap-x-3 min-w-[300px]">
      <Avatar size={45} src={item.avatarSender} />
      <div className="flex-1">
        <p className="text-sm max-w-[280px] overflow-hidden">
          <span className="font-bold">{item.content.split("đã")[0]}</span>
          đã {item.content.split("đã")[1]}
        </p>
        <p className="text-blue-400">{time}</p>
      </div>
      <div>
        {item.readFlag === 0 ? (
          <div className="w-[8px] h-[8px] bg-blue-500 rounded-full" />
        ) : (
          <div className="w-[8px] h-[8px] bg-transparent" />
        )}
      </div>
    </div>
  );
};
const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const manager = useRouteLoaderData("manager");
  const staff = useRouteLoaderData("staff");
  const [messageApi, contextHolder] = message.useMessage();
  const { socket } = useSelector((state) => state.socket);

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(["notifications", "10"], () => getAllNotification(10), {
    select: (data) => {
      return data.data;
    },
  });
  console.log("notifications: ", notifications);

  const queryClient = useQueryClient();
  const { mutate: seenNotificationMutate } = useMutation(
    (notificationId) => seenNotification(notificationId),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(["notifications", "10"], (oldValue) => {
          const updatedOldData = oldValue.map((item) => {
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

  const logout = () => {
    localStorage.removeItem("token");
    socket?.disconnect();
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

  const dispatch = useDispatch();
  const onClickNotification = (key) => {
    if (
      key.key === "navigate" &&
      location.pathname !== "/manager/notification"
    ) {
      if (manager) {
        navigate("/manager/notification");
      } else {
        navigate("/staff/notification");
      }
    }
    const findNoti = notifications.find((noti) => noti.id === key.key);
    dispatch(addNotification(findNoti));
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
                    label: <NotiLabel item={noti} />,
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
                <HiOutlineBellAlert size={25} />
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
                      ? manager?.fullName ?? "User Name"
                      : staff?.fullName ?? "User Name"}
                  </p>
                  <p className="text-xs font-normal">
                    {manager
                      ? manager?.role === "MANAGER" && "Quản lý"
                      : staff
                      ? staff.role === "STAFF" && "Trưởng bộ phận"
                      : "Vai? trò"}
                  </p>
                </div>
                <div className="w-2" />
                <Avatar
                  size={40}
                  icon={<p>icon</p>}
                  alt="user_image"
                  src={manager?.avatar ?? staff?.avatar}
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
