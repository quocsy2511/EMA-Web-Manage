import React, { Fragment, useState } from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, ScrollRestoration } from "react-router-dom";
import SidebarAdmin from "../components/Sidebar/SidebarAdmin";
import Header from "../components/Header/Header";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  //   const [api, contextHolder] = notification.useNotification();

  return (
    <Fragment>
      {/* {contextHolder} */}
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <SidebarAdmin collapsed={collapsed} />

        <Layout>
          <div className={`${collapsed ? "pl-[80px]" : "pl-[230px]"}`}>
            <Header collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content>
              <div className="bg-white flex items-center mt-[64px]">
                <Outlet />
              </div>
              <ScrollRestoration getKey={(location) => location.pathname} />
            </Content>
          </div>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default AdminLayout;
