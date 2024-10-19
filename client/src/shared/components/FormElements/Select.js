import React from "react";

const Select = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={error && touched ? "input-error" : ""}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && touched && <div className="error">{error}</div>}
  </div>
);

export default Select;
