import { Avatar, Badge, Button, Dropdown } from "antd";
import React from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { getProfile } from "../../apis/users";
import { useQuery } from "@tanstack/react-query";
// import AnErrorHasOccured from "../Error/AnErrorHasOccured";
// import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";

const HeaderStaff = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  // const staff = useRouteLoaderData("staff");
  const { data } = useQuery(["profile"], getProfile);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const userItems = [
    {
      key: "1",
      label: <Link to="/staff/profile">Hồ sơ</Link>,
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

  // const {
  //   data: staff,
  //   isError: isErrorStaff,
  //   isLoading: isLoadingStaff,
  // } = useQuery(["staff"], () => getProfile(), {
  //   select: (data) => {
  //     return data;
  //   },
  // });

  return (
    <Header className="p-0 bg-white border-b-2 h-[70px]">
      <div className="flex justify-between items-center ">
        <div>
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
              <AiOutlineMenuUnfold size={24} />
            ) : (
              <AiOutlineMenuFold size={24} />
            )}
          </Button>
        </div>
        <div>
          <div className="flex justify-center items-center gap-x-8 pr-4">
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
                  className="text-black "
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
                {/* {!isLoadingStaff ? (
                  !isErrorStaff ? (
                    <>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-semibold text-black">
                          {staff?.fullName}
                        </p>
                        <p className="text-xs font-normal text-black">
                          Trưởng bộ phận
                        </p>
                      </div>
                      <div className="w-2" />

                      <Avatar
                        size={40}
                        icon={<p>icon</p>}
                        alt="user_image"
                        src={staff?.avatar}
                      />
                    </>
                  ) : (
                    <AnErrorHasOccured />
                  )
                ) : (
                  <LoadingComponentIndicator />
                )} */}

                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-black">
                    {data?.fullName}
                  </p>
                  <p className="text-xs font-normal text-black">
                    Trưởng bộ phận
                  </p>
                </div>
                <div className="w-2" />

                <Avatar
                  size={40}
                  icon={<p>icon</p>}
                  alt="user_image"
                  src={data?.avatar}
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
