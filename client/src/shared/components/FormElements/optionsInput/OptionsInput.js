import "./OptionsInput.css";
import Input from "../aydi/Input";
import { useState } from "react";

const OptionsInput = ({
  setValue,
  onInput,
  validators,
  filteredArray,
  setFieldValue,
  label,
  id,
  name,
  type,
  placeholder,
  errorMsg,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const openDropdownHandler = () => {
    setShowDropdown(true);
  };

  const closeDropdownHandler = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };
  return (
    <div className="options-input">
      <Input
        setValue={setValue}
        label={label}
        onFocus={openDropdownHandler}
        onBlur={closeDropdownHandler}
        id={id}
        name={name}
        onInput={onInput}
        type={type}
        placeholder={placeholder}
        errorMsg={errorMsg}
        validators={validators}
      />
      {showDropdown && (
        <div className="options-input-values">
          {filteredArray.map((type) => (
            <p
              key={type}
              onClick={(event) => {
                setFieldValue(event.currentTarget.innerText);
              }}
            >
              {type}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionsInput;
