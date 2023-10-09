import { Avatar, Badge, Dropdown, Menu } from "antd";
import React from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Header } from "antd/es/layout/layout";

const HeaderStaff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getItem = (label, key) => {
    return {
      label,
      key,
    };
  };
  const topBarItems = [
    getItem("Sự kiện", "/staff"),
    getItem("Công việc ", "/staff/task"),
    getItem("Yêu cầu", "/staff/request"),
    getItem("Thông kê", "/staff/dashboard"),
    getItem("Bảng Chấm công", "/staff/timekeeping"),
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const userItems = [
    {
      key: "1",
      label: <Link to="/manager/profile">Hồ sơ</Link>,
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

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center">
          <div className="demo-logo mr-4">
            <Avatar size={34} src={logo} />
          </div>
          <Menu
            onClick={({ key }) => {
              navigate(key);
            }}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={location.pathname}
            items={topBarItems}
          />
        </div>

        <div>
          <div className="flex justify-center items-center gap-x-8">
            <div className="cursor-pointer flex items-center ">
              <Dropdown
                menu={{
                  items: notiItems,
                }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <Badge
                  size={"small"}
                  count={5}
                  offset={[-2, 2]}
                  title="5 thông báo"
                  className="text-white"
                >
                  {/* <HiOutlineBell size={20} /> */}
                  <HiOutlineBellAlert size={20} />
                </Badge>
              </Dropdown>
            </div>

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
                  <p className="text-sm font-semibold text-white">User Name</p>
                  <p className="text-xs font-normal text-white">Staff</p>
                </div>
                <div className="w-2" />
                <Avatar
                  size={40}
                  icon={<p>icon</p>}
                  alt="user_image"
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
                  }
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderStaff;
