import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socket";
import redirectionReducer from "./redirection";
import roomReducer from "./room";
import notificationReducer from "./Slice/notificationsSlice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
    notification: notificationReducer,
    redirection: redirectionReducer,
    room: roomReducer,
  },
});

export default store;
