import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSocket from "../../useSocket";
import useAudioRecorder from "../../helpers/useAudioRecorder_old";
import AudioVisualizer from "../Shared/AudioVisualizer/AudioVisualizer";
import {
  getTextArray,
  getTextTranslatedArray,
  getActiveBtn,
  getDeepgramStatus,
} from "../../redux/technical/technical-selectors";
import {
  setNotifacation,
  setConfirmation,
  setRecBtn,
  clearTextArray,
} from "../../redux/technical/technical-slice";
import Toggle from "../Shared/Toggle/Toggle";
import PlayModePanel from "../PlayModePanel/PlayModePanel";
import SelectLanguagePanel from "../SelectLanguagePanel/SelectLanguagePanel";
// import Logo from "../Shared/logo/logo";
import Timer from "../Shared/Timer/Timer";
import image01 from "../../images/copy.png";
import image02 from "../../images/paste.png";
import image03 from "../../images/save-new.png";
import image04 from "../../images/clear-new.png";

import s from "./RecordWindow.module.scss";

const RecordWindow = () => {
  const dispatch = useDispatch();
  const activeBtn = useSelector(getActiveBtn);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const { initialize, sendAudio, pause, disconnect } = useSocket();
  const [sourceState, setSourceState] = useState("speaker");
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
      setSourceState(sourceType);
    },
  });

  const textArray = useSelector(getTextArray);
  const textareaRef = useRef(null);
  const [typedText, setTypedText] = useState("");

  const textTranslatedArray = useSelector(getTextTranslatedArray);
  const thirdTextareaRef = useRef(null);
  const [translatedText, setTranslatedText] = useState("");

  const secondTextareaRef = useRef(null);
  const [copiedText, setCopiedText] = useState("");
  const [secondTextareaText, setSecondTextareaText] = useState("");
  const [isOperatonBtnActive, setIsOperatonBtnActive] = useState(false);

  useEffect(() => {
    if (textArray.length === 0) {
      setTypedText("");
      return;
    }
    const oldSentences = textArray.slice(0, textArray.length - 1).join(" ");
    const newSentence = textArray[textArray.length - 1];
    const newSentenceWords = newSentence.split(" ");

    let currentText = oldSentences;

    const addWord = (index) => {
      if (index < newSentenceWords.length) {
        currentText +=
          (currentText.length > 0 ? " " : "") + newSentenceWords[index];
        setTypedText(currentText);
        setTimeout(() => addWord(index + 1), 70);
      }
    };

    setTypedText(oldSentences);
    setTimeout(() => addWord(0), 70);

    return () => {
      clearTimeout();
    };
  }, [textArray]);

  useEffect(() => {
    if (textTranslatedArray.length === 0) {
      setTranslatedText("");
      return;
    }
    const oldSentences = textTranslatedArray
      .slice(0, textTranslatedArray.length - 1)
      .join(" ");
    const newSentence = textTranslatedArray[textTranslatedArray.length - 1];
    const newSentenceWords = newSentence.split(" ");

    let currentText = oldSentences;

    const addWord = (index) => {
      if (index < newSentenceWords.length) {
        currentText +=
          (currentText.length > 0 ? " " : "") + newSentenceWords[index];
        setTranslatedText(currentText);
        setTimeout(() => addWord(index + 1), 70);
      }
    };

    setTranslatedText(oldSentences);
    setTimeout(() => addWord(0), 70);

    return () => {
      clearTimeout();
    };
  }, [textTranslatedArray]);

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

  //прокрутка тексту в textarea до низу
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
    if (thirdTextareaRef.current) {
      thirdTextareaRef.current.scrollTop =
        thirdTextareaRef.current.scrollHeight;
    }
  }, [typedText, translatedText]);

  useEffect(() => {
    const handlePaste = () => {
      setIsOperatonBtnActive(false);
    };
    const secondTextarea = secondTextareaRef.current;
    secondTextarea.addEventListener("paste", handlePaste);
    return () => {
      secondTextarea.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    const handleCopy = () => {
      setIsOperatonBtnActive(true);
    };
    const textarea = textareaRef.current;
    textarea.addEventListener("copy", handleCopy);
    return () => {
      textarea.removeEventListener("copy", handleCopy);
    };
  }, []);

  // useEffect(() => {
  //   if (activeBtn === "play" && !isPaused && !isRecording) {
  //     console.log("В основному спрацбовує в першому play");
  //     initialize();
  //     startRecording();
  //     dispatch(setNotifacation(true));
  //   }
  //   if (activeBtn === "play" && isPaused && isRecording) {
  //     console.log("В основному спрацбовує в другому play");
  //     togglePauseResume();
  //     pause(false);
  //     dispatch(setRecBtn(true));
  //   }
  //   if (activeBtn === "pause" && !isPaused && isRecording) {
  //     togglePauseResume();
  //     pause(true);
  //     dispatch(setRecBtn(false));
  //   }
  //   if (activeBtn === "stop") {
  //     if (deepgramStatus) {
  //       stopRecording();
  //       disconnect();
  //       dispatch(setRecBtn(false));
  //       dispatch(setNotifacation(false));
  //       dispatch(setConfirmation(false));
  //     } else {
  //       return;
  //     }
  //   }
  // }, [
  //   dispatch,
  //   activeBtn,
  //   deepgramStatus,
  //   disconnect,
  //   initialize,
  //   isPaused,
  //   isRecording,
  //   pause,
  //   startRecording,
  //   stopRecording,
  //   togglePauseResume,
  // ]);

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

  const handleTextChange = (value, param) => {
    if (param === "first") {
      setTypedText(value);
    }
    if (param === "third") {
      setTranslatedText(value);
    } else {
      setSecondTextareaText(value);
    }
  };

  const handleOperaton = () => {
    if (!isOperatonBtnActive) {
      const textarea = textareaRef.current;
      const selectedText = textarea.value.substring(
        textarea.selectionStart,
        textarea.selectionEnd
      );
      setCopiedText(selectedText);
      navigator.clipboard.writeText(selectedText); //When copied using the button Copy but pasted through CTRL + V
      setIsOperatonBtnActive(true);
    } else {
      setSecondTextareaText(secondTextareaText + copiedText);
      setIsOperatonBtnActive(false);
    }
  };

  const handleClear = () => {
    setTypedText("");
    setCopiedText("");
    setSecondTextareaText("");
    setIsOperatonBtnActive(false);
    dispatch(clearTextArray());
  };

  return (
    <div className={s.recordWindow}>
      portrait
      <div className={s.wrapper}>
        <div className={s.windowContent}>
          <div className={s.namePart}>
            {/* <img src={logo} alt="Logo" className={s.logo} /> */}
            {/* <Logo /> */}
            <p className={s.name}>SpeakFlow</p>
          </div>
          <div className={s.audioVisualizer}>
            {audioContext && sourceNodeSpeaker && sourceState === "speaker" && (
              <AudioVisualizer
                audioContext={audioContext}
                sourceNode={sourceNodeSpeaker}
              />
            )}
            {audioContext && sourceNodeMic && sourceState === "mic" && (
              <AudioVisualizer
                audioContext={audioContext}
                sourceNode={sourceNodeMic}
              />
            )}
            <div className={s.timer}>
              <Timer />
            </div>
          </div>
          <textarea
            id="transcription-display"
            ref={textareaRef}
            className={s.windowText}
            rows="7"
            placeholder="Get your recorded text here..."
            value={typedText}
            onChange={(e) => handleTextChange(e.target.value, "first")}
          ></textarea>
          <textarea
            id="transcription-transleted-display"
            ref={thirdTextareaRef}
            className={s.windowText}
            rows="7"
            placeholder="Get your translated text here..."
            value={translatedText}
            onChange={(e) => handleTextChange(e.target.value, "third")}
          ></textarea>
          <textarea
            id="copiedText-display"
            ref={secondTextareaRef}
            className={s.windowText}
            rows="5"
            placeholder="Paste your copied text here..."
            value={secondTextareaText}
            onChange={(e) => handleTextChange(e.target.value, "second")}
          ></textarea>
          <div className={s.settingsWrapper}>
            <SelectLanguagePanel />
            <div className={s.btnWrapper}>
              <Toggle data="mic" />
              <PlayModePanel handleChange={handleActiveBtnChange} />
              <Toggle data="portrait" />
            </div>
            <div className={s.btnWrapper}>
              <button
                id="copy-button"
                className={s.btn}
                onClick={handleOperaton}
              >
                <div className={s.btnPart}>
                  <img
                    src={!isOperatonBtnActive ? image01 : image02}
                    alt={!isOperatonBtnActive ? "copy" : "paste"}
                    className={s.icon}
                  />
                  <p className={s.btnText}>
                    {!isOperatonBtnActive ? "Copy text" : "Paste text"}
                  </p>
                </div>
              </button>
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
    </div>
  );
};

export default RecordWindow;
