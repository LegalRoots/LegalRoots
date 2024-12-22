import Button from "../../../../../../shared/components/Button2/Button";
import Input from "../../../../../../shared/components/FormElements/aydi/Input";
import Select from "../../../../../../shared/components/FormElements/aydi/select/Select";
import {
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../../../../shared/util/validators";
import OptionsInput from "../../../../../../shared/components/FormElements/optionsInput/OptionsInput";

import { useCallback, useEffect, useState } from "react";

import Alert from "../../../../../../shared/components/aydi/alert/Alert";
import "./CourtForm.css";

const CourtForm = ({
  inputHandler,
  admins,
  submitHandler,
  formState,
  employeesNames,
  selectedEmployeesArray,
  setSelectedEmployeesArray,
  selectedWitnesses,
  setSelectedWitnesses,
}) => {
  const [adminsNames, setAdminsNames] = useState([]);
  const [employeeIdValue, setEmployeeIdValue] = useState();
  const [filteredEmployeesArray, setFilteredEmployeesArray] = useState([]);
  const [addBtnText, setAddBtnText] = useState("add");
  const [witnessValue, setWitnessValue] = useState("");
  const [witBtn, setwitBtn] = useState("add");
  useEffect(() => {
    if (admins) {
      let tmp = admins.map((admin) => {
        return (
          admin.first_name + " " + admin.second_name + " " + admin.last_name
        );
      });
      setAdminsNames(tmp);
    }
  }, [admins]);

  const SelectHandler = (event) => {
    inputHandler(event.target.id, event.target.value, true);
  };
  const dateHandler = useCallback((id, val, isValid) => {
    let valid = false;
    if (new Date(val) > new Date()) {
      valid = true;
    } else {
      valid = false;
    }
    inputHandler(id, val, valid);
  }, []);

  const timeHandler = useCallback((id, val, isValid) => {
    let valid = false;
    if (val < 8 || val > 15) {
      valid = false;
    } else {
      valid = true;
    }
    inputHandler(id, val, valid);
  }, []);

  const timeMHandler = useCallback((id, val, isValid) => {
    let valid = false;

    if (val < 0 || val > 59) {
      valid = false;
    } else {
      valid = true;
    }

    inputHandler(id, val, valid);
  }, []);

  const employeeIdInputHandler = useCallback(
    (id, val, isValid) => {
      let result = employeesNames.filter((emp) => emp.includes(val));
      setFilteredEmployeesArray(result);

      if (selectedEmployeesArray.includes(val)) {
        setAddBtnText("remove");
      } else {
        setAddBtnText("add");
      }
    },
    [employeesNames, selectedEmployeesArray]
  );

  const addEmployeeHandler = () => {
    if (employeesNames.includes(employeeIdValue)) {
      if (selectedEmployeesArray.includes(employeeIdValue)) {
        let tmp = selectedEmployeesArray.filter(
          (emp) => emp !== employeeIdValue
        );
        setSelectedEmployeesArray(tmp);
      } else {
        setSelectedEmployeesArray((pre) => {
          return [...pre, employeeIdValue];
        });
      }
    }
  };

  const witnessValueHandler = useCallback(
    (id, val, isValid) => {
      if (selectedWitnesses.includes(val)) {
        setwitBtn("remove");
      } else {
        setwitBtn("add");
      }
      setWitnessValue(val);
    },
    [selectedWitnesses]
  );

  const addWitnessHandler = () => {
    if (witnessValue.length === 9 && !isNaN(witnessValue)) {
      if (selectedWitnesses.includes(witnessValue)) {
        let tmp = selectedWitnesses.filter((wit) => wit !== witnessValue);
        setSelectedWitnesses(tmp);
      } else {
        setSelectedWitnesses((pre) => {
          return [...pre, witnessValue];
        });
      }
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="date-time-cont">
        <Input
          initialValue={formState.inputs["date"].value}
          initialValid={formState.inputs["date"].isValid}
          label="Date"
          id="date"
          name="date"
          onInput={dateHandler}
          type="Date"
          placeholder="Date"
          errorMsg="invalid date"
        />
        <div>
          <Input
            initialValue={formState.inputs["timeH"].value}
            initialValid={formState.inputs["timeH"].isValid}
            label="Time"
            id="timeH"
            name="timeH"
            onInput={timeHandler}
            type="number"
            placeholder="Hours"
            errorMsg="time must be between 8:00 and 15:59"
          />
          <Input
            initialValue={formState.inputs["timeM"].value}
            initialValid={formState.inputs["timeM"].isValid}
            label="Time"
            id="timeM"
            name="timeM"
            onInput={timeMHandler}
            type="number"
            placeholder="Minutes"
            errorMsg="time must be between 8:00 and 15:59"
          />
        </div>
      </div>
      <Select
        label="Initiator"
        placeholder="initiator"
        id="initiator"
        options={adminsNames}
        value={formState.inputs["initiator"].value}
        onChange={SelectHandler}
      />
      <ul>
        <h2>Judges</h2>
        {adminsNames.map((admin, i) => (
          <li key={i}>{admin}</li>
        ))}
      </ul>
      <div className="options-input-wrapper">
        <OptionsInput
          setValue={employeeIdValue}
          onInput={employeeIdInputHandler}
          validators={VALIDATOR_MINLENGTH(1)}
          filteredArray={filteredEmployeesArray}
          setFieldValue={setEmployeeIdValue}
          label="Employee"
          id="emp"
          name="emp"
          type="text"
          placeholder="employee info"
          errorMsg="invalid value"
        />
        <div>
          <Button
            id="page2Btn_forward"
            color="black"
            size="2"
            type="button"
            onClick={addEmployeeHandler}
          >
            {addBtnText}
          </Button>
        </div>
      </div>
      <ul>
        <h2>Employees</h2>
        {selectedEmployeesArray.map((emp, i) => (
          <li key={i}>{emp}</li>
        ))}
      </ul>
      <div className="options-input-wrapper">
        <Input
          setValue={witnessValue}
          label="Witness ssid"
          id="ssidW"
          name="ssidW"
          onInput={witnessValueHandler}
          type="number"
          placeholder="ssid"
          errorMsg="ssid should include 9 digits"
          validators={VALIDATOR_EQUALLENGTH(9)}
        />
        <div>
          <Button
            id="page2Btn_forward"
            color="black"
            size="2"
            type="button"
            onClick={addWitnessHandler}
          >
            {witBtn}
          </Button>
        </div>
      </div>
      <ul>
        <h2>Witnesses</h2>
        {selectedWitnesses.map((wit, i) => (
          <li key={i}>{wit}</li>
        ))}
      </ul>
      <Input
        initialValue={formState.inputs["description"].value}
        initialValid={formState.inputs["description"].isValid}
        label="Description"
        id="description"
        name="description"
        onInput={inputHandler}
        type="textarea"
        placeholder="description"
        errorMsg="description is required"
        validators={VALIDATOR_MINLENGTH(8)}
      />
      <Button
        id="page2Btn_forward"
        color="gold"
        size="2"
        type="submit"
        disabled={!formState.isValid}
      >
        submit
      </Button>
    </form>
  );
};

export default CourtForm;
