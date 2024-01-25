import React, { useState } from "react";
import { SlSizeActual, SlSizeFullscreen } from "react-icons/sl";
import {
  MdOutlineScreenShare,
  MdOutlineStopScreenShare,
  MdClose,
} from "react-icons/md";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { HiMiniVideoCamera, HiMiniVideoCameraSlash } from "react-icons/hi2";
import clsx from "clsx";
import { useDispatch } from "react-redux";

const RoomButton = ({ isRoomMinimized, changeRoomResizeMode }) => {
  const dispatch = useDispatch();

  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const toggleSharingScreen = () => {
    setIsSharingScreen((prev) => !prev);
  };

  const toggleMicOn = () => {
    setIsMicOn((prev) => !prev);
  };

  const toggleCameraOn = () => {
    setIsCameraOn((prev) => !prev);
  };

  // const leaveRoom = () => {
  //   const roomId = room?.roomDetails?.roomId;

  //   const localStream = room?.localStream;
  //   if (localStream) {
  //     localStream.getTracks().forEach((track) => track.stop());
  //     dispatch(roomActions.handleSetLocalstream(null));
  //   }

  //   dispatch(roomActions.handleSetRoomDetail(null));
  //   dispatch(roomActions.handleOpenRoom(false));
  // };

  return (
    <div
      className={clsx(
        "absolute bottom-0 right-0 left-0 flex items-center justify-center h-[18%] bg-[#5865f2] rounded-3xl rounded-b-none px-8",
        { "h-[10%]": !isRoomMinimized }
      )}
    >
      <div className="w-6" />

      <div className="flex-1 flex justify-center space-x-5">
        <div onClick={toggleSharingScreen}>
          {isSharingScreen ? (
            <MdOutlineScreenShare className="text-3xl text-white" />
          ) : (
            <MdOutlineStopScreenShare className="text-3xl text-white" />
          )}
        </div>
        <div onClick={toggleMicOn}>
          {isMicOn ? (
            <IoIosMic className="text-3xl text-white" />
          ) : (
            <IoIosMicOff className="text-3xl text-white" />
          )}
        </div>
        <div onClick={toggleCameraOn}>
          {isCameraOn ? (
            <HiMiniVideoCamera className="text-3xl text-white" />
          ) : (
            <HiMiniVideoCameraSlash className="text-3xl text-white" />
          )}
        </div>
        <MdClose className="text-3xl text-white" />
      </div>

      <div onClick={changeRoomResizeMode} className="">
        {isRoomMinimized ? (
          <SlSizeFullscreen className="text-2xl text-white" />
        ) : (
          <SlSizeActual className="text-2xl text-white" />
        )}
      </div>
    </div>
  );
};

export default RoomButton;
