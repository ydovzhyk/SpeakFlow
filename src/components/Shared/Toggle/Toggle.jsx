import { useDispatch, useSelector } from "react-redux";
import { getDisplay } from "../../../redux/technical/technical-selectors";
import { changeDisplay } from "../../../redux/technical/technical-slice";
import image01 from "../../../images/portrait_dark.png";
import image02 from "../../../images/portrait.png";
import image03 from "../../../images/landscape_dark.png";
import image04 from "../../../images/landscape.png";
import s from "./Toggle.module.scss";

const Toggle = () => {
  const display = useSelector(getDisplay);
  const dispatch = useDispatch();

  const handleClick = (displayOrientation) => {
    dispatch(changeDisplay(displayOrientation));
  };

  return (
    <div className={s.toggle}>
      <div
        className={`${s.toggle__left} ${
          display === "portrait" ? s.toggle__active : ""
        }`}
        onClick={() => handleClick("portrait")}
      >
        <img
          src={display === "portrait" ? image01 : image02}
          alt={"display orientation"}
          className={s.toggle__icon}
          style={{ width: "auto", height: "29px" }}
        />
      </div>
      <div
        className={`${s.toggle__right} ${
          display === "portrait" ? "" : s.toggle__active
        }`}
        onClick={() => handleClick("landscape")}
      >
        <img
          src={display === "portrait" ? image04 : image03}
          alt={"display orientation"}
          className={s.toggle__icon}
          style={{ width: "29px", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default Toggle;
