import { validate } from "../../../util/validators";
import "./Input.css";
import { useReducer, useEffect } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: action.validators
          ? validate(action.val, [action.validators])
          : true,
      };

    case "TOUCH":
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { onInput, id } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  let cinput = (
    <input
      onBlur={touchHandler}
      onChange={changeHandler}
      id={props.id}
      placeholder={props.placeholder}
      type={props.type}
      value={inputState.value}
      name={props.name}
    />
  );
  if (props.type === "textarea") {
    cinput = (
      <textarea
        onBlur={touchHandler}
        onChange={changeHandler}
        id={props.id}
        placeholder={props.placeholder}
        value={inputState.value}
        name={props.name}
        rows={6}
        wrap="soft"
      ></textarea>
    );
  }
  return (
    <div className={`${props.className} aydi-input`}>
      <label htmlFor={props.id}>{props.label}</label>
      {cinput}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorMsg}</p>}
    </div>
  );
};

export default Input;
