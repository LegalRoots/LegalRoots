import Overlay from "../../../../../../shared/components/aydi/overlay/Overlay";
import CourtForm from "../courtForm/CourtForm";

import Button from "../../../../../../shared/components/Button2/Button";
import Input from "../../../../../../shared/components/FormElements/aydi/Input";
import useForm from "../../../../../../shared/hooks/useForm";
import { VALIDATOR_MINLENGTH } from "../../../../../../shared/util/validators";
import { useCallback, useEffect, useState } from "react";

import Alert from "../../../../../../shared/components/aydi/alert/Alert";
import { useFetch } from "../../../../../../shared/hooks/useFetch";
import "./NewCourt.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const NewCourt = ({
  pickedCase,
  closeOverlayHandler,
  addCourtHandler,
  judges,
}) => {
  const [employeesData, isEmployeesDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/employees/court/id/${String(
      pickedCase.court_branch._id
    )}`
  );
  const [guests, setGuests] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [employeesNames, setEmployeesNames] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const [selectedEmployeesArray, setSelectedEmployeesArray] = useState([]);
  useEffect(() => {
    console.log(pickedCase);
    console.log(employeesData);

    if (!isEmployeesDataLoading && employeesData) {
      let tmp = employeesData.map((employee) => {
        return `${employee.data.full_name} - (${employee.data.employee_id})`;
      });
      setEmployeesNames(tmp);
      setEmployees(employeesData.employees);
    }
  }, [employeesData, isEmployeesDataLoading]);

  const formData = {
    date: { value: "", isValid: false },
    timeH: { value: "", isValid: false },
    timeM: { value: "", isValid: false },
    initiator: { value: "", isValid: false },
    description: { value: "", isValid: false },
    caseId: { value: pickedCase._id, isValid: true },
  };
  const [formState, inputHandler, setFormData] = useForm(formData, false);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    if (pickedCase && judges) {
      setAdmins(judges);
    } else {
      closeOverlayHandler();
    }
  }, [pickedCase, judges]);

  const fetchEmployeesSSIDs = () => {
    let emps = selectedEmployeesArray.map((emp) => {
      let f = emp.split("-")[1].trim();
      f = f.slice(1, f.length - 1);
      return f;
    });

    let finalEmployees = employees
      .filter((emp) => emps.includes(emp.employee_id))
      .map((emp) => emp.ssid);

    return finalEmployees;
  };

  const addGeust = (ssid, role) => {
    if (guests.includes(ssid)) {
      return;
    }
    //add to guests
    setGuests((pre) => {
      return [...pre, ssid];
    });

    //add to permissions array
    setPermissions((pre) => {
      let obj = { userId: ssid, role: role, permissions: ["camera", "mic"] };
      return [...pre, obj];
    });
  };

  const managePrermissions = () => {
    const finalEmployees = fetchEmployeesSSIDs();
    //add employees
    for (let i = 0; i < finalEmployees.length; i++) {
      const element = finalEmployees[i];
      addGeust(element, "employee");
    }
    //add plaintiff and defendant
    addGeust(pickedCase.plaintiff, "user");
    addGeust(pickedCase.defendant, "user");
    //add lawyers
    for (let i = 0; i < pickedCase.plaintiff_lawyers.length; i++) {
      const element = pickedCase.plaintiff_lawyers[i];
      addGeust(element, "lawyer");
    }
    for (let i = 0; i < pickedCase.defendant_lawyers.length; i++) {
      const element = pickedCase.defendant_lawyers[i];
      addGeust(element, "lawyer");
    }
    //add witnesses
    for (let i = 0; i < selectedWitnesses.length; i++) {
      const element = selectedWitnesses[i];
      addGeust(element, "user");
    }

    console.log(permissions);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    managePrermissions();
    let time = new Date(
      `${formState.inputs.date.value} ${formState.inputs.timeH.value}:${formState.inputs.timeM.value}`
    );

    const BODY_DATA = {
      caseId: formState.inputs.caseId.value,
      time: time,
      initiator: formState.inputs.initiator.value,
      description: formState.inputs.description.value,
      permissions: permissions,
      guests,
      admins: judges.map((j) => j.ssid),
    };

    //modify the initiator value
    if (BODY_DATA.initiator === "") {
      BODY_DATA.initiator = judges[0]._id;
    } else {
      let tmp = judges.find((j) => {
        let name = j.first_name + " " + j.second_name + " " + j.last_name;
        return name === BODY_DATA.initiator;
      });
      BODY_DATA.initiator = tmp._id;
    }

    console.log(BODY_DATA);

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(BODY_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Overlay
      closeOverlayHandler={closeOverlayHandler}
      id="adminCourtslistOverlay"
    >
      <div className="admin-caseprofile-courtslist-form">
        <CourtForm
          submitHandler={submitHandler}
          inputHandler={inputHandler}
          admins={admins}
          formState={formState}
          employeesNames={employeesNames}
          selectedEmployeesArray={selectedEmployeesArray}
          setSelectedEmployeesArray={setSelectedEmployeesArray}
          selectedWitnesses={selectedWitnesses}
          setSelectedWitnesses={setSelectedWitnesses}
        />
      </div>
    </Overlay>
  );
};

export default NewCourt;
