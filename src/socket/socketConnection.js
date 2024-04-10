import io from "socket.io-client";
import { URL_SOCKET } from "../constants/api";

let socket = null;

// Listen to server side
export const connectWithSocket = (token, dispatch) => {
  socket = io(URL_SOCKET, {
    auth: {
      access_token: token,
    },
  });

  socket.on("connect", () => {});
};
