import { App, Layout } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import SidebarStaff from "../components/Sidebar/SidebarStaff";

import { getChatsList } from "../store/chats";
import {
  cleanUpOnMessage,
  cleanUpOnlineGroupUsersReceived,
  displayNotification,
  getOnlineGroupUsersSocket,
  socketListener,
} from "../utils/socket";
import { useQueryClient } from "@tanstack/react-query";

const { Content } = Layout;

const StaffLayout = () => {
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);

  const { notification } = App.useApp();

  const queryClient = useQueryClient();
  useEffect(() => {
    // create socket connection
    socketListener(dispatch);
    displayNotification(notification, queryClient);

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
      <Layout
        style={{
          minHeight: "100vh",
        }}
        className="bg-bgG"
      >
        <SidebarStaff collapsed={collapsed} />

        <Content>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="overflow-hidden overflow-y-scroll scrollbar-hide mt-[64px] ">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Fragment>
  );
};

export default StaffLayout;
