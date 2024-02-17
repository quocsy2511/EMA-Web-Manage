import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversation } from "../apis/chats";

export const fetchChatDetail = createAsyncThunk(
  "chatDetail/fetchChatDetail",
  async (params, thunkAPI) => {
    const response = await getConversation(params.id, params.currentPage);
    console.log("single conversation > ", response);

    /*
      2 case 
        + has chatTitle : new chat detail
        + empty chatTitle : keep the current chat detail but load more paging
    */
    return {
      currentPage: response?.messages?.currentPage,
      nextPage: response?.messages?.nextPage,
      chatId: response.id,
      chatDetail: response?.messages?.data ?? [],
      chatTitle: params.chatTitle ? params.chatTitle : null,
    };
  }
);

const initialState = {
  currentPage: 1,
  nextPage: null,
  chatId: "",
  chatTitle: {}, // contain avatar & name of chat detail
  chatDetail: [], // list chat detail
  status: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const chatDetailSlice = createSlice({
  name: "chatDetail",
  initialState,
  reducers: {
    updateChatDetail(state, action) {
      // newest group mess equal to new mess (same user)
      if (state.chatDetail.length > 0) {
        if (state.chatDetail[0].email === action.payload.email) {
          state.chatDetail[0].messageList = [
            action.payload.newMessage,
            ...state.chatDetail[0].messageList,
          ];
        } else {
          const newGroupMessage = {
            email: action.payload.email,
            messageList: [action.payload.newMessage],
          };
          state.chatDetail = [newGroupMessage, ...state.chatDetail];
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChatDetail.pending, (state, action) => {
        if (state.currentPage === 1) state.chatDetail = [];
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchChatDetail.fulfilled, (state, action) => {
        let groupMessage = [];
        let tmp;

        if (state.currentPage === 1) {
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
                  tmp = {
                    email: message?.author?.email,
                    messageList: [message],
                  };
                }
              }
            });
          }
          console.log("groupMessage > ", groupMessage);

          if (action.payload.chatTitle) {
            state.chatTitle = action.payload.chatTitle;
          }

          state.currentPage = action.payload.currentPage;
          state.nextPage = action.payload.nextPage
            ? action.payload.nextPage
            : null;
          state.chatId = action.payload.chatId;
          state.chatDetail = groupMessage;
          state.status = "succeeded";
          state.error = null;
        } else {
          // const emailLastItem = state.chatDetail.reverse()[0].email;
        }
      })
      .addCase(fetchChatDetail.rejected, (state, action) => {
        state.error = action.error;
        state.status = "failed";
      });
  },
});

export const chatDetailActions = chatDetailSlice.actions;

export default chatDetailSlice.reducer;
