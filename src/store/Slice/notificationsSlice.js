import { createSlice } from "@reduxjs/toolkit";
const notificationsSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    addNotification: (state, action) => {
      //   state.push(action.payload);
      return action.payload;
    },
  },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
