import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  getSaveTextPanelStatus,
  getTextArray,
  getTextTranslatedArray,
  getPopUpWindowStatus,
} from "../../redux/technical/technical-selectors";
import {
  setPopUpWindowStatus,
  setSaveTextPanelStatus,
} from "../../redux/technical/technical-slice";
import { createTextData } from "../../redux/textData/textData-operations";
import Button from "../Shared/Button";
import Popup from "../Shared/Popup/Popup";
import TextField from "../Shared/TextField";
import { fields } from "../Shared/TextField/fields";

import s from "./SaveTextPanel.module.scss";

const SaveTextPanel = () => {
  const dispatch = useDispatch();
  const saveTextPanelStatus = useSelector(getSaveTextPanelStatus);
  const textTranscription = useSelector(getTextArray);
  const textTranslation = useSelector(getTextTranslatedArray);
  const [isOpenPanel, setIsOpenPanel] = useState(false);
  const [transcription, setTranscription] = useState(true);
  const [translation, setTranslation] = useState(true);
  const [isWorning, setIsWorning] = useState(true);
  const isPopupVisible = useSelector(getPopUpWindowStatus);

  useEffect(() => {
    if (saveTextPanelStatus) {
      setIsOpenPanel(true);
    }
  }, [saveTextPanelStatus]);

  useEffect(() => {
    if (
      (textTranscription.length === 0 || textTranslation.length === 0) &&
      saveTextPanelStatus
    ) {
      setIsWorning(true);
      dispatch(setPopUpWindowStatus(true));
    } else {
      setIsWorning(false);
      return;
    }
  }, [textTranscription, textTranslation, saveTextPanelStatus, dispatch]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      topic: "",
    },
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    const userData = {
      transcription: transcription ? textTranscription : [],
      translation: translation ? textTranslation : [],
      topic: data.topic,
      date: new Date(),
    };
    dispatch(createTextData(userData));
    reset();
    dispatch(setSaveTextPanelStatus(false));
  };

  return (
    <div className={s.saveText}>
      <div className={`${s.panel} ${isOpenPanel ? s.open : ""}`}>
        <div className={s.saveText__content}>
          {!isWorning && saveTextPanelStatus && (
            <div className={s.saveText__contentWrapper}>
              <p className={s.saveText__textMain}>
                Choose what needs to be saved:
              </p>
              <label className={s.saveText__text}>
                <input
                  type="checkbox"
                  checked={transcription}
                  onChange={() => setTranscription(!transcription)}
                  style={{
                    marginRight: "10px",
                    display: "inline",
                    accentColor: "var(--accent-color)",
                  }}
                />
                Transcription
              </label>
              <label className={s.saveText__text}>
                <input
                  type="checkbox"
                  checked={translation}
                  onChange={() => setTranslation(!translation)}
                  style={{
                    marginRight: "10px",
                    display: "inline",
                    accentColor: "var(--accent-color)",
                  }}
                />
                Translation
              </label>
              <p className={s.saveText__textMain}>
                Please specify the topic of your recording.
              </p>
              <form
                className={s.saveText__form}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  as={TextField}
                  control={control}
                  name="topic"
                  render={({ field: { onChange, value } }) => (
                    <input
                      className={s.saveText__input}
                      value={value}
                      onChange={onChange}
                      placeholder="Topic"
                      {...fields.topic}
                    />
                  )}
                />
                <div className={s.saveText__wrapBtn}>
                  <Button text="Save" btnClass="btnDark" />
                </div>
              </form>
            </div>
          )}
          {isWorning && saveTextPanelStatus && (
            <Popup
              message="You have no information to save."
              isVisible={isPopupVisible && isWorning ? true : false}
              onClose={() => {
                dispatch(setPopUpWindowStatus(false));
                dispatch(setSaveTextPanelStatus(false));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveTextPanel;
