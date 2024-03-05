import { Avatar, ConfigProvider, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineUserGroup, HiOutlineUser } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { BsPersonVcard } from "react-icons/bs";
import logo from "../../assets/images/logo.png";
import { SettingOutlined } from "@ant-design/icons";

//label cho than side bar
const LabelText = ({ text }) => (
  <p className="pr-24 font-medium text-base">{text}</p>
);

const SidebarAdmin = ({ collapsed }) => {
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
      <LabelText text="Nhân sự" />,
      "Nhân sự",
      "/administrator",
      <p>
        <HiOutlineUser className="text-[#3f51b5]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Bộ phận" />,
      "Bộ phận",
      "/administrator/division",
      <p>
        <HiOutlineUserGroup className="text-[#4CAF50]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Cài đặt" />,
      "Cài đặt",
      "/administrator/setting",
      <p>
        <IoSettingsOutline className="text-gray-400" size={24} />
      </p>
    ),
  ];

  return (
    <>
      <Sider
        style={
          collapsed
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
                background: colorTheme === "dark" ? "#fff" : "#001529",
                minWidth: "80px", // Chiều rộng khi thu gọn
              }
            : {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
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
        <div className="flex flex-col gap-y-16">
          {/* logo here */}
          <div className="demo-logo-vertical flex justify-center items-center p-4 dark:text-white">
            {!collapsed ? (
              <div className="flex flex-col gap-y-4">
                <Avatar size={54} src={logo} />
                <h3 className="text-center text-sm font-semibold dark:text-white text-secondary">
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

export default SidebarAdmin;
