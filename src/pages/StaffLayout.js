import { Avatar, Layout, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarStaff from "../components/Sidebar/SidebarStaff";
import Header from "../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";
import { socketActions } from "../store/socket";
import {
  cleanUpOnMessage,
  cleanUpOnlineGroupUsersReceived,
  getOnlineGroupUsersSocket,
  socketListener,
} from "../utils/socket";
import { getChatsList } from "../store/chats";

const { Content } = Layout;

const StaffLayout = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);

  const [collapsed, setCollapsed] = useState(false);

  // const [api, contextHolder] = notification.useNotification();
  const [notificationAPI, contextHolder] = notification.useNotification();

  useEffect(() => {
    // create socket connection
    socketListener(dispatch, notificationAPI);

    // get online user
    getOnlineGroupUsersSocket();

    dispatch(getChatsList({ currentPage: 1 }));

    return () => {
      cleanUpOnMessage();
      cleanUpOnlineGroupUsersReceived();
    };
  }, []);

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
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="overflow-hidden overflow-y-scroll mt-[64px] ">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default StaffLayout;
