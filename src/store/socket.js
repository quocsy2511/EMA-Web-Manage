import { createSlice } from "@reduxjs/toolkit";

import { io } from "socket.io-client";

const initialState = { socket: io("") ||null };

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket(state, action) {
      state.socket = action.payload;
    },
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
