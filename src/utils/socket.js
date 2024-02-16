import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";
import { chatDetailActions } from "../store/chat_detail";

const socket = io(URL_SOCKET, {
  withCredentials: true,
  auth: {
    access_token: localStorage.getItem("token"),
  },
});

export const managerSocket = (dispatch, notificationAPI) => {
  // create connection
  socket.on("connect", () => {
    console.log("Successfully connect with socket.io server : ", socket.id);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("Successfully connect with socket.io server : ", socket.id);
  });

  // Listen to get notification
  socket.on("notification", (data) => {
    console.log("data:", data);
    // queryClient.invalidateQueries(["notifications", "10"]);
    notificationAPI.open({
      message: <p className="text-base">Đã nhận 1 thông báo</p>,
      description: (
        <div className="flex items-center gap-x-3">
          <Avatar src={data?.avatar} />
          <p className="text-sm">
            <span className="font-semibold">
              {data?.content?.split("đã")[0]}{" "}
            </span>
            đã {data?.content?.split("đã")[1]}
          </p>
        </div>
      ),
      duration: 3,
    });
  });

  // Listen to incoming message
  socket.on("onMessage", (data) => {
    console.log("onMessage data > ", data);

    const customNewMessage = {
      attachments: [],
      author: data?.author,
      content: data?.content,
      createdAt: data?.createdAt,
      id: data?.id,
      updatedAt: data?.updatedAt,
    };

    dispatch(
      chatDetailActions.updateChatDetail({
        email: data?.author?.email,
        newMessage: customNewMessage,
      })
    );
  });

  socket.on("onlineGroupUsersReceived", (data) => {
    console.log("online user > ", data);
  });

  // socket.emit("onConversationJoin", { data });
  // socket.emit("onConversationLeave", { data });
};

export const getOnlineGroupUsersSocket = () => {
  socket.emit("getOnlineGroupUsers", {});
};
