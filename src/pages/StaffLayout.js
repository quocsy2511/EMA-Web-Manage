import { Layout, notification } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import SidebarStaff from "../components/Sidebar/SidebarStaff";

import { getChatsList } from "../store/chats";
import {
  cleanUpOnMessage,
  cleanUpOnlineGroupUsersReceived,
  getOnlineGroupUsersSocket,
  socketListener,
} from "../utils/socket";

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
    <Fragment>
      {contextHolder}
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
