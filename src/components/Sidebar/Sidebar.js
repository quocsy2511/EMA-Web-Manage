import {
  BanknotesIcon,
  CalendarDaysIcon,
  ClipboardIcon,
  HomeIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ConfigProvider, Menu, Switch } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";

//label cho than side bar
const LabelText = ({ text }) => (
  <p className="pr-24 font-medium text-base">{text}</p>
);

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [colorTheme, setColorTheme] = useDarkMode();
  const [theme, setTheme] = useState(colorTheme === "light" ? "dark" : "light");
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
    setColorTheme(colorTheme);
    setDarkSide(value);
  };

  const getItem = (label, title, key, icon, children) => {
    return {
      label,
      title,
      key,
      icon,
      children,
    };
  };

  const sidebarItems = [
    getItem(
      <LabelText text="Trang chủ" />,
      "Trang chủ",
      "/",
      <p>
        <HomeIcon className="text-[#2196f3]" />
      </p>,
      null
    ),
    getItem(
      <LabelText text="Sự kiện" />,
      null,
      "event",
      <p>
        <CalendarDaysIcon className="text-[#9c27b0]" />
      </p>,
      [
        getItem(
          <span className=" font-normal text-sm">Danh sách sự kiện</span>,
          null,
          "/event-list",
          null,
          null
        ),
        getItem(
          <span className="font-normal text-sm">Lịch sử sự kiện</span>,
          null,
          "/event-history",
          null,
          null
        ),
      ]
    ),
    getItem(
      <LabelText text="Công việc" />,
      "Công việc",
      "/task",
      <p>
        <ClipboardIcon className="text-[#3f51b5]" />
      </p>,
      null
    ),
    getItem(
      <LabelText text="Nhân sự" />,
      null,
      "personnel",
      <p>
        <UserIcon className="text-orange-400" />
      </p>,
      [
        getItem(
          <span className="font-normal text-sm">Danh sách nhân viên</span>,
          null,
          "/personnel-list",
          null,
          null
        ),
        getItem(
          <span className="font-normal text-sm">Chức vụ</span>,
          null,
          "/personnel-position",
          null,
          null
        ),
        getItem(
          <span className="font-normal text-sm">Phòng ban</span>,
          null,
          "/personnel-department",
          null,
          null
        ),
      ]
    ),
    getItem(
      <LabelText text="Yêu cầu" />,
      "Yêu cầu",
      "/request",
      <p>
        <Square2StackIcon className="text-[#673ab7]" />
      </p>,
      null
    ),
    getItem(
      <p className="pr-24 font-medium text-base">Lương</p>,
      "Lương",
      "/salary",
      <p>
        <BanknotesIcon className="text-[#009688]" />
      </p>,
      null
    ),
    getItem(
      <LabelText text="Khác" />,
      "Khác",
      "/others",
      <p>
        <RectangleGroupIcon className="text-[#795548]" />
      </p>,
      null
    ),
  ];

  return (
    <>
      <Sider
        style={
          collapsed
            ? {
                background: colorTheme === "dark" ? "#fff" : "#001529",
                minWidth: "80px", // Chiều rộng khi thu gọn
              }
            : {
                background: colorTheme === "dark" ? "#fff" : "#001529",
                minWidth: "230px", // Chiều rộng khi mở rộng
              }
        }
        className="border-r-2"
        collapsible
        collapsed={collapsed}
        // onCollapse={(value) => setCollapsed(value)}
        trigger={null}
      >
        {/* logo here */}
        <div className="demo-logo-vertical flex justify-center items-center p-4 dark:text-white">
          <p>logo</p>
          {!collapsed && <p>HREA</p>}
        </div>

        {/* sidebar here */}
        <div className="dark:bg-[#001529] bg-white  flex flex-col justify-between">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  collapsedIconSize: 14,
                  iconSize: 24,
                  iconMarginInlineEnd: 20,
                  itemBorderRadius: 50,
                  itemColor: "#9f9f9f",
                  itemHeight: 45,
                  itemHoverColor: "black",
                  itemSelectedColor: "black",
                  subMenuItemBg: "white",
                },
              },
            }}
          >
            <Menu
              theme={theme}
              mode="inline"
              onClick={({ key }) => {
                if (!key.includes("/")) return;
                else navigate(key);
              }}
              defaultSelectedKeys={location.pathname}
              items={sidebarItems}
              inlineIndent={30}
            />
          </ConfigProvider>
        </div>

        {/* dark mode here */}
        <div className="flex justify-center items-center mt-20 py-1 flex-col">
          <div className="w-4/5 rounded-full h-[1px] mb-6 bg-gray-400 "></div>
          <Switch
            className="bg-gray-400"
            checked={darkSide}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
