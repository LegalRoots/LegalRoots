import React from "react";
import "./button.css";
const Button = ({ clasName, value, disabled, type = "button" }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clasName ? clasName + " btn" : "btn"}
    >
      {value}
    </button>
  );
};

export default Button;
