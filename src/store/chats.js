import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversations } from "../apis/chats";

export const getChatsList = createAsyncThunk(
  "chats/getChatsList",
  async (params, thunkAPI) => {
    const response = await getConversations(params.currentPage);
    // console.log("res >", response);
    return response;
  }
);

const initialState = {
  currentPage: 1,
  nextPage: null,
  chats: [],
  status: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    updateChat(state, action) {
      state.chats = state.chats.map((chat) => {
        if (chat.id === action.payload.id) {
          return action.payload;
        } else return chat;
      });
    },
    resetChats(state, action) {
      state.currentPage = 1;
      state.nextPage = null;
      state.chats = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatsList.pending, (state, action) => {
        // state.chats = [];
        state.status = "pending";
        state.error = null;
      })
      .addCase(getChatsList.fulfilled, (state, action) => {
        state.currentPage = action.payload.currentPage;
        state.nextPage = action.payload.nextPage
          ? action.payload.nextPage
          : null;

        state.chats =
          state.chats.length === 0
            ? action.payload.data
            : [...state.chats, ...action.payload.data];
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
