import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socket";
import redirectionReducer from "./redirection";
import notificationReducer from "./Slice/notificationsSlice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
    notification: notificationReducer,
    redirection: redirectionReducer,
  },
});

export default store;
