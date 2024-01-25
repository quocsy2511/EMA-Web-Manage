import React, { Fragment, useEffect, useState } from "react";
import { Avatar, Layout, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";
import { socketActions } from "../store/socket";
import RoomChat from "../components/RoomChat/RoomChat";
import { connectWithSocket } from "../socket/socketConnection";

const ManagerLayout = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const room = useSelector((state) => state.room);
  console.log("room >> ", room);

  const [collapsed, setCollapsed] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) connectWithSocket(token, dispatch);
  }, []);

  useEffect(() => {
    if (!socket) {
      const saveSocket = io(URL_SOCKET, {
        auth: {
          access_token: localStorage.getItem("token"),
        },
      });
      dispatch(socketActions.saveSocket(saveSocket));
      return;
    }

    socket?.on("notification", (data) => {
      console.log("data:", data);
      queryClient.invalidateQueries(["notifications", "10"]);
      api.open({
        message: <p className="text-base">Đã nhận 1 thông báo</p>,
        description: (
          <div className="flex items-center gap-x-3">
            <Avatar src={data?.avatar} />
            <p className="text-sm">
              <span className="font-semibold">
                {data?.content?.split("đã")[0]}{" "}
              </span>
              đã {data?.content?.split("đã")[1]}
            </p>
          </div>
        ),
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
      {room?.isUserInRoom && <RoomChat />}
    </Fragment>
  );
};

export default ManagerLayout;
