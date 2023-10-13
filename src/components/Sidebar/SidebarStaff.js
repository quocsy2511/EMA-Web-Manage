import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { BsJournalCheck, BsMailbox, BsPersonVcard } from "react-icons/bs";
import { HiOutlineCalendarDays, HiOutlineHome } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";
import { Avatar, ConfigProvider, Menu } from "antd";
import logo from "../../assets/images/logo.png";
import { AnimatePresence, motion } from "framer-motion";

const SidebarStaff = ({ collapsed }) => {
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

  const location = useLocation();
  const navigate = useNavigate();
  const getItem = (label, key, icon) => {
    return {
      label,
      key,
      icon,
    };
  };

  //label cho than side bar
  const LabelText = ({ text }) => (
    <p className="pr-24 font-medium text-base">{text}</p>
  );

  const sideBarItems = [
    getItem(
      <LabelText text="Sự kiện" />,
      "/staff",
      <p>
        <HiOutlineHome className="text-[#2196f3]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Công việc" />,
      "/staff/task",
      <p>
        <HiOutlineCalendarDays className="text-[#9c27b0]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Yêu cầu" />,
      "/staff/request",
      <p>
        <BsMailbox className="text-[#FF5722]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Thống kê" />,
      "/staff/dashboard",
      <BsPersonVcard className="text-[#795548]" size={24} />
    ),
    getItem(
      <LabelText text="Chấm công" />,
      "/staff/timekeeping",
      <p>
        <BsJournalCheck className="text-[#333333]" size={24} />
      </p>
    ),
  ];

  return (
    <>
      <Sider
        style={
          collapsed
            ? {
                // background: colorTheme === "dark" ? "#fff" : "#001529",
                backgroundColor: "#fff",
                minWidth: "80px", // Chiều rộng khi thu gọn
              }
            : {
                backgroundColor: "#fff",
                minWidth: "230px", // Chiều rộng khi mở rộng
              }
        }
        className="border-r-2"
        collapsible
        collapsed={collapsed}
        // onCollapse={(value) => setCollapsed(value)}
        trigger={null}
      >
        <div className="flex flex-col gap-y-16">
          {/* logo here */}
          <div className="demo-logo-vertical flex justify-center items-center p-4">
            {!collapsed ? (
              <div className="flex flex-col gap-y-4">
                <Avatar size={54} src={logo} />
                <h3 className="text-center text-sm font-semibold text-secondary">
                  HREA
                </h3>
              </div>
            ) : (
              <div className="flex flex-col gap-y-[2px]">
                <Avatar size={34} src={logo} />
              </div>
            )}
          </div>

          {/* sidebar here */}
          <div className="dark:bg-[#001529] bg-white flex flex-col justify-between">
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
                theme="light"
                mode="inline"
                onClick={({ key }) => navigate(key)}
                defaultSelectedKeys={location.pathname}
                items={sideBarItems}
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
                  transition={{
                    duration: 0.05,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {/* <Icon component={SunSvg} className="text-orange-300" /> */}
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  onClick={() => changeTheme(true)}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.05,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {/* <Icon component={MoonSvg} className="text-[#eb2f96]" /> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Sider>
    </>
  );
};

export default SidebarStaff;
