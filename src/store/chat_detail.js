import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversation } from "../apis/chats";

export const fetchChatDetail = createAsyncThunk(
  "chatDetail/fetchChatDetail",
  async (params, thunkAPI) => {
    const response = await getConversation(params.id, params.startKey);

    /*
      2 case 
        + has chatTitle : new chat detail
        + empty chatTitle : keep the current chat detail but load more paging
    */
    return {
      startKey: response?.messages?.lastKey,
      chatId: response.id,
      chatTitle: params.chatTitle ? params.chatTitle : null,
      chatDetail: response?.messages?.data ?? [],
      reset: params.chatTitle ? true : false,
    };
  }
);

const initialState = {
  startKey: null,
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
      // checking if new message recieve at the same chat
      if (action.payload?.chatId === state?.chatId) {
        // newest group mess equal to new mess (same user)
        if (state?.chatDetail?.length > 0) {
          if (state?.chatDetail?.[0]?.email === action.payload?.email) {
            state.chatDetail[0].messageList = [
              action.payload?.newMessage,
              ...state.chatDetail?.[0]?.messageList,
            ];
          } else {
            const newGroupMessage = {
              email: action.payload?.email,
              messageList: [action.payload?.newMessage],
            };
            state.chatDetail = [newGroupMessage, ...state.chatDetail];
          }
        } else {
          const newGroupMessage = {
            email: action.payload?.email,
            messageList: [action.payload?.newMessage],
          };
          state.chatDetail = [newGroupMessage, ...state.chatDetail];
        }
      }
    },
    resetChatDetail(state, action) {
      state.startKey = null;
      state.chatId = "";
      state.chatTitle = {};
      state.chatDetail = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChatDetail.pending, (state, action) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchChatDetail.fulfilled, (state, action) => {
        console.log("action.payload > ", action.payload);
        if (action.payload.reset) state.chatDetail = [];

        let groupMessage = [];
        let tmp;

        if (action.payload.chatDetail.length === 1) {
          // TODO
          // In case the response data have 1 item

          // If the current chat detail list is empty
          // if (state.chatDetail.length === 0) {
          //   const newGroupMessage = {
          //     email: action.payload?.author?.email,
          //     messageList: action.payload.chatDetail,
          //   };
          //   groupMessage = newGroupMessage;
          // } else {
          // }
          // groupMessage = action.payload.chatDetail;

          const newGroupMessage = {
            email: action.payload.chatDetail?.[0]?.author?.email,
            messageList: action.payload.chatDetail,
          };
          groupMessage = [newGroupMessage];
        } else if (action.payload.chatDetail.length !== 0) {
          action.payload.chatDetail.map((message, index) => {
            if (index === 0) {
              // first item
              tmp = { email: message?.author?.email, messageList: [message] };
            } else if (index === action.payload.chatDetail.length - 1) {
              // last item
              if (
                message?.author?.id ===
                action.payload.chatDetail[index - 1]?.author?.id
              ) {
                // If last item equal prev item => add to the messageList before add to the state
                tmp.messageList = [...tmp.messageList, message];
                groupMessage = [...groupMessage, tmp];
              } else {
                // If last item NOT equal prev item => add the prev item, create new tmp and add to the state
                groupMessage = [
                  ...groupMessage,
                  tmp, // add the prev item
                  { email: message?.author?.email, messageList: [message] }, // new tmp
                ];
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

        // This is new chat detail
        if (action.payload.chatTitle) {
          console.log("New chat detail");
          state.chatTitle = action.payload.chatTitle;
          state.chatDetail = groupMessage;
        } else {
          // This is loadmore chat detail
          console.log("Loadmore chat detail");

          const emailLastItem =
            state.chatDetail[state.chatDetail.length - 1].email;

          console.log("Compare email > ", emailLastItem, groupMessage[0].email);

          // If equal to last item of prev state => concat to the last item of prev state
          if (emailLastItem === groupMessage[0].email) {
            console.log("Equal -> concat");
            // Get the first item of new chat detail
            const firstItem = groupMessage.shift();

            // concat the first item to the prev state's last item
            // state.chatDetail[state.chatDetail.length - 1].messageList.concat(
            //   firstItem.messageList
            // );
            state.chatDetail[state.chatDetail.length - 1].messageList = [
              ...state.chatDetail[state.chatDetail.length - 1].messageList,
              ...firstItem.messageList,
            ];

            // concat the rest of new chat detail to the updated prev state
            // state.chatDetail.concat(groupMessage);
            state.chatDetail = [...state.chatDetail, ...groupMessage];
          } else {
            console.log("NOT Equal -> combine");
            // If NOT equal to last item of prev state => combine prev and new chat detail
            state.chatDetail = state.chatDetail.concat(groupMessage);
            // state.chatDetail = [...state.chatDetail, ...groupMessage];
          }
        }

        state.startKey = action.payload.startKey; // startKey / null
        state.chatId = action.payload.chatId;
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
