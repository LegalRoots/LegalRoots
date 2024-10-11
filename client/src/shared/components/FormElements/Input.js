import React from "react";
import "./Input.css";
const Input = ({
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
}) => {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      <input
        value={value}
        onChange={onChange}
        id={id}
        type={type}
        placeholder={placeholder}
        onBlur={onBlur}
        className={className}
      />
      {error && <p className="error">{errors[type]}</p>}
    </>
  );
};

export default Input;
