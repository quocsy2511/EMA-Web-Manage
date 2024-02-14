import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../utils/axios-utils";
import { getConversation } from "../apis/chats";

export const fetchChatDetail = createAsyncThunk(
  "chatDetail/fetchChatDetail",
  async (params, thunkAPI) => {
    const response = await getConversation(params.id);
    console.log("single conversation > ", response);
    // return response?.messages ?? [];
    return {
      detail: response?.messages ?? [],
      sender: { avatar: params.senderAvatar, fullName: params.senderFullName },
    };
  }
);

const initialState = {
  sender: {},
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
        // state.chatDetail = action.payload;
        state.sender = action.payload.sender;
        state.chatDetail = action.payload.detail;
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
