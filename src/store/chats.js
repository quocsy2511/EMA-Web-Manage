import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversations } from "../apis/chats";

export const getChatsList = createAsyncThunk("chats/getChatsList", async () => {
  const response = await getConversations();
  console.log("res >", response);
  return response;
});

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
      .addCase(getChatsList.pending, (state, action) => {
        state.chats = [];
        state.status = "pending";
        state.error = null;
      })
      .addCase(getChatsList.fulfilled, (state, action) => {
        state.chats = action.payload.data;
        state.status = "succeeded";
      })
      .addCase(getChatsList.rejected, (state, action) => {
        state.error = action.error;
        state.status = "failed";
      });
  },
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice.reducer;
