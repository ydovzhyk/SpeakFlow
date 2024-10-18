import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import PropTypes from "prop-types";
import {
  setActiveBtn,
  setOpenBtn,
  changeDisplay,
} from "../../redux/technical/technical-slice";
import {
  getActiveBtn,
  getRecBtn,
  getOpenBtn,
  getDisplay,
} from "../../redux/technical/technical-selectors";
import { getLogin } from "../../redux/auth/auth-selectors";
import imageplay01 from "../../images/play_dark.png";
import imageplay02 from "../../images/play_white.png";
import imagepause01 from "../../images/pause_dark.png";
import imagepause02 from "../../images/pause_white.png";
import imagestop01 from "../../images/stop_dark.png";
import imagestop02 from "../../images/stop_white.png";
import imageopen01 from "../../images/open_black.png";
import imageopen02 from "../../images/open_white.png";
import imagerec01 from "../../images/rec_dark.png";
import imagerec02 from "../../images/rec_white.png";
import imagerotate01 from "../../images/rotate_dark.png";
import imagerotate02 from "../../images/rotate_white.png";

import s from "./PlayModePanel.module.scss";

const PlayModePanel = ({ handleChange }) => {
  const dispatch = useDispatch();
  const isDesctop = useMediaQuery({ minWidth: 1280 });
  const isLogin = useSelector(getLogin);
  const isActiveBtn = useSelector(getActiveBtn);
  const isOpenBtn = useSelector(getOpenBtn);
  const isRecBtn = useSelector(getRecBtn);
  const [showFirstImage, setShowFirstImage] = useState(true);
  const [recordingActive, setRecordingActive] = useState(false);
  const display = useSelector(getDisplay);

  useEffect(() => {
    if (isRecBtn) {
      setRecordingActive(true);
    } else {
      setRecordingActive(false);
      setShowFirstImage(true);
    }
  }, [isRecBtn]);

  useEffect(() => {
    if (!recordingActive) return;

    const timer = setTimeout(() => {
      setShowFirstImage((prev) => !prev);
    }, 1.5 * 1000);

    return () => clearTimeout(timer);
  }, [recordingActive, showFirstImage]);

  const handleButtonClick = (btnType) => {
    if (btnType === "open") {
      dispatch(setOpenBtn(!isOpenBtn));
    }
    if (btnType === "rotate") {
      if (display === "portrait") {
        dispatch(changeDisplay("landscape"));
      } else {
        dispatch(changeDisplay("portrait"));
      }
    } else {
      dispatch(setActiveBtn(btnType));
      handleChange(btnType);
    }
  };

  return (
    <div
      className={s.playMode}
      style={{
        alignItems: isDesctop ? "left" : "center",
        justifyContent: isDesctop ? "space-between" : "center",
      }}
    >
      <div className={s.playMode__container}>
        <div className={s.playMode__iconWrapper}>
          {!isRecBtn && (
            <img
              src={isActiveBtn === "play" ? imageplay01 : imageplay02}
              alt="play"
              style={{ width: "auto", height: "27px" }}
              onClick={() => handleButtonClick("play")}
            />
          )}
          {isRecBtn && (
            <div className={s.recBtnWrapper}>
              <img
                src={imagerec02}
                alt="recording"
                className={`${s.playMode__icon} ${
                  showFirstImage ? s.show : ""
                }`}
                style={{ width: "auto", height: "27px" }}
              />
              <img
                src={imagerec01}
                alt="recording"
                className={`${s.playMode__icon} ${
                  !showFirstImage ? s.show : ""
                }`}
                style={{ width: "auto", height: "27px" }}
              />
            </div>
          )}
        </div>
        <div className={s.playMode__iconWrapper}>
          <img
            src={isActiveBtn === "pause" ? imagepause01 : imagepause02}
            alt="pause"
            style={{ width: "auto", height: "27px" }}
            onClick={() => handleButtonClick("pause")}
          />
        </div>
        <div className={s.playMode__iconWrapper}>
          <img
            src={isActiveBtn === "stop" ? imagestop01 : imagestop02}
            alt="stop"
            style={{ width: "auto", height: "27px" }}
            onClick={() => handleButtonClick("stop")}
          />
        </div>
        {isLogin && (
          <div className={s.playMode__iconWrapper}>
            <img
              src={isOpenBtn ? imageopen01 : imageopen02}
              alt="open"
              style={{ width: "auto", height: "27px" }}
              onClick={() => handleButtonClick("open")}
            />
          </div>
        )}
      </div>
      {isDesctop && (
        <div className={s.playMode__iconWrapper}>
          <img
            src={display === "portrait" ? imagerotate02 : imagerotate01}
            alt="pause"
            style={{ width: "auto", height: "27px" }}
            onClick={() => handleButtonClick("rotate")}
          />
        </div>
      )}
    </div>
  );
};

PlayModePanel.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default PlayModePanel;
