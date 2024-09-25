import { useEffect } from "react";
import PropTypes from "prop-types";
import image from "../../../images/info.png";
import s from "./Popup.module.scss";

const Popup = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div className={`${s.popup} ${isVisible ? s.show : ""}`}>
      <div className={s.infoWrapper}>
        <div className={s.iconWrapper}>
          <img src={image} alt={"info"} className={s.icon} />
        </div>
        <p className={s.infoText}>{message}</p>
      </div>
    </div>
  );
};

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Popup;
