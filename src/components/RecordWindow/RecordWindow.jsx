import { useDispatch, useSelector } from "react-redux";
import useSocket from "../../useSocket";
import useAudioRecorder from "../../helpers/useAudioRecorder_old";
import AudioVisualizer from "../Shared/AudioVisualizer/AudioVisualizer";
import {
  getActiveBtn,
  getDeepgramStatus,
  getLine,
} from "../../redux/technical/technical-selectors";
import {
  setNotifacation,
  setConfirmation,
  setRecBtn,
  changeLine,
  // clearTextArray,
} from "../../redux/technical/technical-slice";
import TextView from "../TextView";
import Toggle from "../Shared/Toggle/Toggle";
import PlayModePanel from "../PlayModePanel/PlayModePanel";
import SelectLanguagePanel from "../SelectLanguagePanel/SelectLanguagePanel";
import Logo from "../Shared/logo/logo";
import Timer from "../Shared/Timer/Timer";
import image03 from "../../images/save-new.png";
import image04 from "../../images/clear-new.png";
import mic from "../../images/microphone.png";
import speaker from "../../images/speaker.png";

import s from "./RecordWindow.module.scss";

const RecordWindow = () => {
  const dispatch = useDispatch();
  const activeBtn = useSelector(getActiveBtn);
  const activeLine = useSelector(getLine);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const { initialize, sendAudio, pause, disconnect } = useSocket();
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
    audioContext,
    sourceNodeMic,
    sourceNodeSpeaker,
  } = useAudioRecorder({
    dataCb: (audioData, sampleRate, sourceType) => {
      sendAudio(audioData, sampleRate, sourceType);
      dispatch(changeLine(sourceType));
    },
  });

  const handleActiveBtnChange = (btnType) => {
    switch (btnType) {
      case "play":
        if (!isPaused && !isRecording) {
          initialize();
          startRecording();
          dispatch(setNotifacation(true));
        } else if (isPaused && isRecording) {
          togglePauseResume();
          pause(false);
          dispatch(setRecBtn(true));
        }
        break;
      case "pause":
        if (activeBtn === "pause" && !isPaused && isRecording) {
          togglePauseResume();
          pause(true);
          dispatch(setRecBtn(false));
        }
        break;
      case "stop":
        if (activeBtn === "stop") {
          if (deepgramStatus) {
            stopRecording();
            disconnect();
            dispatch(setRecBtn(false));
            dispatch(setNotifacation(false));
            dispatch(setConfirmation(false));
          }
        }
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {};

  const handleClear = () => {
    // setTypedText("");
    // setCopiedText("");
    // setSecondTextareaText("");
    // setIsOperatonBtnActive(false);
    // dispatch(clearTextArray());
  };

  return (
    <div className={s.recordWindow}>
      <div className={s.windowContent}>
        <div className={s.namePart}>
          <Logo />
          <p className={s.name}>SpeakFlow</p>
        </div>
        <div className={s.audioVisualizer}>
          {audioContext && sourceNodeSpeaker && activeLine === "speaker" && (
            <AudioVisualizer
              audioContext={audioContext}
              sourceNode={sourceNodeSpeaker}
            />
          )}
          {audioContext && sourceNodeMic && activeLine === "mic" && (
            <AudioVisualizer
              audioContext={audioContext}
              sourceNode={sourceNodeMic}
            />
          )}
          <div className={s.timer}>
            <Timer />
          </div>
          <div className={s.iconWrapper}>
            <img
              src={activeLine === "mic" ? mic : speaker}
              alt="active chanel"
              className={s.icon}
              style={{
                width: activeLine === "mic" ? "25px" : "20px",
                height: activeLine === "mic" ? "25px" : "20px",
                marginRight: activeLine === "mic" ? "15px" : "15px",
              }}
            />
          </div>
        </div>
        <TextView />
        <div className={s.settingsWrapper}>
          <SelectLanguagePanel />
          <div className={s.btnWrapper}>
            <Toggle data="mic" />
            <PlayModePanel handleChange={handleActiveBtnChange} />
            <Toggle data="portrait" />
          </div>
          <div className={s.btnWrapper}>
            <button id="reset-button" className={s.btn} onClick={handleClear}>
              <div className={s.btnPart}>
                <img src={image04} alt="clear" className={s.icon} />
                <p className={s.btnText}>Clear</p>
              </div>
            </button>
            <button id="save-button" className={s.btn} onClick={handleSave}>
              <div className={s.btnPart}>
                <img src={image03} alt="save" className={s.icon} />
                <p className={s.btnText}>Save</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordWindow;

// useEffect(() => {
//   let interval;
//   let index = currentTranscriptionIndex;
//   let text = typedText;

//   const typeText = () => {
//     if (index < textArray.length) {
//       text = text + textArray[index];
//       setTypedText(text);
//       index++;
//       setCurrentTranscriptionIndex(index);
//     } else {
//       clearInterval(interval);
//     }
//   };

//   interval = setInterval(typeText, 50);
//   return () => clearInterval(interval);
// }, [textArray, currentTranscriptionIndex, typedText]);

// useEffect(() => {
//   let interval;
//   let index = currentTranslatedIndex;
//   let text = translatedText;

//   const typeText = () => {
//     if (index < textTranslatedArray.length) {
//       text = text + textTranslatedArray[index];
//       setTranslatedText(text);
//       index++;
//       setCurrentTranslatedIndex(index);
//     } else {
//       clearInterval(interval);
//     }
//   };

//   interval = setInterval(typeText, 50);
//   return () => clearInterval(interval);
// }, [textTranslatedArray, currentTranslatedIndex, translatedText]);
