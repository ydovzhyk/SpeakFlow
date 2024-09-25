import PropTypes from "prop-types";
import s from "./Button.module.scss";

const Button = ({
  text = "",
  type = "submit",
  btnClass = "btnDark",
  onClick,
  id = "",
  image = null,
}) => {
  return (
    <button id={id} className={s[btnClass]} onClick={onClick} type={type}>
      <div className={s.btnWrapper}>
        {image && <img src={image} alt="icon" className={s.icon} />}
        {text && <p className={s.btnText}>{text}</p>}
      </div>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  btnClass: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
  image: PropTypes.string,
};

export default Button;
