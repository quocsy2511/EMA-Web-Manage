import React, { Fragment, useEffect, useState } from "react";
import { Layout, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";
import { socketActions } from "../store/socket";

const RootPage = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);

  const [collapsed, setCollapsed] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Socket changed !!");
    console.log("socket:", socket);
    if (!socket) {
      const saveSocket = io(URL_SOCKET, {
        auth: {
          access_token: localStorage.getItem("token"),
        },
      });
      dispatch(socketActions.saveSocket(saveSocket));
      return;
    }

    socket?.on("create-task", (data) => {
      console.log("data:", data);
      // queryClient.invalidateQueries([])
      api.open({
        message: "Notification Title",
        description: data.content,
        duration: 5,
      });
    });
  }, [socket]);

  return (
    <Fragment>
      {contextHolder}
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sidebar collapsed={collapsed} />

        <Layout>
          <div className={`${collapsed ? "ml-[80px]" : "ml-[230px]"}`}>
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

export default RootPage;
