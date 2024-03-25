import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { MdOutlineCelebration, MdOutlineCalendarMonth } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";
import { ConfigProvider, Menu } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { IoChatboxOutline } from "react-icons/io5";
import logo from "../../assets/images/logo.png";
import logo_domain from "../../assets/images/logo_domain.png";
import { AiOutlineTeam } from "react-icons/ai";
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
      <LabelText text="Trang chủ" />,
      "/staff",
      <p>
        <HiOutlineHome className="text-[#2196f3]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Sự kiện" />,
      "/staff/event",
      <p>
        <MdOutlineCelebration className="text-[#FF5722]" size={24} />
      </p>
    ),
    // getItem(
    //   <LabelText text="Công việc" />,
    //   "/staff/task",
    //   <p>
    //     <HiOutlineCalendarDays className="text-[#9c27b0]" size={24} />
    //   </p>
    // ),
    // getItem(
    //   <LabelText text="Yêu cầu" />,
    //   "/staff/request",
    //   <p>
    //     <BsMailbox className="text-[#FF5722]" size={24} />
    //   </p>
    // ),
    // getItem(
    //   <LabelText text="Thống kê" />,
    //   "/staff/dashboard",
    //   <BsPersonVcard className="text-[#795548]" size={24} />
    // ),
    // getItem(
    //   <LabelText text="Chấm công" />,
    //   "/staff/timekeeping",
    //   <p>
    //     <BsJournalCheck className="text-[#333333]" size={24} />
    //   </p>
    // ),
    // getItem(
    //   <LabelText text="Thu chi" />,
    //   "/staff/budget",
    //   <p>
    //     <LiaMoneyBillWaveAltSolid className="text-[#4CAF50]" size={24} />
    //   </p>
    // ),
    getItem(
      <LabelText text="Lịch trình" />,
      "/staff/schedule",
      <p>
        <MdOutlineCalendarMonth className="text-[#795548]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Chat" />,
      "/staff/chat",
      <p>
        <IoChatboxOutline className="text-[#9c27b0]" size={24} />
      </p>
    ),
    getItem(
      <LabelText text="Nhân viên" />,
      "/staff/department",
      <p>
        <AiOutlineTeam className="text-[#b03c27]" size={24} />
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
                theme="light"
                mode="inline"
                onClick={({ key }) => navigate(key)}
                selectedKeys={[location.pathname]}
                items={sideBarItems}
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

export default SidebarStaff;
