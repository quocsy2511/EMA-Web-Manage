import { Avatar, Layout, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderStaff from "../components/Header/HeaderStaff";
import SidebarStaff from "../components/Sidebar/SidebarStaff";
import Header from "../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";
import { socketActions } from "../store/socket";

const { Content } = Layout;

const ManagerLayout = () => {
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
        message: <p className="text-base">Đã nhận 1 thông báo</p>,
        description: (
          <div className="flex items-center gap-x-3">
            <Avatar src={data.avatar} />
            <p className="text-sm">{data.content}</p>
          </div>
        ),
        duration: 5,
      });
    });
  }, [socket]);

  return (
    <div className="overflow-hidden overflow-y-scroll">
      {contextHolder}
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <SidebarStaff collapsed={collapsed} />
        <Content>
          {/* <HeaderStaff collapsed={collapsed} setCollapsed={setCollapsed} /> */}
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="bg-white flex items-center mt-[64px]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default ManagerLayout;
