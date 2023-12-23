import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserInRoom: false, // Enable user to join the room if user has not been in any room yet
  isUserRoomCreator: false, // Check if room is created by user or not
  roomDetails: null,
  activeRooms: [], // List of active room
  localStream: null, // User can stream by camera or microphone
  remoteStream: [], // List of other user in the room is streaming
  audioOnly: false, // Voice only not streaming
  screenSharingStream: null, // Sharing screen
  isScreenSharingActive: false, // Check if user is sharing screen or not
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    handleOpenRoom(state, action) {
      state.isUserInRoom = action.payload.isUserInRoom;
      state.isUserRoomCreator = action.isUserRoomCreator;
    },
    handleSetRoomDetail(state, action) {},
    handleSetActiveRooms(state, action) {},
    handleSetLocalstream(state, action) {},
    handleSetRemoteStreams(state, action) {},
    handleSetAudioOnly(state, action) {},
    handleSetScreenShareStream(state, action) {},
    // handle(state, action) {},
  },
});

export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
