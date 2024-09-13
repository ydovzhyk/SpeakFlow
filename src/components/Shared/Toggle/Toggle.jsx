import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  getLine,
  getDisplay,
} from "../../../redux/technical/technical-selectors";
import {
  changeLine,
  changeDisplay,
} from "../../../redux/technical/technical-slice";
import imageMic01 from "../../../images/icons8-microphone-dark.png";
import imageMic02 from "../../../images/icons8-microphone.png";
import imageSp03 from "../../../images/icons8-speaker-dark.png";
import imageMSp04 from "../../../images/icons8-speaker.png";
import imageTr05 from "../../../images/portrait_dark.png";
import imageTr06 from "../../../images/portrait.png";
import imageCl07 from "../../../images/landscape_dark.png";
import imageCl08 from "../../../images/landscape.png";
import s from "./Toggle.module.scss";

const Toggle = ({ data }) => {
  const [status, setStatus] = useState(data === "mic" ? false : true);
  const line = useSelector(getLine);
  const display = useSelector(getDisplay);
  const dispatch = useDispatch();

  const handleClick = (statusData) => {
    setStatus(statusData);
    if (data === "mic") {
      dispatch(changeLine(line === "speaker" ? "microfon" : "speaker"));
    } else {
      dispatch(
        changeDisplay(display === "portrait" ? "landscape" : "portrait")
      );
    }
  };

  const checkPhoto = (part) => {
    if (status && data === "mic") {
      if (part === "one") {
        return imageMic01;
      } else {
        return imageMSp04;
      }
    }
    if (!status && data === "mic") {
      if (part === "one") {
        return imageMic02;
      } else {
        return imageSp03;
      }
    }
    if (status && data === "portrait") {
      if (part === "one") {
        return imageTr05;
      } else {
        return imageCl08;
      }
    }
    if (!status && data === "portrait") {
      if (part === "one") {
        return imageTr06;
      } else {
        return imageCl07;
      }
    }
  };

  return (
    <div className={s.toggle}>
      <div
        className={`${s.toggle__left} ${status ? s.toggle__active : ""}`}
        onClick={() => handleClick(true)}
      >
        <img
          src={checkPhoto("one")}
          alt={data === "mic" ? "input resource" : "display orientation"}
          className={s.toggle__icon}
        />
      </div>
      <div
        className={`${s.toggle__right} ${status ? "" : s.toggle__active}`}
        onClick={() => handleClick(false)}
      >
        <img
          src={checkPhoto("two")}
          alt={data === "mic" ? "input resource" : "display orientation"}
          className={s.toggle__icon}
        />
      </div>
    </div>
  );
};

Toggle.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Toggle;
