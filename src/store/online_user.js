import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
  offlineUsers: [],
};

const onlineUserSlice = createSlice({
  name: "onlineUser",
  initialState,
  reducers: {
    handleUpdateOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    handleUpdateOfflineUsers(state, action) {
      state.offlineUsers = action.payload;
    },
    handleUpdateUsers(state, action) {
      state.onlineUsers = action.payload.onlineUsers;
      state.offlineUsers = action.payload.offlineUsers;
    },
  },
});

export const {
  handleUpdateOnlineUsers,
  handleUpdateOfflineUsers,
  handleUpdateUsers,
} = onlineUserSlice.actions;

export default onlineUserSlice.reducer;
