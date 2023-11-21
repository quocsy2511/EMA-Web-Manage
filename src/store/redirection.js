import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  redirect: { request: undefined, task: undefined, comment: undefined },
};

const redirectionSlice = createSlice({
  name: "redirection",
  initialState,
  reducers: {
    requestChange(state, action) {
      state.redirect.request = action.payload;
    },
    taskChange(state, action) {
      state.redirect.task = action.payload;
    },
    commentChange(state, action) {
      state.redirect.comment = action.payload;
    },
  },
});

export const redirectionActions = redirectionSlice.actions;

export default redirectionSlice.reducer;
