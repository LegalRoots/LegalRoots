import useForm from "../../../shared/hooks/useForm";
import Input from "../../../shared/components/FormElements/aydi/Input";
import Button from "../../../shared/components/Button2/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import { useState } from "react";
import Select from "../../../shared/components/FormElements/aydi/select/Select";

const Page2 = ({
  formState,
  inputHandler,
  court_types,
  court_names,
  SelectHandler,
  currentPageHandler,
}) => {
  return (
    <div className="p2">
      <div className="new-judge__input">
        <Select
          label="Court type"
          placeholder="court type"
          id="court_type"
          options={court_types}
          value={formState.inputs["court_type"].value}
          onChange={SelectHandler}
        />
      </div>
      <div className="new-judge__input">
        <Select
          label="Court name"
          placeholder="court name"
          id="court_name"
          options={court_names}
          value={formState.inputs["court_name"].value}
          onChange={SelectHandler}
        />
      </div>
      <Input
        initialValue={formState.inputs["qualifications"].value}
        initialValid={formState.inputs["qualifications"].isValid}
        label="Qualifications"
        id="qualifications"
        name="qualifications"
        onInput={inputHandler}
        type="textarea"
        placeholder="Qualifications"
        className="new-judge__input"
        errorMsg=""
        validators={VALIDATOR_MINLENGTH(8)}
      />
      <Input
        initialValue={formState.inputs["experience"].value}
        initialValid={formState.inputs["experience"].isValid}
        label="Experience"
        id="experience"
        name="experience"
        onInput={inputHandler}
        type="textarea"
        placeholder="experience"
        className="new-judge__input"
        errorMsg=""
        validators={VALIDATOR_MINLENGTH(8)}
      />
      <div className="new-judge__button">
        <Button
          id="page2Btn_backwards"
          color="gold"
          size="2"
          type="button"
          onClick={currentPageHandler}
        >
          back
        </Button>
        <Button
          id="page2Btn_forward"
          color="gold"
          size="2"
          type="button"
          onClick={currentPageHandler}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default Page2;
