import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";

export const managerSocket = (dispatch) => {
  const token = localStorage.getItem("token");

  const socket = io(URL_SOCKET, {
    autoConnect: false,
    auth: {
      access_token: token,
    },
  });

  // create connection
  socket.on("connect", () => {
    console.log("Successfully connect with socket.io server : ", socket.id);
  });

  // Listen to
  socket.on("notification", (data) => {});

  socket.on("chat", (data) => {});

  // socket.emit("getOnlineGroupUsers", { data });
  // socket.emit("onConversationJoin", { data });
  // socket.emit("onConversationLeave", { data });
};
