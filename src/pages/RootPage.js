import React, { Fragment, useState } from "react";
import { Avatar, Badge, Button, Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

const RootPage = () => {
  const data = useLoaderData();
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
          </Content>

          {/* footer */}
          {/* <Footer
            style={{
              textAlign: "center",
            }}
          >
            FPT capstone
          </Footer> */}
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default RootPage;
