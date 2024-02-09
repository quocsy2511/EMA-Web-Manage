import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../utils/axios-utils";

const getChatsByUserId = createAsyncThunk(
  "chats/getChatsByUserId",
  async (params, thunkAPI) => {
    const response = await authRequest(params.userId);
    return response;
  }
);

const initialState = {
  chats: [],
  status: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChatsByUserId.pending, (state, action) => {
        state.chats = [];
        state.status = "pending";
        state.error = null;
      })
      .addCase(getChatsByUserId.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.status = "succeeded";
      })
      .addCase(getChatsByUserId.rejected, (state, action) => {
        state.error = action.error;
        state.status = "failed";
      });
  },
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice.reducer;
