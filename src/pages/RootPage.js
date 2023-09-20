import { Button, Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

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
          <Header className="p-0 bg-gray-400">
            <div className="">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              header
            </div>
          </Header>

          {/* Content */}
          <Content>
            <div className="bg-slate-200 ">
              <Outlet />
            </div>
          </Content>

          {/* footer */}
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            FPT capstone
          </Footer>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default RootPage;
