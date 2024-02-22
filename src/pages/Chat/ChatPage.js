import { Avatar, Input, Popover } from "antd";
import React, { Fragment, useState, memo, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoVideocam, IoCall } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsSendFill } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader, SyncLoader } from "react-spinners";
import momenttz from "moment-timezone";
import { defaultAvatar } from "../../constants/global";
import { FaCircle } from "react-icons/fa";
import { fetchChatDetail } from "../../store/chat_detail";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createConversation, createMessage } from "../../apis/chats";
import { getChatsList } from "../../store/chats";
import {
  getOnlineGroupUsersSocket,
  onConversationJoinSocket,
  onConversationLeaveSocket,
  onTypingStartSocket,
  onTypingStopSocket,
  socket,
} from "../../utils/socket";
import { handleUpdateUsers } from "../../store/online_user";

const now = momenttz().tz("Asia/Bangkok");

const SingleMessage = memo(({ isMe, index, length, content }) => {
  return (
    <p
      className={clsx(
        "text-sm font-medium px-5 py-3.5 rounded-3xl w-auto mt-1.5 border-2",
        { " text-black bg-white": isMe },
        { " text-white bg-blue-500 border-transparent": !isMe },

        { "rounded-tl-md": index === 0 && !isMe },
        { "rounded-tr-md ": index === 0 && isMe },

        { "rounded-bl-md": index === length && !isMe },
        { "rounded-br-md": index === length && isMe },

        {
          "rounded-bl-md rounded-tl-md":
            index !== length && index !== 0 && !isMe,
        },
        {
          "rounded-br-md rounded-tr-md":
            index !== length && index !== 0 && isMe,
        }
      )}
    >
      {content}
    </p>
  );
});

