import {
  BanknotesIcon,
  CalendarDaysIcon,
  ClipboardIcon,
  HomeIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ConfigProvider, Dropdown, Menu, Switch } from "antd";
import Icon from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";
import { SunSvg, MoonSvg } from "../../constants/icon";
import { AnimatePresence, motion } from "framer-motion";

const items = [
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

  const getItem = (label, title, key, icon) => {
    return {
      label,
      title,
      key,
      icon,
    };
  };

  const sidebarItems = [
    getItem(
      <LabelText text="Trang chủ" />,
      "Trang chủ",
      "/manager",
      <p>
        <HomeIcon className="text-[#2196f3]" />
      </p>
    ),
    getItem(
      <LabelText text="Sự kiện" />,
      "Sự kiện",
      "/manager/event",
      <p>
        <CalendarDaysIcon className="text-[#9c27b0]" />
      </p>
    ),
    getItem(
      <LabelText text="Nhân sự" />,
      "Nhân sự",
      "/manager/personnel",
      <p>
        <ClipboardIcon className="text-[#3f51b5]" />
      </p>
    ),
    getItem(
      <LabelText text="Bộ phận" />,
      "Bộ phận",
      "/manager/division",
      <p>
        <UserIcon className="text-orange-400" />
      </p>
    ),
    getItem(
      <LabelText text="Chức vụ" />,
      "Chức vụ",
      "/manager/role",
      <p>
        <UserIcon className="text-orange-400" />
      </p>
    ),
    getItem(
      <LabelText text="Chấm công" />,
      "Chấm công",
      "/manager/timekeeping",
      <p>
        <UserIcon className="text-orange-400" />
      </p>
    ),
    getItem(
      <LabelText text="Yêu cầu" />,
      "Yêu cầu",
      "/manager/request",
      <p>
        <Square2StackIcon className="text-[#673ab7]" />
      </p>
    ),
    getItem(
      <LabelText text="Khác" />,
      "Khác",
      // "/manager/others",
      "/",
      <p>
        <RectangleGroupIcon className="text-[#795548]" />
      </p>
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
              onClick={({ key }) => navigate(key)}
              defaultSelectedKeys={location.pathname}
              items={sidebarItems}
              inlineIndent={30}
            />
          </ConfigProvider>
        </div>

        {/* dark mode here */}
        <div className="flex justify-center items-center mt-20 py-1 flex-col">
          <AnimatePresence mode="wait">
            {darkSide ? (
              <motion.div
                key="sun"
                onClick={() => changeTheme(false)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05, type: "spring", stiffness: 200 }}
              >
                <Icon component={SunSvg} className="text-orange-300" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                onClick={() => changeTheme(true)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05, type: "spring", stiffness: 200 }}
              >
                <Icon component={MoonSvg} className="text-[#eb2f96]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
