import PropTypes from "prop-types";
import s from "./Text.module.scss";

const Text = ({ textClass = "standart", text }) => {
  return <p className={s[textClass]}>{text}</p>;
};
Text.propTypes = {
  textClass: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default Text;
