import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setActiveBtn } from "../../redux/technical/technical-slice";
import {
  getActiveBtn,
  getRecBtn,
} from "../../redux/technical/technical-selectors";
import imageplay01 from "../../images/play_black.png";
import imageplay02 from "../../images/play_white.png";
import imagepause01 from "../../images/paise_black.png";
import imagepause02 from "../../images/paise_white.png";
import imagestop01 from "../../images/stop_black.png";
import imagestop02 from "../../images/stop_white.png";

import s from "./PlayModePanel.module.scss";

const PlayModePanel = ({ handleChange }) => {
  const dispatch = useDispatch();
  const isActiveBtn = useSelector(getActiveBtn);
  const isRecBtn = useSelector(getRecBtn);

  const handleButtonClick = (btnType) => {
    dispatch(setActiveBtn(btnType));
    handleChange(btnType);
  };

  return (
    <div className={s.playMode}>
      <div className={s.playMode__iconWrapper}>
        {!isRecBtn && (
          <img
            src={isActiveBtn === "play" ? imageplay01 : imageplay02}
            alt="play"
            className={s.playMode__icon}
            onClick={() => handleButtonClick("play")}
          />
        )}
        {isRecBtn && (
          <div className={s.recordingButton}>
            <span className={s.recordingText}>REC</span>
          </div>
        )}
      </div>
      <div className={s.playMode__iconWrapper}>
        <img
          src={isActiveBtn === "pause" ? imagepause01 : imagepause02}
          alt="pause"
          className={s.playMode__icon}
          onClick={() => handleButtonClick("pause")}
        />
      </div>
      <div className={s.playMode__iconWrapper}>
        <img
          src={isActiveBtn === "stop" ? imagestop01 : imagestop02}
          alt="stop"
          className={s.playMode__icon}
          onClick={() => handleButtonClick("stop")}
        />
      </div>
    </div>
  );
};

PlayModePanel.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default PlayModePanel;
