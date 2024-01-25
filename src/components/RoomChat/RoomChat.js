import clsx from "clsx";
import React, { useState } from "react";
import RoomButton from "./RoomButton";
import VideoContainer from "./VideoContainer";

const RoomChat = () => {
  const [isRoomMinimized, setIsRoomMinimized] = useState(true);

  const changeRoomResizeMode = () => {
    setIsRoomMinimized((prev) => !prev);
  };

  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center absolute z-[99999] rounded-md bg-[#202225]",
        { "bottom-8 right-8 w-[30%] h-[40vh]": isRoomMinimized },
        { "bottom-0 left-0 right-0 top-0 rounded-none": !isRoomMinimized }
      )}
    >
      <VideoContainer />

      {/* Perform action of the call like mute all - see specific screen or disconnect */}
      <RoomButton
        isRoomMinimized={isRoomMinimized}
        changeRoomResizeMode={changeRoomResizeMode}
      />
    </div>
  );
};

export default RoomChat;
