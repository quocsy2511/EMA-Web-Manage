import React, { useEffect } from "react";
import { Avatar, Badge, Button, Dropdown } from "antd";
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
import { useQuery } from "@tanstack/react-query";
import { getAllNotification } from "../../apis/notifications";
import { useSelector } from "react-redux";

const notiItems = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const NotiLabel = () => (
  <div className="flex items-center gap-x-3 min-w-[300px]">
    <Avatar
      size={40}
      src="https://hips.hearstapps.com/hmg-prod/images/dwayne-the-rock-johnson-gettyimages-1061959920.jpg?crop=0.5625xw:1xh;center,top&resize=1200:*"
    />
    <div className="flex-1">
      <p className="text-base font-medium">Nguyen Vu</p>
      <p className="text-xs max-w-[200px] overflow-hidden truncate">
        Đã bình luận vào việc của bạn ad sa sa dsa dá á dá á da
      </p>
    </div>
    <div>
      <div className="w-[8px] h-[8px] bg-blue-500 rounded-full" />
    </div>
  </div>
);

const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("locaion: ", location);
  const manager = useRouteLoaderData("manager");
  const staff = useRouteLoaderData("staff");
  const { socket } = useSelector((state) => state.socket);
  console.log('socket:', socket);
  // const [notiItems, setNotiItems] = useState();

  useEffect(() => {
    socket?.on('create-task', (data) => {
      console.log("data:", data);
    });
  }, [socket])
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(["notifications"], getAllNotification, {
    select: (data) => {
      return data.data;
    },
  });
  console.log("notifications: ", notifications);

  const logout = () => {
    localStorage.removeItem("token");
    socket?.disconnect()
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
    console.log("click noti : ", key);
    if (key.key === "navigate" && location.pathname !== "/manager/notification")
      navigate("/manager/notification");
  };

  return (
    <HeaderLayout
      className={`${collapsed ? "w-[calc(100%-80px)]" : "w-[calc(100%-230px)]"
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
                    label: <NotiLabel />,
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
                size={"small"}
                count={notifications?.length ?? 0}
                offset={[-2, 2]}
                title={`${notifications?.length ?? 0} thông báo`}
                onClick={(e) => e.preventDefault()}
              >
                <HiOutlineBellAlert size={20} />
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
                  src={
                    manager?.avatar ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
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
