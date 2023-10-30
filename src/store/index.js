import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socket";

const store = configureStore({
  reducer: { socket: socketReducer },
});

export default store;
