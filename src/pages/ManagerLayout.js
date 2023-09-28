import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderStaff from "../components/Header/HeaderStaff";

const { Header, Content } = Layout;

const ManagerLayout = () => {
  return (
    <div className="overflow-hidden overflow-y-scroll">
      <Layout>
        <HeaderStaff />
        <Content
          className="site-layout"
          style={{
            padding: "0 50px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default ManagerLayout;
