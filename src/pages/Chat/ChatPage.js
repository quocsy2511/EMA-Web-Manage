import { Avatar, Input } from "antd";
import React, { Fragment, useState, memo } from "react";
import { FiSearch } from "react-icons/fi";
import { IoVideocam, IoCall } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsSendFill } from "react-icons/bs";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { roomActions } from "../../store/room";
import { getLocalStreamPreview } from "../../socket/webRTCHandler";

const SingleMessage = memo(({ isMe }) => {
  return (
    <p
      className={clsx(
        "bg-blue-500 text-sm font-medium px-5 py-3.5 rounded-3xl rounded-tl-md rounded-bl-3xl w-auto",
        { " text-black bg-white border-2": isMe },
        { " text-white": !isMe }
        // { "rounded-bl-md": index === 0 && !isMe },
        // { "rounded-bl-md rounded-tl-md": index === 0 && !isMe },
        // { "rounded-tl-md": index === .length && !isMe },
        // { "rounded-br-md": index === 0 && isMe },
        // { "rounded-br-md rounded-tr-md": index === 0 && isMe },
        // { "rounded-tr-md": index === .length && isMe },
      )}
    >
      dasjdasvdjhas d asd asd as das dsad asd asd asd sad as das as as d asd asd
      as das d asd asd as das d asd
    </p>
  );
});

const MessageItem = memo(({ isMe }) => {
  return (
    <div
      className={clsx("px-8 flex space-x-5 items-end", { "justify-end": isMe })}
    >
      {!isMe && (
        <Avatar
          src={
            "https://m.media-amazon.com/images/M/MV5BOWU1ODBiNGUtMzVjNi00MzdhLTk0OTktOWRiOTIxMWNhOGI2XkEyXkFqcGdeQXVyMTU2OTM5NDQw._V1_FMjpg_UX1000_.jpg"
          }
          className="w-10 h-10 mb-2 shadow-sm shadow-black/10"
        />
      )}
      <div className="max-w-[70%] space-y-1">
        {!isMe && (
          <p className="px-4 text-sm text-slate-400 font-normal">Phụng gà</p>
        )}
        <SingleMessage isMe={isMe} />
        <SingleMessage isMe={isMe} />
        <SingleMessage isMe={isMe} />
      </div>
    </div>
  );
});

const GroupChatItem = memo(() => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="bg-white p-5 rounded-lg space-y-5 shadow-md hover:shadow-xl transition-shadow shadow-black/10 cursor-pointer"
    >
      <div className="flex items-center space-x-5">
        <Avatar
          src={
            "https://m.media-amazon.com/images/M/MV5BOWU1ODBiNGUtMzVjNi00MzdhLTk0OTktOWRiOTIxMWNhOGI2XkEyXkFqcGdeQXVyMTU2OTM5NDQw._V1_FMjpg_UX1000_.jpg"
          }
          className="w-10 h-10 shadow-sm shadow-black/10"
        />

        <div className="flex-1 justify-around">
          <p className="text-lg font-bold line-clamp-1">
            Nguyn Vuuu asd as dsa sa dsad adas sadas asdsaadsasasasdasasasda
          </p>
          <p className="text-xs">Nhân viên</p>
        </div>

        <p className="text-right text-sm font-normal text-slate-400">
          1 minute ago
        </p>
      </div>

      <div className="flex items-start space-x-5">
        <p className="flex-1 line-clamp-3 text-sm font-normal">
          This is a 1 line message
        </p>
        <div className="w-5 h-5 flex justify-center items-center bg-red-500 rounded-full">
          <p className="text-white text-xs font-medium">11</p>
        </div>
      </div>
    </motion.div>
  );
});

const ChatPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  console.log("chatInput >> ", chatInput);

  const dispatch = useDispatch();
  const room = useSelector((state) => state.room);

  const handleSubmitChatMessage = () => {
    setChatInput("");
  };

  // Handle open new room chat / call video
  const handleOpenNewRoom = (isAudioOnly) => {
    if (isAudioOnly) dispatch(roomActions.handleSetAudioOnly(true));
    else dispatch(roomActions.handleSetAudioOnly(false));

    // if user allow to access mic - camera => success
    const successCallbackFunc = () => {
      dispatch(roomActions.handleOpenRoom({ isUserInRoom: true }));
    };

    // getLocalStreamPreview(false, successCallbackFunc);
    // getLocalStreamPreview(isAudioOnly, successCallbackFunc);
    getLocalStreamPreview(room.audioOnly, successCallbackFunc);
  };

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-10 pb-0 pl-10 pr-14 flex space-x-14 ">
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
            <GroupChatItem />
            <GroupChatItem />
            <GroupChatItem />
            <GroupChatItem />
            <GroupChatItem />
            <GroupChatItem />

            <p className="px-10 text-center text-black text-xl font-medium">
              You are not added to any group chat !
            </p>
          </div>
        </div>

        {/* section 2 */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-64px-5rem)] mb-10 rounded-xl overflow-hidden bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.3)] shadow-black/10">
          {/* Header */}
          <div className="bg-slate-100 px-10 py-5 border-b-2 border-slate-200">
            <div className="flex items-center space-x-5">
              <Avatar
                src={
                  "https://m.media-amazon.com/images/M/MV5BOWU1ODBiNGUtMzVjNi00MzdhLTk0OTktOWRiOTIxMWNhOGI2XkEyXkFqcGdeQXVyMTU2OTM5NDQw._V1_FMjpg_UX1000_.jpg"
                }
                className="w-12 h-12 shadow-sm shadow-black/10 bg-white"
              />

              <div className="flex-1 justify-around">
                <p className="text-xl font-bold line-clamp-1">
                  Nguyn Vuuu asd as dsa sa dsad adas sadas
                  asdsaadsasasasdasasasda
                </p>
                <p className="text-sm">Nhân viên</p>
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
          <div className="min-h-[calc(100vh-64px-15rem)] max-h-[calc(100vh-64px-15rem)] bg-white space-y-5 py-10 overflow-scroll scrollbar-hide">
            <MessageItem isMe />
            <MessageItem isMe={false} />
            <MessageItem isMe />
          </div>

          {/* Chat input */}
          <div className="flex items-center space-x-5 bg-white m-5 mt-0 pt-3 border-t-2 border-slate-100">
            <Input
              className="text-xl"
              bordered={false}
              placeholder="Type a message here"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onPressEnter={handleSubmitChatMessage}
            />
            <div
              onClick={handleSubmitChatMessage}
              className="w-9 h-9 flex justify-center items-center rounded-full bg-blue-500"
            >
              <BsSendFill className="text-white text-sm" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ChatPage;
