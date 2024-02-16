import { Avatar, Input } from "antd";
import React, { Fragment, useState, memo, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoVideocam, IoCall } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsSendFill } from "react-icons/bs";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { roomActions } from "../../store/room";
import { getLocalStreamPreview } from "../../socket/webRTCHandler";
import { ClipLoader } from "react-spinners";
import momenttz from "moment-timezone";
import { defaultAvatar } from "../../constants/global";
import { FaCircle } from "react-icons/fa";
import { fetchChatDetail } from "../../store/chat_detail";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createMessage } from "../../apis/chats";
import { getChatsList } from "../../store/chats";

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
  console.log("messageList > ", messageList);
  console.log("isMe > ", isMe);

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
            <div className="w-fit">
              <SingleMessage
                key={index}
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

const GroupChatItem = memo(({ chat, handleSelectConversationDetail }) => {
  const time = momenttz(chat.lastMessageSentAt).tz("Asia/Bangkok");

  let diff;
  if (now.diff(time, "minutes") < 60)
    diff = `${now.diff(time, "minutes")} phút`;
  else if (now.diff(time, "hours") < 24)
    diff = `${now.diff(time, "hours")} giờ`;
  else if (now.diff(time, "days") < 7) diff = `${now.diff(time, "days")} ngày`;
  else if (now.diff(time, "weeks") < 4)
    diff = `${now.diff(time, "weeks")} tuần`;
  else if (now.diff(time, "months") < 12)
    diff = `${now.diff(time, "months")} tháng`;
  else if (now.diff(time, "months") >= 12)
    diff = `${now.diff(time, "years")} năm`;

  return (
    <motion.div
      onClick={() =>
        handleSelectConversationDetail(
          chat.id,
          chat?.recipient?.profile?.avatar,
          chat?.recipient?.profile?.fullName
        )
      }
      whileHover={{ scale: 1.1 }}
      className="bg-white p-5 rounded-lg space-y-5 shadow-md hover:shadow-xl transition-shadow shadow-black/10 cursor-pointer"
    >
      <div className="flex items-center space-x-5">
        <Avatar
          src={chat?.recipient?.profile?.avatar ?? defaultAvatar}
          className="w-10 h-10 shadow-sm shadow-black/10"
        />

        <div className="flex-1 justify-around">
          <p className="text-lg font-bold line-clamp-1">
            {chat?.recipient?.profile?.fullName ?? "Tên người dùng"}
          </p>
          <div className="flex space-x-2 items-center text-xs font-semibold text-green-600">
            <FaCircle className="text-[0.45rem]" />
            <p>Trực tuyến</p>
          </div>
        </div>

        <p className="text-right text-sm font-normal text-slate-400">
          {diff} trước
        </p>
      </div>

      <div className="flex items-start space-x-5">
        <p className="flex-1 line-clamp-3 text-base font-normal">
          {chat?.lastMessageSent?.content}
        </p>
        <div className="w-5 h-5 flex justify-center items-center bg-red-500 rounded-full">
          <p className="text-white text-xs font-medium">11</p>
        </div>
      </div>
    </motion.div>
  );
});

const ChatPage = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats);
  // console.log("chats from redux > ", chats);
  const chatDetail = useSelector((state) => state.chatDetail);
  // console.log("chatDetail from redux > ", chatDetail);

  const { email: managerEmail } = useRouteLoaderData("manager");

  const [searchInput, setSearchInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  const { mutate } = useMutation(
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
    dispatch(fetchChatDetail({ id, currentPage: chatDetail.nextPage }));
  };

  const handleSelectConversationDetail = (id, avatar, name) => {
    dispatch(
      fetchChatDetail({ id, chatTitle: { avatar, name }, currentPage: 1 })
    );
  };

  const handleSubmitChatMessage = (e) => {
    if (e.target.value !== "") {
      // create new mesage
      mutate({ id: chatDetail.chatId, content: e.target.value });

      setChatInput("");
    }
  };

  const handleSubmitChatMessageButton = () => {
    if (chatInput !== "") {
      // create new mesage
      mutate({ id: chatDetail.chatId, content: chatInput });

      setChatInput("");
    }
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
              placeholder="Search"
              allowClear
              onChange={(e) => {
                console.log("e.target.value >> ", e.target.value);
                setSearchInput(e.target.value);
              }}
            />
          </div>

          <div className="h-dvh max-h-dvh mt-5 pt-5 space-y-8 px-10 overflow-y-scroll overflow-x-visible scrollbar-hide pb-10">
            {chats.status === "idle" ? (
              <div className="flex flex-col items-center mt-10 space-y-3 ">
                <ClipLoader color="#1677ff" size={45} />
                <p className="text-xl">Đang tải ...</p>
              </div>
            ) : chats.status === "succeeded" || chats.chats?.length !== 0 ? (
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
                    handleSelectConversationDetail={
                      handleSelectConversationDetail
                    }
                  />
                ))
              )
            ) : (
              chats.status === "failed" && (
                <p className="px-10 mt-10 text-center text-black text-2xl font-medium">
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
          </div>
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
                    <div className="flex space-x-2 items-center text-xs font-semibold text-green-600">
                      <FaCircle className="text-[0.45rem]" />
                      <p>Trực tuyến</p>
                    </div>
                  </div>

                  {/* Header Option */}
                  <div className="flex items-center space-x-3">
                    <motion.div
                      onClick={() => {
                        console.log("Video call");
                        handleOpenNewRoom(true);
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
                {chatDetail.chatDetail?.map((groupMessage, index) => (
                  <MessageItem
                    key={index}
                    isMe={groupMessage?.email === managerEmail}
                    messageList={groupMessage.messageList}
                  />
                ))}

                {chatDetail.nextPage && chatDetail.status === "succeeded" && (
                  <motion.p
                    onClick={loadmoreChatDetail}
                    whileHover={{ y: -3 }}
                    className="text-lg text-center cursor-pointer"
                  >
                    Tải thêm
                  </motion.p>
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
                    console.log("e.target.value > ", e.target.value);
                    setChatInput(e.target.value);
                  }}
                  onPressEnter={handleSubmitChatMessage}
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
