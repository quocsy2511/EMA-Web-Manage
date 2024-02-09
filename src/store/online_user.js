import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
};

const onlineUserSlice = createSlice({
  name: "onlineUser",
  initialState,
  reducers: {
    handleUpdateOnlineUser(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { handleUpdateOnlineUser } = onlineUserSlice.actions;

export default onlineUserSlice.reducer;
