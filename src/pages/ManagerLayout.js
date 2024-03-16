import React, { Fragment, useEffect, useState } from "react";
import { Avatar, Layout, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import {
  cleanUpOnMessage,
  cleanUpOnlineGroupUsersReceived,
  getOnlineGroupUsersSocket,
  socketListener,
} from "../utils/socket";
import { getChatsList } from "../store/chats";

const ManagerLayout = () => {
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);

  const [notificationAPI, contextHolder] = notification.useNotification();

  useEffect(() => {
    // create socket connection
    // socketListener(dispatch, notificationAPI);

    // get online user
    getOnlineGroupUsersSocket();

    dispatch(getChatsList({ currentPage: 1 }));

    return () => {
      cleanUpOnMessage();
      cleanUpOnlineGroupUsersReceived();
    };
  }, []);

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
      {/* {room?.isUserInRoom && <RoomChat />} */}
    </Fragment>
  );
};

export default ManagerLayout;
