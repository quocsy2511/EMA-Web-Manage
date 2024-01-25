import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Video = ({ stream, isLocalStream }) => {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);

  return (
    <div className="h-[50%] w-[50%] bg-black rounded-xl">
      <div
        className="w-full h-full"
        ref={videoRef}
        autoPlay
        muted={isLocalStream ? true : false}
      />
    </div>
  );
};

const VideoContainer = () => {
  const room = useSelector((state) => state.room);
  console.log("room >> ", room);

  return (
    <div className="h-[85%] w-full flex flex-wrap">
      <Video stream={room?.localStream} isLocalStream />
    </div>
  );
};

export default VideoContainer;
