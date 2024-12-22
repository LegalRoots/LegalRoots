import useForm from "../../../shared/hooks/useForm";
import Input from "../../../shared/components/FormElements/aydi/Input";
import Button from "../../../shared/components/Button2/Button";
import { VALIDATOR_MINLENGTH } from "../../../shared/util/validators";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Alert from "../../../shared/components/aydi/alert/Alert";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GENERAL_FIELDS = [
  { required: true, name: "judges" },
  { required: true, name: "courts" },
  { required: true, name: "witnesses" },
  { required: true, name: "evidences" },
  { required: true, name: "plantiff" },
  { required: true, name: "defendent" },
  { required: true, name: "plantiff lawyers" },
  { required: true, name: "court's branch" },
];

const Field = ({ id, text, deleteFieldHandler, required }) => {
  const [showDelete, setShowDelete] = useState(true);
  useEffect(() => {
    GENERAL_FIELDS.forEach((field) => {
      if (field.name === id) {
        setShowDelete(false);
      }
    });
  }, [id]);

  return (
    <div className="casesStructureNew-field">
      <div>
        {required && <span>*</span>}
        <p>{text}</p>
      </div>
      {showDelete === true ? (
        <div
          id={id}
          onClick={deleteFieldHandler}
          className="casesStructureNew-field-normal"
        >
          <i className="fa-solid fa-minus"></i>
        </div>
      ) : (
        <div id={id} className="casesStructureNew-field-common">
          <i class="fa-solid fa-check-double"></i>
        </div>
      )}
    </div>
  );
};

const CasesStructureUpdate = () => {
  const formData = {
    fieldName: { value: "", isValid: true },
  };
  const location = useLocation();

  const [value, setValue] = useState("");
  const [caseName, setCaseName] = useState("");

  const [fields, setFields] = useState([]);
  const [fullFields, setFullFields] = useState([]);

  const [showAlert, setShowAlert] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(formData, false);
  const [caseTypeId, setCaseTypeId] = useState("");
  useEffect(() => {
    setFullFields(GENERAL_FIELDS.concat(fields));
  }, [fields]);

  const fetchData = async (id) => {
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/caseType/${id}`
      );

      const response_data = await response.json();

      if (response.ok === true) {
        let tmp = response_data.caseType.fields.map((f) => {
          return { name: f.name, required: f.required };
        });
        setFields(tmp);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCaseTypeId(location.state.caseTypeId);
    fetchData(location.state.caseTypeId);
  }, [location]);

  const submitHandler = () => {
    let name = value;
    let req = false;

    if (name[0] === "*") {
      req = true;
      name = name.slice(1);
    }

    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];

      if (element.name === name) {
        return;
      }
    }

    setFields((fields) => {
      return [...fields, { required: req, name: name.toLowerCase() }];
    });

    //empty the textfield
    setFormData(formData, false);
    setValue("");
  };

  const deleteFieldHandler = (event) => {
    let f = fields.filter((field) => field.name !== event.currentTarget.id);
    setFields(f);
  };

  const inputHandlerMediator = useCallback((id, value, isValid) => {
    inputHandler(id, value, isValid);
    setValue(value);
  }, []);

  const nameHandlerMediator = useCallback((id, value, isValid) => {
    setCaseName(value);
  }, []);

  const addCaseType = async (event) => {
    event.preventDefault();
    let data = [];

    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];

      data.push({ ...element, type: "String" });
    }

    const BODY_DATA = { fields: data };

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/caseType/${caseTypeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(BODY_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        console.log(response_data);
        setCaseName("");
        setFields([]);
        setValue("");
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeAlertHandler = () => {
    setShowAlert(false);
  };

  return (
    <div className="casesStructureNew-container">
      {showAlert && (
        <Alert
          closeAlertHandler={closeAlertHandler}
          title="Updated successfully"
        >
          case type has been updated successfully
        </Alert>
      )}
      <form>
        <div></div>
        <Input
          setValue={value}
          label="Field Name"
          id="fieldName"
          name="fieldName"
          onInput={inputHandlerMediator}
          type="textarea"
          placeholder="Enter a valid field name"
          className="new-judge__input"
          errorMsg="please provide a valid name"
          validators={VALIDATOR_MINLENGTH(2)}
        />
        <div>
          <Button
            id="page3Btn_forward"
            color="gold"
            size="2"
            type="button"
            onClick={submitHandler}
            disabled={!formState.isValid}
          >
            add field
          </Button>
          <Button
            id="page3Btn_forward"
            color="gold"
            size="2"
            type="submit"
            onClick={addCaseType}
          >
            submit
          </Button>
        </div>
      </form>
      <div className="casesStructureNew-container-fields">
        <header>
          <h2>Case Fields</h2>
        </header>
        <div>
          {fullFields.map((field) => (
            <Field
              deleteFieldHandler={deleteFieldHandler}
              key={field.name}
              id={field.name}
              text={field.name}
              required={field.required}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CasesStructureUpdate;
