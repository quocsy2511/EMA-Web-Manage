import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socket";
import redirectionReducer from "./redirection";
import roomReducer from "./room";
import chatsReducer from "./chats";
import chatDetailReducer from "./chat_detail";
import onlineUserReducer from "./online_user";
import notificationReducer from "./Slice/notificationsSlice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
    notification: notificationReducer,
    redirection: redirectionReducer,
    room: roomReducer,
    chats: chatsReducer,
    chatDetail: chatDetailReducer,
    onlineUser: onlineUserReducer,
  },
});

export default store;
