import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderStaff from "../components/Header/HeaderStaff";
import SidebarStaff from "../components/Sidebar/SidebarStaff";

const { Content } = Layout;

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="overflow-hidden overflow-y-scroll">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <SidebarStaff collapsed={collapsed} />
        <Content>
          <HeaderStaff collapsed={collapsed} setCollapsed={setCollapsed} />
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default ManagerLayout;
