import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addLetterTranscript,
  addLetterTranslated,
  setConfirmation,
  setNotifacation,
  setRecBtn,
  setDeepgramStatus,
} from "../redux/technical/technical-slice";
import {
  getTargetLanguage,
  getInputLanguage,
} from "../redux/technical/technical-selectors";

const serverURL = "http://localhost:4000";
// const serverURL =
//   "https://speechify-test-yd-server-4f435b1fac7b.herokuapp.com/";

const subscriptions = [
  "final",
  "final-transleted",
  "partial",
  "transcriber-ready",
  "error",
  "close",
];

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const targetLanguage = useSelector(getTargetLanguage);
  const inputLanguage = useSelector(getInputLanguage);

  const initialize = () => {
    if (!socketRef.current) {
      socketRef.current = io(serverURL);

      socketRef.current.on("connect", () => {
        console.log("connected to server");

        subscriptions.forEach((event) => {
          socketRef.current.on(event, (data) => {
            // console.log(event, data);

            if (event === "transcriber-ready" && data === "Ready") {
              dispatch(setConfirmation(true));
              dispatch(setDeepgramStatus(true));
              dispatch(setRecBtn(true));

              setTimeout(() => {
                dispatch(setNotifacation(false));
                dispatch(setConfirmation(false));
              }, 6500);
            }

            if (event === "close" && data === "Deepgram connection is closed") {
              dispatch(setDeepgramStatus(false));
            }

            if (event === "final") {
              console.log(data);
              for (let i = 0; i < data.length; i++) {
                dispatch(addLetterTranscript(data[i]));
              }
              if (data.length > 0) {
                dispatch(addLetterTranscript(" "));
              }
            }

            if (event === "final-transleted") {
              for (let i = 0; i < data.length; i++) {
                dispatch(addLetterTranslated(data[i]));
              }
              if (data.length > 0) {
                dispatch(addLetterTranslated(" "));
              }
            }
          });
        });
      });
    } else {
      return;
    }
  };

  const sendAudio = (audioData, sampleRate, sourceType) => {
    if (socketRef.current) {
      console.log(sourceType);
      socketRef.current.emit("incoming-audio", {
        audioData,
        sampleRate,
        sourceType,
        targetLanguage,
        inputLanguage,
      });
    }
  };

  const pause = async (data) => {
    if (socketRef.current) {
      socketRef.current.emit("pause-deepgram", data);
    }
  };

  const disconnect = async () => {
    if (socketRef.current) {
      socketRef.current.emit("diconnect-deepgram");
    }
  };

  return { initialize, sendAudio, pause, disconnect };
};

export default useSocket;
