import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderStaff from "../components/Header/HeaderStaff";

const { Content } = Layout;

const ManagerLayout = () => {
  return (
    <div className="overflow-hidden overflow-y-scroll">
      <Layout>
        <Content>
          <HeaderStaff />
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default ManagerLayout;
