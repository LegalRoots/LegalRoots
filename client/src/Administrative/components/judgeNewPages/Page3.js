import Input from "../../../shared/components/FormElements/aydi/Input";
import Button from "../../../shared/components/Button2/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import { useState } from "react";

const Page3 = ({
  formState,
  inputHandler,
  currentPageHandler,
  fileChangeHandler,
}) => {
  return (
    <div className="p3">
      <div className="new-judge__file">
        <label htmlFor="photo">Photo</label>
        <input
          type="file"
          id="photo"
          name="photo"
          onChange={fileChangeHandler}
          accept=".png , .jpg"
          required
        />
      </div>
      <div className="new-judge__file">
        <label htmlFor="idPhoto">ID Photo</label>
        <input
          type="file"
          id="idPhoto"
          name="idPhoto"
          onChange={fileChangeHandler}
          accept=".png , .jpg"
          // required
        />
      </div>
      <div className="new-judge__file">
        <label htmlFor="ppPhoto">Passport Photo (optional)</label>
        <input
          type="file"
          id="ppPhoto"
          name="ppPhoto"
          onChange={fileChangeHandler}
          accept=".png , .jpg"
        />
      </div>
      <div className="new-judge__button">
        <Button
          id="page3Btn_backwards"
          color="gold"
          size="2"
          type="button"
          onClick={currentPageHandler}
        >
          back
        </Button>
        <Button
          id="page3Btn_forward"
          color="gold"
          size="2"
          type="submit"
          onClick={currentPageHandler}
          disabled={!formState.isValid}
        >
          submit
        </Button>
      </div>
    </div>
  );
};

export default Page3;
