import io from "socket.io-client";
import { URL_SOCKET } from "../constants/api";

let socket = null;

// Listen to server side
export const connectWithSocket = (token, dispatch) => {
  console.log("dispatch>> ", dispatch);

  socket = io(URL_SOCKET, {
    auth: {
      access_token: token,
    },
  });

  socket.on("connect", () => {
    console.log("Successfully connect with socket.io server : ", socket.id);
  });
};

// Emit to server side
