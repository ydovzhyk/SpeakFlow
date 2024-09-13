import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getActiveBtn,
  getDeepgramStatus,
} from "../../../redux/technical/technical-selectors";

import s from "./Timer.module.scss";

const Timer = () => {
  const activeBtn = useSelector(getActiveBtn);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const [time, setTime] = useState(0);
  const [prevActivBtn, setPrevActiveBtn] = useState(activeBtn);

  useEffect(() => {
    let interval = null;
    if (activeBtn === "play" && deepgramStatus) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setPrevActiveBtn(activeBtn);
    } else if (activeBtn === "play" && prevActivBtn === "stop") {
      setTime(0);
    }

    setPrevActiveBtn(activeBtn);
    return () => clearInterval(interval);
  }, [activeBtn, deepgramStatus, prevActivBtn]);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={s.timerPart}>
      <p className={s.timer}>{formatTime(time)}</p>
    </div>
  );
};

export default Timer;
