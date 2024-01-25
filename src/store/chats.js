import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../utils/axios-utils";

const getChatsByUserId = createAsyncThunk(
  "chats/getChatsByUserId",
  async (params, thunkAPI) => {
    const response = await authRequest(params.userId);
    return response.data;
  }
);

const initialState = {
  chats: [],
  status: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const chatsSlide = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChatsByUserId.pending, (state, action) => {})
      .addCase(getChatsByUserId.fulfilled, (state, action) => {})
      .addCase(getChatsByUserId.rejected, (state, action) => {});
  },
});

export const chatsActions = chatsSlide.actions;

export default chatsSlide.reducer;
