import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../utils/axios-utils";

const fetchChatDetail = createAsyncThunk(
  "chatDetail/fetchChatDetail",
  async (params, thunkAPI) => {
    const response = await authRequest({ url: `` });
    return response.data;
  }
);

const initialState = {
  chatDetail: [],
  status: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const chatDetailSlice = createSlice({
  name: "chatDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatDetail.pending, (state, action) => {
        state.chatDetail = [];
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchChatDetail.fulfilled, (state, action) => {
        state.chatDetail = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchChatDetail.rejected, (state, action) => {
        state.error = action.error;
        state.status = "failed";
      });
  },
});

export const chatDetailActions = chatDetailSlice.actions;

export default chatDetailSlice.reducer;