const MessageItem = memo(({ isMe, messageList }) => {
  const avatar = messageList?.[0]?.author?.profile?.avatar ?? defaultAvatar;
  const name = messageList?.[0]?.author?.profile?.fullName;
  return (
    <div
      className={clsx("px-8 flex space-x-5 items-end", {
        "justify-end": isMe,
      })}
    >
      {!isMe && (
        <Avatar
          src={avatar}
          className="w-10 h-10 mb-5 shadow-sm shadow-black/10"
        />
      )}
      <div
        className={clsx("w-[70%] space-y-1", {
          "mb-5": !isMe,
        })}
      >
        {/* {!isMe && (
          <p className="text-sm font-normal text">{name}</p>
        )} */}
        <div
          className={clsx("flex flex-col-reverse w-auto", {
            "items-end": isMe,
          })}
        >
          {messageList?.map((message, index) => (
            <div className="w-fit" key={message?.id ?? index}>
              <SingleMessage
                isMe={isMe}
                index={index}
                length={messageList?.length - 1}
                content={message.content}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const GroupChatItem = memo(
  ({ chat, onlineUsers, handleSelectConversationDetail, userEmail }) => {
    const time = momenttz(chat.lastMessageSentAt);

    let diff;
    if (now.diff(time, "minutes") < 5) diff = "Bây giờ";
    else if (now.diff(time, "minutes") < 60)
      diff = `${now.diff(time, "minutes")} phút trước`;
    else if (now.diff(time, "hours") < 24)
      diff = `${now.diff(time, "hours")} giờ trước`;
    else if (now.diff(time, "days") < 7)
      diff = `${now.diff(time, "days")} ngày trước`;
    else if (now.diff(time, "weeks") < 4)
      diff = `${now.diff(time, "weeks")} tuần trước`;
    else if (now.diff(time, "months") < 12)
      diff = `${now.diff(time, "months")} tháng trước`;
    else if (now.diff(time, "months") >= 12)
      diff = `${now.diff(time, "years")} năm trước`;

    const user =
      chat?.creator?.email !== userEmail ? chat?.creator : chat?.recipient;

    const isOnline = !!onlineUsers.find((item) => item.id === user?.id);

    return (
      <motion.div
        key={chat.id}
        onClick={() =>
          handleSelectConversationDetail(
            chat.id,
            user?.profile?.avatar,
            user?.profile?.fullName
          )
        }
        whileHover={{ scale: 1.1 }}
        className="bg-white p-5 rounded-lg space-y-5 shadow-md hover:shadow-xl transition-shadow shadow-black/10 cursor-pointer"
      >
        <div className="flex items-center space-x-5">
          <Avatar
            src={user?.profile?.avatar ?? defaultAvatar}
            className="w-10 h-10 shadow-sm shadow-black/10"
          />

          <div className="flex-1 justify-around">
            <p className="text-lg font-bold line-clamp-1">
              {user?.profile?.fullName ?? "Tên người dùng"}
            </p>
            <div
              className={clsx(
                "flex space-x-2 items-center text-xs font-semibold text-green-600",
                { "text-slate-400": !isOnline }
              )}
            >
              <FaCircle className="text-[0.45rem]" />
              <p>{isOnline ? "Trực tuyến" : "Ngoại tuyến"}</p>
            </div>
          </div>

          <p className="text-right text-sm font-normal text-slate-400">
            {diff}
          </p>
        </div>

        <div className="flex items-start space-x-5">
          <p
            className={clsx(
              "flex-1 line-clamp-3 text-base font-medium truncate",
              { "text-slate-500": !chat?.lastMessageSent }
            )}
          >
            {!chat?.lastMessageSent
              ? "Gửi tin nhắn đầu tiên"
              : chat?.lastMessageSent?.author?.email === userEmail
              ? "Bạn đã gửi 1 tin nhắn"
              : `${chat?.lastMessageSent?.author?.profile?.fullName}: ${chat?.lastMessageSent?.content}`}
          </p>
          <div className="w-5 h-5 flex justify-center items-center bg-red-500 rounded-full">
            <p className="text-white text-xs font-medium">3</p>
          </div>
        </div>
      </motion.div>
    );
  }
);

const ChatPage = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats);
  console.log("chats > ", chats);
  const chatDetail = useSelector((state) => state.chatDetail);
  const { onlineUsers, offlineUsers } = useSelector(
    (state) => state.onlineUser
  );
  console.log("onlineUsers > ", onlineUsers);

  const { email: managerEmail, id: managerId } =
    useRouteLoaderData("manager") || {};
  const { email: staffEmail, id: staffId } = useRouteLoaderData("staff") || {};

  const userEmail = managerEmail ? managerEmail : staffEmail;
  const userId = managerId ? managerId : staffId;
  console.log("userEmail > ", userEmail);

  const [searchInput, setSearchInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [searchUsers, setSearchUsers] = useState(null);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);

  useEffect(() => {
    // ================ REFETCH ONLINE USER ================
    getOnlineGroupUsersSocket();
    const interval = setInterval(() => {
      getOnlineGroupUsersSocket();
    }, 10000);
    // ================ REFETCH ONLINE USER ================

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // ================================ CHAT HANDLER ================================
    if (chatDetail.chatId !== "") onConversationJoinSocket(chatDetail.chatId);

    socket.on("userJoin", () => {
      console.log("userJoin");
    });

    socket.on("userLeave", () => {
      console.log("userLeave");
    });

    socket.on("onTypingStart", () => {
      console.log("onTypingStart: User has started typing...");
      setIsRecipientTyping(true);
    });
    socket.on("onTypingStop", () => {
      console.log("onTypingStop: User has stopped typing...");
      setIsRecipientTyping(false);
    });
    // ================================ CHAT HANDLER ================================

    return () => {
      // If chatDetail.chatId change => leave the previous room chat
      if (chatDetail.chatId !== "")
        onConversationLeaveSocket(chatDetail.chatId);
      socket.off("userJoin");
      socket.off("userLeave");
      socket.off("onTypingStart");
      socket.off("onTypingStop");
    };
  }, [chatDetail.chatId]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (searchInput !== "") {
        const searchOnlineUser = onlineUsers.filter(
          (user) =>
            user.id !== userId &&
            (user.email.includes(searchInput.toLowerCase()) ||
              user.fullName.toLowerCase().includes(searchInput.toLowerCase()))
        );

        const searchOfflineUsers = offlineUsers.filter(
          (user) =>
            user.id !== userId &&
            (user.email.includes(searchInput.toLowerCase()) ||
              user.fullName.toLowerCase().includes(searchInput.toLowerCase()))
        );

        const filterUser = searchOnlineUser
          .map((item) => ({ ...item, online: true }))
          .concat(searchOfflineUsers);

        setSearchUsers(filterUser);
      } else {
        setSearchUsers(null);
      }
    }, 1500);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchInput]);

  const { mutate: conversationMutate } = useMutation(
    ({ email, avatar, name }) => createConversation({ email }),
    {
      onSuccess: (data, variables) => {
        console.log("data > ", data, variables);
        // refetch lại chat list
        dispatch(getChatsList({ currentPage: 1 }));

        // access chat detail
        handleSelectConversationDetail(
          data?.id,
          variables.avatar,
          variables.name
        );

        setSearchInput("");
      },
      onError: (error, variables) => {
        console.log("error > ", error);
        console.log("variables > ", variables);

        if (error.response.status === 409) {
          console.log("409");

          handleSelectConversationDetail(
            error.response.data?.message,
            variables.avatar,
            variables.name
          );

          setSearchInput("");
        }
      },
    }
  );

  const { mutate: messageMutate } = useMutation(
    ({ id, content }) => createMessage(id, content),
    {
      onSuccess: (data, variables) => {
        console.log("insert new message > ", data);
      },
    }
  );

  const loadmoreChats = () => {
    dispatch(getChatsList({ currentPage: chats.nextPage }));
  };

  const loadmoreChatDetail = () => {
    dispatch(
      fetchChatDetail({ id: chatDetail.chatId, startKey: chatDetail.startKey })
    );
  };

  const handleSelectConversationDetail = (id, avatar, name) => {
    dispatch(fetchChatDetail({ id, chatTitle: { avatar, name } }));
  };

  const handleSubmitChatMessage = (e) => {
    if (e.target.value !== "") {
      // create new mesage
      messageMutate({ id: chatDetail.chatId, content: e.target.value });

      setChatInput("");
    }
  };

  const handleSubmitChatMessageButton = () => {
    if (chatInput !== "") {
      // create new mesage
      messageMutate({ id: chatDetail.chatId, content: chatInput });

      setChatInput("");
    }
  };

  const handleSelectConservation = (email, avatar, name) => {
    conversationMutate({ email, avatar, name });
  };

  // Handle open new room chat / call video
  const handleOpenNewRoom = (isAudioOnly) => {};

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-10 pb-0 pl-10 pr-14 flex space-x- ">
        {/* section 1 */}
        <div className="flex flex-col w-[35%] min-h-min max-h-[calc(100vh-64px-2.5rem)]">
          <p className="text-4xl text=black font-semibold ml-10 mb-5">Chats</p>

          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-md shadow-black/10 mx-10">
            <FiSearch className="text-slate-300" size={25} />
            <Input
              className="text-lg"
              bordered={false}
              placeholder="Tìm kiếm theo tên hoặc email"
              allowClear
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              onFocus={() => {
                const users = onlineUsers
                  .filter((user) => user.id !== userId)
                  .map((item) => ({
                    ...item,
                    online: true,
                  }))
                  .concat(offlineUsers.filter((user) => user.id !== userId));

                setSearchUsers(users);
              }}
              onBlur={() => {}}
            />
          </div>

          <AnimatePresence mode="wait">
            {!searchInput && !searchUsers ? (
              <motion.div
                key="chat"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                className="h-dvh max-h-dvh mt-5 pt-5 space-y-8 px-10 overflow-y-scroll overflow-x-visible scrollbar-hide pb-10"
              >
                {chats.status === "idle" ? (
                  <div className="flex flex-col items-center mt-10 space-y-3 ">
                    <ClipLoader color="#1677ff" size={45} />
                    <p className="text-xl">Đang tải ...</p>
                  </div>
                ) : chats.status === "succeeded" ||
                  chats.chats?.length !== 0 ? (
                  chats.chats?.length === 0 ? (
                    <p className="px-10 mt-10 text-center text-black text-2xl font-medium">
                      Chưa tham gia đoạn hội thoại nào !
                    </p>
                  ) : (
                    chats.chats?.length !== 0 &&
                    chats.chats?.map((chat, index) => (
                      <GroupChatItem
                        key={index}
                        chat={chat}
                        onlineUsers={onlineUsers}
                        handleSelectConversationDetail={
                          handleSelectConversationDetail
                        }
                        userEmail={userEmail}
                      />
                    ))
                  )
                ) : (
                  chats.status === "failed" && (
                    <p className="px-10 mt-10 text-center text-black text-xl font-medium">
                      Không thể lấy dữ liệu !<br />
                      Hãy thử lại sau.
                    </p>
                  )
                )}

                {chats.status === "pending" && (
                  <div className="flex flex-col items-center mt-10 space-y-3 ">
                    <ClipLoader color="#1677ff" size={45} />
                    <p className="text-xl">Đang tải ...</p>
                  </div>
                )}

                {chats.nextPage && chats.status === "succeeded" && (
                  <motion.p
                    onClick={loadmoreChats}
                    whileHover={{ y: -3 }}
                    className="text-lg text-center cursor-pointer"
                  >
                    Tải thêm
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                className="h-dvh max-h-dvh mt-5 pt-5 space-y-8 px-10 overflow-y-scroll overflow-x-visible scrollbar-hide pb-10"
              >
                <AnimatePresence mode="wait">
                  {searchUsers &&
                    (searchUsers.length === 0 ? (
                      <motion.div
                        key="search-not-found"
                        initial={{ x: -1, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -1, opacity: 0 }}
                        className="mt-10 text-center"
                      >
                        <p className="text-xl">
                          Không tìm thấy người dùng nào !
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="search-found"
                        initial={{ x: -1, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -1, opacity: 0 }}
                        className="space-y-5"
                      >
                        {searchUsers.map((user) => (
                          <motion.div
                            key={user.email}
                            onClick={() =>
                              handleSelectConservation(
                                user.email,
                                user.avatar,
                                user.fullName
                              )
                            }
                            whileHover={{
                              y: -3,
                            }}
                            className="flex items-center space-x-5 px-5 py-2 bg-white rounded-lg shadow-md cursor-pointer"
                          >
                            <div className="relative">
                              <Avatar
                                src={user.avatar ?? defaultAvatar}
                                size="large"
                              />
                              {user.online && (
                                <div className="bg-green-400 rounded-full border-2 right-0 border-white absolute bottom-0 h-[40%] w-[40%]" />
                              )}
                            </div>
                            <p className="text-lg">{user.fullName}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* section 2 */}
        <div className="flex-1 mx-20">
          {chatDetail.status === "idle" ? (
            // <div className="flex flex-col justify-center items-center h-full">
            //   <p className="text-xl font-medium">Chọn 1 đoạn hội thoại</p>
            // </div>
            <></>
          ) : chatDetail.status === "pending" &&
            chatDetail.chatDetail.length === 0 ? (
            <div className="flex-1 flex flex-col h-[calc(100vh-64px-5rem)] mb-10 rounded-xl overflow-hidden bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.3)] shadow-black/10">
              <div className="flex flex-col justify-center items-center h-full space-y-3">
                <ClipLoader color="#1677ff" size={45} />
                <p className="text-xl">Đang tải ...</p>
              </div>
            </div>
          ) : chatDetail.status === "succeeded" ||
            (chatDetail.status === "pending" &&
              chatDetail.chatDetail.length !== 0) ? (
            <div className="flex-1 flex flex-col h-[calc(100vh-64px-5rem)] mb-10 rounded-xl overflow-hidden bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.3)] shadow-black/10">
              {/* Header */}
              <div className="bg-slate-100 px-10 py-5 border-b-2 border-slate-200">
                <div className="flex items-center space-x-5">
                  <Avatar
                    src={chatDetail.chatTitle?.avatar ?? defaultAvatar}
                    className="w-12 h-12 shadow-sm shadow-black/10 bg-white"
                  />

                  <div className="flex-1 justify-around">
                    <p className="text-xl font-bold line-clamp-1">
                      {chatDetail.chatTitle?.name}
                    </p>
                    {/* <p className="text-sm">Nhân viên</p> */}
                    <div
                      className={clsx(
                        "flex space-x-2 items-center text-xs font-semibold text-green-600",
                        {
                          "text-slate-400": !onlineUsers.find(
                            (user) =>
                              user.fullName === chatDetail.chatTitle?.name
                          ),
                        }
                      )}
                    >
                      <FaCircle className="text-[0.45rem]" />
                      <p>
                        {onlineUsers.find(
                          (user) => user.fullName === chatDetail.chatTitle?.name
                        )
                          ? "Trực tuyến"
                          : "Ngoại tuyến"}
                      </p>
                    </div>
                  </div>

                  {/* Header Option */}
                  <div className="flex items-center space-x-3">
                    <motion.div
                      onClick={() => {
                        console.log("Video call");
                        // handleOpenNewRoom(true);
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="flex justify-center items-center bg-white w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-shadow shadow-black/20 hover:shadow-black/25 cursor-pointer"
                    >
                      <IoVideocam className="text-xl text-slate-500" />
                    </motion.div>
                    <motion.div
                      onClick={() => {
                        console.log("Call");
                        handleOpenNewRoom(false);
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="flex justify-center items-center bg-white w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-shadow shadow-black/20 hover:shadow-black/25 cursor-pointer"
                    >
                      <IoCall className="text-xl text-slate-500" />
                    </motion.div>
                    <motion.div
                      onClick={() => {
                        console.log("Hamburger");
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="flex justify-center items-center bg-white w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-shadow shadow-black/20 hover:shadow-black/25 cursor-pointer"
                    >
                      <HiOutlineDotsVertical className="text-xl text-slate-500" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Chat section */}
              <div className="min-h-[calc(100vh-64px-15rem)] max-h-[calc(100vh-64px-15rem)] bg-white space-y-5 py-10 overflow-scroll scrollbar-hide flex flex-col-reverse">
                {isRecipientTyping && (
                  <div className="flex items-center space-x-5 ml-8">
                    <Avatar
                      src={chatDetail.chatTitle?.avatar ?? defaultAvatar}
                      className="w-10 h-10 shadow-sm shadow-black/10"
                    />

                    <div className="rounded-3xl px-6 py-3 bg-blue-500">
                      <SyncLoader size={5} color="#ffffff" />
                    </div>
                  </div>
                )}

                {chatDetail.chatDetail.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-xl text-slate-400">
                      Hãy là người gửi đoạn tin nhắn đầu tiên
                    </p>
                  </div>
                ) : (
                  chatDetail.chatDetail?.map((groupMessage, index) => (
                    <MessageItem
                      key={index + groupMessage?.email}
                      isMe={groupMessage?.email === userEmail}
                      messageList={groupMessage.messageList}
                    />
                  ))
                )}

                {chatDetail.startKey && chatDetail.status === "succeeded" && (
                  <div
                    onClick={loadmoreChatDetail}
                    className="flex justify-center"
                  >
                    <Popover
                      placement="top"
                      // title={<p className="text-center">Tải thêm</p>}
                      content={<p className="text-center">Tải thêm</p>}
                      trigger="hover"
                    >
                      <motion.div
                        whileHover={{ y: -3 }}
                        className="border-4 rounded-full border-black p-1 cursor-pointer"
                      >
                        <FaArrowUp className="text-xl" />
                      </motion.div>
                    </Popover>
                  </div>
                )}

                {chatDetail.status === "pending" && (
                  <div className="flex flex-col items-center mt-10 space-y-3 ">
                    <ClipLoader color="#1677ff" size={45} />
                  </div>
                )}
              </div>

              {/* {loadmoreChatDetail} */}

              {/* Chat input */}
              <div className="flex items-center space-x-5 bg-white m-5 mt-0 pt-3 border-t-2 border-slate-100">
                <Input
                  className="text-xl"
                  bordered={false}
                  placeholder="Nhập đoạn tin nhắn ..."
                  value={chatInput}
                  onChange={(e) => {
                    if (e.target.value === "")
                      onTypingStopSocket(chatDetail.chatId);
                    else onTypingStartSocket(chatDetail.chatId);
                    setChatInput(e.target.value);
                  }}
                  onPressEnter={handleSubmitChatMessage}
                  onFocus={() => {}}
                  onBlur={() => {
                    onTypingStopSocket(chatDetail.chatId);
                  }}
                />
                <div
                  onClick={handleSubmitChatMessageButton}
                  className="w-9 h-9 flex justify-center items-center rounded-full bg-blue-500"
                >
                  <BsSendFill className="text-white text-sm" />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ChatPage;
