import { useDispatch, useSelector } from "react-redux";
import useSocket from "../../useSocket";
import useAudioRecorder from "../../helpers/useAudioRecorder_old";
import { useMediaQuery } from "react-responsive";
import AudioVisualizer from "../Shared/AudioVisualizer/AudioVisualizer";
import {
  getActiveBtn,
  getDeepgramStatus,
  getDisplay,
  getLine,
} from "../../redux/technical/technical-selectors";
import {
  setNotifacation,
  setConfirmation,
  setRecBtn,
  changeLine,
  changeDisplay,
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
import Button from "../Shared/Button";
import AuthInfo from "../AuthInfo";

import s from "./RecordWindow.module.scss";
import { useEffect } from "react";

const RecordWindow = () => {
  const isDesctop = useMediaQuery({ minWidth: 1280 });
  const dispatch = useDispatch();
  const activeBtn = useSelector(getActiveBtn);
  const activeLine = useSelector(getLine);
  const displayType = useSelector(getDisplay);
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

  useEffect(() => {
    if (!isDesctop) {
      dispatch(changeDisplay("portrait"));
    }
  }, [isDesctop, dispatch]);

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
      {displayType === "portrait" && (
        <div className={s.windowContentPortrait}>
          <div className={s.nameAndAuth}>
            <div className={s.namePart}>
              <Logo />
              <p className={s.name}>SpeakFlow</p>
            </div>
            <AuthInfo />
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
            <div className={s.playModeWrapper}>
              <PlayModePanel handleChange={handleActiveBtnChange} />
              {isDesctop && <Toggle />}
            </div>
            <div className={s.btnWrapper}>
              <Button
                id="reset-button"
                btnClass="btnDark"
                image={image04}
                text="Clear"
                onClick={handleClear}
              />
              <Button
                id="save-button"
                btnClass="btnDark"
                image={image03}
                text="Save"
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      )}
      {displayType === "landscape" && (
        <div className={s.windowContentLandscape}>
          <div className={s.modePart}>
            <div>
              <div className={s.nameAndAuth}>
                <div className={s.namePart}>
                  <Logo />
                  <p className={s.name}>SpeakFlow</p>
                </div>
                <AuthInfo />
              </div>
              <div className={s.audioVisualizer}>
                {audioContext &&
                  sourceNodeSpeaker &&
                  activeLine === "speaker" && (
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
            </div>
            <div className={s.settingsWrapper}>
              <SelectLanguagePanel />
              <div className={s.playModeWrapper}>
                <PlayModePanel handleChange={handleActiveBtnChange} />
                <Toggle />
              </div>
              <div className={s.btnWrapper}>
                <Button
                  id="reset-button"
                  btnClass="btnDark"
                  image={image04}
                  text="Clear"
                  onClick={handleClear}
                />
                <Button
                  id="save-button"
                  btnClass="btnDark"
                  image={image03}
                  text="Save"
                  onClick={handleSave}
                />
              </div>
            </div>
          </div>
          <div style={{ width: "800px" }}>
            <TextView />
          </div>
        </div>
      )}
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
