import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../utils/axios-utils";
import { getConversation } from "../apis/chats";

export const fetchChatDetail = createAsyncThunk(
  "chatDetail/fetchChatDetail",
  async (params, thunkAPI) => {
    const response = await getConversation(params.id);
    console.log("single conversation > ", response);

    /*
      2 case 
        + has chatTitle : new chat detail
        + empty chatTitle : keep the current chat detail but load more paging
    */
    if (params.chatTitle)
      return {
        chatId: response.id,
        chatDetail: response?.messages?.data ?? [],
        chatTitle: params.chatTitle,
      };
    else
      return {
        chatId: response.id,
        chatDetail: response?.messages?.data ?? [],
      };
  }
);

const initialState = {
  chatId: "",
  chatTitle: {}, // contain avatar & name of chat detail
  chatDetail: [], // list chat detail
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
        let groupMessage = [];
        let tmp;

        if (action.payload.chatDetail.length === 1) {
          groupMessage = action.payload.chatDetail;
        } else if (action.payload.chatDetail.length !== 0) {
          action.payload.chatDetail.map((message, index) => {
            if (index === 0) {
              // first item
              console.log("first item message > ", message);
              // tmp = [message];
              tmp = { email: message?.author?.email, messageList: [message] };
              console.log("first item tmp > ", tmp);
            } else if (index === action.payload.chatDetail.length - 1) {
              // last item
              if (
                message?.author?.id ===
                action.payload.chatDetail[index - 1]?.author?.id
              ) {
                // If last item equal prev item => add to the messageList before add to the state
                tmp.messageList = [...tmp.messageList, message];
                groupMessage = [...groupMessage, tmp];
                console.log("last item equal groupMessage > ", groupMessage);
              } else {
                // If last item NOT equal prev item => add the prev item, create new tmp and add to the state
                groupMessage = [
                  ...groupMessage,
                  tmp, // add the prev item
                  { email: message?.author?.email, messageList: [message] }, // new tmp
                ];
                console.log(
                  "last item not equal groupMessage > ",
                  groupMessage
                );
              }
            } else {
              // all middle items
              if (
                message?.author?.id ===
                action.payload.chatDetail[index - 1]?.author?.id
              ) {
                // If current equal prev item => add to messageList
                tmp.messageList = [...tmp.messageList, message];
              } else {
                // If current NOT equal prev item => add prev tmp to the state => create new tmp
                groupMessage = [...groupMessage, tmp];
                tmp = { email: message?.author?.email, messageList: [message] };
              }
            }
          });
        }
        console.log("groupMessage > ", groupMessage);

        if (action.payload.chatTitle) {
          state.chatTitle = action.payload.chatTitle;
        }

        state.chatId = action.payload.chatId;
        state.chatDetail = groupMessage;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchChatDetail.rejected, (state, action) => {
        state.error = action.error;
        state.status = "failed";
      });
  },
});

export const chatDetailActions = chatDetailSlice.actions;

export default chatDetailSlice.reducer;
