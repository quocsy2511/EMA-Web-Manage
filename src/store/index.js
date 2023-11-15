import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socket";
import notificationReducer from "./Slice/notificationsSlice";

const store = configureStore({
  reducer: { socket: socketReducer, notification: notificationReducer },
});

export default store;
