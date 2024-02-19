import { io } from "socket.io-client";
import { URL_SOCKET } from "../constants/api";
import { chatDetailActions } from "../store/chat_detail";
import { handleUpdateUsers } from "../store/online_user";
import { chatsActions } from "../store/chats";

export const socket = io(URL_SOCKET, {
  withCredentials: true,
  auth: {
    access_token: localStorage.getItem("token"),
  },
});

export const socketListener = (dispatch, notificationAPI) => {
  // create connection
  socket.on("connect-success", () => {
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

    const { message, newConservations } = data ?? {};

    const customNewMessage = {
      attachments: [],
      author: message?.author,
      content: message?.content,
      createdAt: message?.createdAt,
      id: message?.id,
      updatedAt: message?.updatedAt,
    };

    dispatch(
      chatDetailActions.updateChatDetail({
        email: message?.author?.email,
        newMessage: customNewMessage,
      })
    );

    dispatch(chatsActions.updateChat(newConservations));
  });

  // Get online / offline user
  socket.on("onlineGroupUsersReceived", (data) => {
    console.log("online user > ", data);

    dispatch(
      handleUpdateUsers({
        onlineUsers: data.onlineUsers,
        offlineUsers: data.offlineUsers,
      })
    );
  });
};

// =============================== EMIT SOCKET ===============================
export const getOnlineGroupUsersSocket = () => {
  socket.emit("getOnlineGroupUsers", {});
};

export const getOnlineUserSocket = () => {
  socket.emit("getOnlineUser", {});
};

export const onConversationJoinSocket = (conversationId) => {
  socket.emit("onConversationJoin", { conversationId });
};

export const onConversationLeaveSocket = (conversationId) => {
  socket.emit("onConversationLeave", { conversationId });
};

export const onTypingStartSocket = (conversationId) => {
  socket.emit("onTypingStart", { conversationId });
};

export const onTypingStopSocket = (conversationId) => {
  socket.emit("onTypingStop", { conversationId });
};

export const closeConnectSocket = () => {
  socket.emit("closeConnect", {});
};


// =============================== CLEAN UP SOCKET ===============================
export const cleanUpNotification = () => {
  socket.off("notification");
};

export const cleanUpOnMessage = () => {
  socket.off("onMessage");
};

export const cleanUpOnlineGroupUsersReceived = () => {
  socket.off("onlineGroupUsersReceived");
};
