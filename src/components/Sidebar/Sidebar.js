import { ConfigProvider, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";
import { HiOutlineHome, HiOutlineCalendarDays } from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import { IoChatboxOutline } from "react-icons/io5";
import { RiTeamLine } from "react-icons/ri";
import logo from "../../assets/images/logo.png";
import logo_domain from "../../assets/images/logo_domain.png";

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
        <HiOutlineHome className="text-[#2196f3]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Sự kiện" />,
      "Sự kiện",
      "/manager/event",
      <p>
        <HiOutlineCalendarDays className="text-[#9c27b0]" size={24} />
      </p>
    ),
    // getItem(
    //   <LabelText text="Chấm công" />,
    //   "Chấm công",
    //   "/manager/timekeeping",
    //   <p>
    //     <BsJournalCheck className="text-[#333333]" size={24} />
    //   </p>
    // ),
    getItem(
      <LabelText text="Nhân sự" />,
      "Nhân sự",
      "/manager/personnel",
      <p>
        <RiTeamLine className="text-[#333333]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Tin nhắn" />,
      "Tin nhắn",
      "/manager/chat",
      <p>
        <IoChatboxOutline className="text-[#FF5722]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Khách hàng" />,
      "Khách hàng",
      "/manager/customer",
      <p>
        <IoMailOutline className="text-[#795548]" size={24} />
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
              <img src={logo} className="h-24" />
            ) : (
              <img src={logo_domain} className="" />
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
                selectedKeys={[location.pathname]}
                items={sidebarItems}
                inlineIndent={30}
              />
            </ConfigProvider>
          </div>

          {/* dark mode here */}
          {/* <div className="flex justify-center items-center mt-20 py-1 flex-col">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
