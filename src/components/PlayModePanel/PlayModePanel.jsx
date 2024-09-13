import { useDispatch, useSelector } from "react-redux";
import { setActiveBtn } from "../../redux/technical/technical-slice";
import {
  getActiveBtn,
  getRecBtn,
} from "../../redux/technical/technical-selectors";
import imageplay01 from "../../images/icons8-play-black.png";
import imageplay02 from "../../images/icons8-play.png";
import imagepause01 from "../../images/icons8-pause-black.png";
import imagepause02 from "../../images/icons8-pause.png";
import imagestop01 from "../../images/icons8-stop-black.png";
import imagestop02 from "../../images/icons8-stop-squared.png";

import s from "./PlayModePanel.module.scss";

const PlayModePanel = () => {
  const dispatch = useDispatch();
  const isActiveBtn = useSelector(getActiveBtn);
  const isRecBtn = useSelector(getRecBtn);

  return (
    <div className={s.playMode}>
      <div
        className={s.playMode__iconWrapper}
        style={{
          backgroundColor:
            isActiveBtn === "play" && !isRecBtn ? "white" : "#2a2f55",
          padding: isActiveBtn === "play" && !isRecBtn ? "5px" : "0px",
          borderColor:
            isActiveBtn === "play" && !isRecBtn ? "white" : "#2a2f55",
        }}
      >
        {!isRecBtn && (
          <img
            src={isActiveBtn === "play" ? imageplay01 : imageplay02}
            alt="play"
            className={s.playMode__icon}
            style={{
              width: isActiveBtn === "play" ? "25px" : "35px",
              height: isActiveBtn === "play" ? "25px" : "35px",
            }}
            onClick={() => dispatch(setActiveBtn("play"))}
          />
        )}
        {isRecBtn && (
          <div className={s.recordingButton}>
            <span className={s.recordingText}>REC</span>
          </div>
        )}
      </div>
      <div
        className={s.playMode__iconWrapper}
        style={{
          backgroundColor: isActiveBtn === "pause" ? "white" : "#2a2f55",
          padding: isActiveBtn === "pause" ? "5px" : "0px",
          borderColor: isActiveBtn === "pause" ? "white" : "#2a2f55",
        }}
      >
        <img
          src={isActiveBtn === "pause" ? imagepause01 : imagepause02}
          alt="pause"
          className={s.playMode__icon}
          style={{
            width: isActiveBtn === "pause" ? "25px" : "35px",
            height: isActiveBtn === "pause" ? "25px" : "35px",
          }}
          onClick={() => dispatch(setActiveBtn("pause"))}
        />
      </div>
      <div
        className={s.playMode__iconWrapper}
        style={{
          backgroundColor: isActiveBtn === "stop" ? "white" : "#2a2f55",
          padding: isActiveBtn === "stop" ? "5px" : "0px",
          borderColor: isActiveBtn === "stop" ? "white" : "#2a2f55",
        }}
      >
        <img
          src={isActiveBtn === "stop" ? imagestop01 : imagestop02}
          alt="stop"
          className={s.playMode__icon}
          style={{
            width: isActiveBtn === "stop" ? "25px" : "35px",
            height: isActiveBtn === "stop" ? "25px" : "35px",
          }}
          onClick={() => dispatch(setActiveBtn("stop"))}
        />
      </div>
    </div>
  );
};

export default PlayModePanel;
