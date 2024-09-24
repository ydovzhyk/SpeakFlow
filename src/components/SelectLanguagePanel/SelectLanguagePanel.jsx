import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInputLanguage,
  setTargetLanguage,
} from "../../redux/technical/technical-slice";
import {
  getInputLanguage,
  getTargetLanguage,
} from "../../redux/technical/technical-selectors";
// import input from "../../images/input.png";
// import output from "../../images/output.png";

import s from "./SelectLanguagePanel.module.scss";

const SelectLanguagePanel = () => {
  const languages = {
    Bulgarian: "bg",
    English: "en",
    Catalan: "ca",
    Chinese_Simplified: "zh",
    Chinese_Traditional: "zh-TW",
    Czech: "cs",
    Danish: "da",
    Dutch: "nl",
    Estonian: "et",
    Finnish: "fi",
    Flemish: "nl-BE",
    French: "fr",
    German: "de",
    Greek: "el",
    Hindi: "hi",
    Hungarian: "hu",
    Indonesian: "id",
    Italian: "it",
    Japanese: "ja",
    Korean: "ko",
    Latvian: "lv",
    Lithuanian: "lt",
    Malay: "ms",
    Multilingual: "multi",
    Norwegian: "no",
    Polish: "pl",
    Portuguese: "pt",
    Romanian: "ro",
    Russian: "ru",
    Slovak: "sk",
    Spanish: "es",
    Swedish: "sv",
    Thai: "th",
    Turkish: "tr",
    Ukrainian: "uk",
    Vietnamese: "vi",
  };

  const dispatch = useDispatch();
  const inputLanguageCode = useSelector(getInputLanguage);
  const outputLanguage = useSelector(getTargetLanguage);
  const [languageInput, setLanguageInput] = useState(inputLanguageCode);
  const [languageOutput, setLanguageOutput] = useState(outputLanguage);

  useEffect(() => {
    setLanguageInput(inputLanguageCode);
  }, [inputLanguageCode]);

  useEffect(() => {
    setLanguageOutput(outputLanguage);
  }, [outputLanguage]);

  const handleSelectChange = (event, type) => {
    if (type === "input") {
      const selectedLangCode = event.target.value;
      dispatch(setInputLanguage(selectedLangCode));
    } else {
      const selectedLang = event.target.value;
      dispatch(setTargetLanguage(selectedLang));
    }
  };

  return (
    <div className={s.languagePanel}>
      <label className={s.label}>
        <p className={s.languagePanelName}>input</p>
        <select
          className={s.select}
          value={languageInput}
          onChange={(e) => handleSelectChange(e, "input")}
        >
          {Object.entries(languages).map(([language, code]) => (
            <option key={code} value={code}>
              {language}
            </option>
          ))}
        </select>
      </label>
      <label className={s.label}>
        <p className={s.languagePanelName}>output</p>
        <select
          className={s.select}
          value={languageOutput}
          onChange={(e) => handleSelectChange(e, "output")}
        >
          {Object.entries(languages).map(([language]) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SelectLanguagePanel;
