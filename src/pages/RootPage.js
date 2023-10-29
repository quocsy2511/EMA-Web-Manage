import React, { Fragment, useState } from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

const RootPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Fragment>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        {/* sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main */}
        <Layout>
          {/* header */}
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          {/* Content */}
          <Content>
            <div className="bg-white flex items-center ">
              <Outlet />
            </div>
            <ScrollRestoration getKey={(location) => location.pathname} />
          </Content>

          {/* footer */}
          {/* <Footer>
            <p className="text-center">FPT capstone</p>
          </Footer> */}
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default RootPage;
