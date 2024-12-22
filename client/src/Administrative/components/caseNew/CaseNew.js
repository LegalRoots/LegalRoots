import "./CaseNew.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../../shared/components/form/Form";
import Input from "../../../shared/components/FormElements/aydi/Input";

import Button from "../../../shared/components/Button2/Button";
import {
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import Select from "../../../shared/components/FormElements/aydi/select/Select";
import useForm from "../../../shared/hooks/useForm";
import { useFetch } from "../../../shared/hooks/useFetch";
import OptionsInput from "../../../shared/components/FormElements/optionsInput/OptionsInput";

let formData = {
  defendant: { value: "", isValid: false },
  plaintiff: { value: "", isValid: false },
  description: { value: "", isValid: false },
  court_branch: { value: "", isValid: false },
  caseType: { value: "", isValid: false },
};

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CaseNew = () => {
  const navigate = useNavigate();
  const [courtBranchValid, setCourtBranchValid] = useState(true);
  const [caseTypeValue, setCaseTypeValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const [courtsArray, setCourtsArray] = useState([]);
  const [typesArray, setTypesArray] = useState([]);
  const [page2Fields, setPage2Fields] = useState([]);
  const [filteredTypesArray, setFilteredTypesArray] = useState([]);
  const [dataFields, setDataFields] = useState(null);

  const [courtData, courtDataIsLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );

  const [typesData, typesDataIsLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/caseType`
  );

  useEffect(() => {
    if (!courtDataIsLoading) {
      let tmpArray = courtData.map((court) => court.name);
      setCourtsArray(tmpArray);
    }
  }, [courtData, courtDataIsLoading]);

  useEffect(() => {
    if (!typesDataIsLoading) {
      let tmpArray = typesData.caseTypes.map((type) => type.name);
      setTypesArray(tmpArray);
    }
  }, [typesData, typesDataIsLoading]);

  const [formState, inputHandler] = useForm(formData, false);

  const SelectHandler = (event) => {
    const id = event.target.id;
    const val = event.target.value;

    //map the name to its _id
    let court = courtData.find((court) => court.name === val);
    setCourtBranchValid(true);
    inputHandler(id, court._id, true);
  };

  const caseTypeInputHandler = useCallback(
    (id, val, isValid) => {
      let tmpArray = typesArray.filter((entry) =>
        entry.toLowerCase().includes(val)
      );
      setFilteredTypesArray(tmpArray);

      inputHandler(id, val, isValid);
    },
    [typesArray]
  );

  const page2InputHandler = useCallback((id, val, isValid) => {
    setDataFields((prev) => {
      prev[id] = val;
      return prev;
    });
  }, []);

  const renderPage2Fields = () => {
    const name = formState.inputs.caseType.value;
    let chosenCaseType = typesData.caseTypes.find((type) => type.name === name);
    if (!chosenCaseType) {
      return 0;
    }
    setPage2Fields(chosenCaseType.fields);
    let namesArray = chosenCaseType.fields.map((field) => field.name);

    let dataObj = {};
    for (let i = 0; i < namesArray.length; i++) {
      const element = namesArray[i];
      dataObj[element] = "";
    }
    setDataFields(dataObj);
    return 1;
  };
  const changePageHandler = (event) => {
    const id = event.target.id;

    if (id === "casePage1Btn") {
      const res = renderPage2Fields();
      if (res === 0) {
        return;
      }
      setPageNumber(2);
    } else {
      setPageNumber(1);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const { caseType, defendant, plaintiff, description, court_branch, data } =
      formState.inputs;

    let chosenCaseType = typesData.caseTypes.find(
      (type) => type.name === caseType.value
    );

    //checking data fields
    for (let index = 0; index < chosenCaseType.fields.length; index++) {
      const field = chosenCaseType.fields[index];
      if (field.required && dataFields[field.name] === "") {
        console.log(`${field.name} is required`);
        return;
      }
    }

    const BODY_DATA = {
      caseType: chosenCaseType._id,
      defendant: defendant.value,
      plaintiff: plaintiff.value,
      description: description.value,
      court_branch: court_branch.value,
      data: dataFields,
    };

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(BODY_DATA),
      });

      const response_data = await response.json();
      if (response.ok === true) {
        navigate("/admin/cases");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form title="Case Registration Form" successMsg="Case added successfully">
      {pageNumber === 1 ? (
        <div className="case-new-p1">
          <div className="admin-custom-form__input">
            <Select
              label="Court Branch"
              placeholder="Court Branch"
              id="court_branch"
              options={courtsArray}
              value={formState.inputs["court_branch"].value}
              onChange={SelectHandler}
            />
          </div>
          <OptionsInput
            setValue={caseTypeValue}
            onInput={caseTypeInputHandler}
            validators={VALIDATOR_MINLENGTH(2)}
            filteredArray={filteredTypesArray}
            setFieldValue={setCaseTypeValue}
            label="Case type"
            id="caseType"
            name="caseType"
            type="text"
            placeholder="enter a valid case type"
            errorMsg="invalid case type"
          />

          <Input
            label="Defendant SSID"
            id="defendant"
            name="defendant"
            onInput={inputHandler}
            type="number"
            placeholder="ssid"
            className="admin-custom-form__input"
            errorMsg="enter ssid of 9 numbers"
            validators={VALIDATOR_EQUALLENGTH(9)}
          />
          <Input
            label="Plaintiff SSID"
            id="plaintiff"
            name="plaintiff"
            onInput={inputHandler}
            type="number"
            placeholder="ssid"
            className="admin-custom-form__input"
            errorMsg="enter ssid of 9 numbers"
            validators={VALIDATOR_EQUALLENGTH(9)}
          />

          <Input
            label="Description"
            id="description"
            name="description"
            onInput={inputHandler}
            type="textarea"
            placeholder="Description"
            className="admin-custom-form__input"
            errorMsg="invalid description"
            validators={VALIDATOR_MINLENGTH(2)}
          />

          <div className="admin-custom-form__button">
            <Button
              id="casePage1Btn"
              color="gold"
              size="2"
              type="button"
              onClick={changePageHandler}
              disabled={!formState.isValid || !courtBranchValid}
            >
              next
            </Button>
          </div>
        </div>
      ) : (
        <div className="case-new-p2">
          {page2Fields.map((field) => (
            <Input
              key={field.id}
              label={field.name.replace("_", " ")}
              id={field.name}
              name={field.name}
              onInput={page2InputHandler}
              type="text"
              placeholder={field.name.replace("_", " ")}
              className="admin-custom-form__input"
              errorMsg="field is required"
              validators={VALIDATOR_MINLENGTH(2)}
            />
          ))}
          <div className="admin-custom-form__button">
            <Button
              id="casePage2Btn"
              color="gold"
              size="2"
              type="button"
              onClick={changePageHandler}
              disabled={!formState.isValid || !courtBranchValid}
            >
              back
            </Button>
            <Button
              id="caseSubmitBtn"
              color="gold"
              size="2"
              type="submit"
              onClick={submitHandler}
              disabled={!formState.isValid || !courtBranchValid}
            >
              submit
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default CaseNew;
