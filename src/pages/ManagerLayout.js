import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarStaff from "../components/Sidebar/SidebarStaff";
import Header from "../components/Header/Header";

const { Content } = Layout;

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <SidebarStaff collapsed={collapsed} />
        <Content>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="overflow-hidden overflow-y-scroll mt-[64px] ">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default ManagerLayout;
