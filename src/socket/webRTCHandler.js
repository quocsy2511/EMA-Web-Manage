import store from "../store";
import { roomActions } from "../../src/store/room";

const onlyAudioConstraints = {
  audio: true,
  video: false,
};

const defaultAudioConstraints = {
  audio: true,
  video: true,
};

export const getLocalStreamPreview = (onlyAudio = false, callBackFunc) => {
  // Must have audio / mic to access the call ( video / camera is optional)
  const constrainst = onlyAudio
    ? onlyAudioConstraints
    : defaultAudioConstraints;

  // Get user agreement to use their device
  navigator.mediaDevices
    .getUserMedia(constrainst)
    .then((stream) => {
      console.log("stream >> ", stream);
      store.dispatch(roomActions.handleSetLocalstream(stream));

      callBackFunc();
    })
    .catch((err) => {
      console.log("Cannot get an access to local stream >> ", err);
    });
};
