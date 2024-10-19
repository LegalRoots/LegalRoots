import React from "react";
import "./button.css";
const Button = ({ onClick, clasName, value, disabled, type = "button" }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clasName ? clasName + " btn" : "btn"}
    >
      {value}
    </button>
  );
};

export default Button;
