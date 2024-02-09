import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";

export const managerChatSocket = (dispatch) => {
  const token = localStorage.getItem("token");

  const socket = io(URL_SOCKET, {
    auth: {
      access_token: token,
    },
  });

  // create connection
  socket.on("connect", () => {
    console.log("Successfully connect with socket.io server : ", socket.id);
  });

  socket.on("notification", (data) => {});

  socket.on("chat", (data) => {
    
  });
};
