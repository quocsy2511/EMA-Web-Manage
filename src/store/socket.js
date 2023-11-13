import { createSlice } from "@reduxjs/toolkit";


const initialState = { socket: null };

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    saveSocket(state, action) {
      state.socket = action.payload;
    },
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
