import { Avatar, Layout, Menu, theme } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const { Header, Content, Footer } = Layout;

const ManagerLayout = () => {
  const navigate = useNavigate();
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

  const getItem = (label, key) => {
    return {
      label,
      key,
    };
  };

  const topBarItems = [
    getItem("Sự kiện", "/staff"),
    getItem("Thông kê", "/staff/dashboard"),
    getItem("Yêu cầu", "/staff/request"),
    getItem("Bảng Chấm công", "/staff/timekeeping"),
  ];

  return (
    <>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo mr-4">
            <Avatar size={34} src={logo} />
          </div>
          <Menu
            onClick={({ key }) => {
              navigate(key);
            }}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["/staff"]}
            items={topBarItems}
          />
        </Header>
        <Content
          className="site-layout"
          style={{
            padding: "0 50px",
          }}
        >
          <div
            // style={{
            //   background: colorBgContainer,
            // }}
            className="p-6 min-h-screen"
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          capstone project FPT
        </Footer>
      </Layout>
    </>
  );
};

export default ManagerLayout;
