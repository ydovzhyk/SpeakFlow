import { useRef, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  getTextArray,
  getTextTranslatedArray,
} from "../../redux/technical/technical-selectors";
import { getDisplay } from "../../redux/technical/technical-selectors";

import s from "./TextView.module.scss";

const TextView = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const textArray = useSelector(getTextArray);
  const displayType = useSelector(getDisplay);
  const textareaRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const animationRef = useRef({
    currentText: "",
    wordQueue: [],
    timeoutId: null,
  });

  const animateText = useCallback(() => {
    if (animationRef.current.wordQueue.length > 0) {
      const nextWord = animationRef.current.wordQueue.shift();
      animationRef.current.currentText +=
        (animationRef.current.currentText.length > 0 ? " " : "") + nextWord;
      setTypedText(animationRef.current.currentText);
      animationRef.current.timeoutId = setTimeout(animateText, 100);
    }
  }, []);

  useEffect(() => {
    const currentTimeoutId = animationRef.current.timeoutId;

    const newSentence = textArray[textArray.length - 1] || "";
    const newWords = newSentence.split(" ");
    animationRef.current.wordQueue.push(...newWords);

    animateText();

    return () => {
      clearTimeout(currentTimeoutId);
    };
  }, [textArray, animateText]);

  const textTranslatedArray = useSelector(getTextTranslatedArray);
  const thirdTextareaRef = useRef(null);
  const [translatedText, setTranslatedText] = useState("");
  const animationTranslatedRef = useRef({
    currentText: "",
    wordQueue: [],
    timeoutId: null,
  });

  const animateTranslatedText = useCallback(() => {
    if (animationTranslatedRef.current.wordQueue.length > 0) {
      const nextWord = animationTranslatedRef.current.wordQueue.shift();
      animationTranslatedRef.current.currentText +=
        (animationTranslatedRef.current.currentText.length > 0 ? " " : "") +
        nextWord;
      setTranslatedText(animationTranslatedRef.current.currentText);
      animationTranslatedRef.current.timeoutId = setTimeout(
        animateTranslatedText,
        100
      );
    }
  }, []);

  useEffect(() => {
    const currentTranslatedTimeoutId = animationTranslatedRef.current.timeoutId;

    const newSentence =
      textTranslatedArray[textTranslatedArray.length - 1] || "";
    const newWords = newSentence.split(" ");
    animationTranslatedRef.current.wordQueue.push(...newWords);

    animateTranslatedText();

    return () => {
      clearTimeout(currentTranslatedTimeoutId);
    };
  }, [textTranslatedArray, animateTranslatedText]);

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

  const handleTextChange = (value, param) => {
    if (param === "first") {
      setTypedText(value);
    }
    if (param === "third") {
      setTranslatedText(value);
    }
  };

  return (
    <div
      className={s.windowTextContainer}
      style={{ flexDirection: displayType === "portrait" ? "column" : "row" }}
    >
      <textarea
        id="transcription-display"
        ref={textareaRef}
        className={s.windowText}
        rows={displayType === "portrait" || isMobile ? "8" : "12"}
        placeholder="Live transcription"
        value={typedText}
        onChange={(e) => handleTextChange(e.target.value, "first")}
      ></textarea>
      <textarea
        id="transcription-transleted-display"
        ref={thirdTextareaRef}
        className={s.windowText}
        rows={displayType === "portrait" || isMobile ? "8" : "12"}
        placeholder="Live translation"
        value={translatedText}
        onChange={(e) => handleTextChange(e.target.value, "third")}
      ></textarea>
    </div>
  );
};

export default TextView;
