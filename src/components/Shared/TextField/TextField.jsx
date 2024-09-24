import { forwardRef } from "react";
import PropTypes from "prop-types";
import s from "./TextField.module.scss";

const TextField = forwardRef(
  (
    {
      type,
      name,
      value,
      handleChange,
      placeholder,
      required,
      title,
      className,
      error,
      autoComplete,
    },
    ref
  ) => {
    const labelClass = className ? `${s.label} ${s[className]}` : `${s.label}`;
    const inputClass = className ? `${s.input} ${s[className]}` : `${s.input}`;
    const emptyInputClass = "hasValue";

    return (
      <label className={labelClass}>
        <input
          ref={ref}
          className={`${
            value !== null && value !== ""
              ? `${s.input} ${s[emptyInputClass]}`
              : inputClass
          }`}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          title={title}
          autoComplete={autoComplete}
        />
        {value !== "" && (
          <span className={s.placeholderTop}>{placeholder}</span>
        )}
        {value === "" && (
          <span className={s.placeholderBottom}>{placeholder}</span>
        )}
        {error && <p className={s.error}>{title}</p>}
      </label>
    );
  }
);

TextField.displayName = "TextField";

TextField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  autoComplete: PropTypes.string,
};

export default TextField;
