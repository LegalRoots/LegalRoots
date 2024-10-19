import React from "react";
import "./Input.css";
const Input = ({
  accept,
  labelClassName,
  id,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  className,
  labelText,
  errors,
  error,
  touched,
}) => {
  return (
    <>
      <label className={labelClassName} htmlFor={id}>
        {labelText}
      </label>
      <div className="inputField">
        {" "}
        <input
          accept={accept}
          value={value}
          onChange={onChange}
          id={id}
          type={type}
          placeholder={placeholder}
          onBlur={onBlur}
          className={className}
        />
        {touched?.[id] && !errors?.[id] && (
          <span className="tick-mark" role="img" aria-label="valid">
            ✔️
          </span>
        )}
      </div>
      {error && <p className="error">{errors[id]}</p>}
    </>
  );
};

export default Input;
