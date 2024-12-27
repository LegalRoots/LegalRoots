import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useState, useEffect, useCallback, act } from "react";

import "./CourtBranch.css";
import CourtBranchesTable from "../../components/courtBranchesTable/CourtBranchesTable";
import Input from "../../../shared/components/FormElements/aydi/Input";

import Button from "../../../shared/components/Button2/Button";
import Alert from "../../../shared/components/aydi/alert/Alert";
import {
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import useForm from "../../../shared/hooks/useForm";

const formData = {
  courtName: { value: "", isValid: false },
  admin: { value: "", isValid: false },
  city: { value: "", isValid: false },
};

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourtBranch = () => {
  const [allCourts, setAllCourts] = useState([]);
  const [courtId, setCourtId] = useState(null);
  const [actionState, setActionState] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const [aData, isADataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );

  useEffect(() => {
    if (!isADataLoading && aData) {
      setAllCourts(aData);
    }
  }, [aData, isADataLoading]);

  const newHandler = () => {
    setShowOverlay(true);
    const currentFormData = {
      courtName: { value: "", isValid: false },
      admin: { value: "", isValid: false },
      city: { value: "", isValid: false },
    };
    setFormData(currentFormData, false);
    setActionState("new");
  };

  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    const FORM_DATA = {
      name: formState.inputs.courtName.value,
      city: formState.inputs.city.value,
      admin: formState.inputs.admin.value,
    };

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court-branch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FORM_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        console.log(response_data);
        setShowOverlay(false);
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitUpdateHandler = async (event) => {
    event.preventDefault();

    const FORM_DATA = {
      name: formState.inputs.courtName.value,
      city: formState.inputs.city.value,
      admin: formState.inputs.admin.value,
    };

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court-branch/${courtId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FORM_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        setShowOverlay(false);
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateHandler = (event) => {
    const id = event.target.id;
    setCourtId(id);
    setActionState("update");

    const c = allCourts.find((court) => court._id === id);

    const currentFormData = {
      courtName: { value: c.name, isValid: true },
      admin: { value: c.admin.employee_id, isValid: true },
      city: { value: c.city, isValid: true },
    };
    setFormData(currentFormData, true);
    setShowOverlay(true);
  };

  const [formState, inputHandler, setFormData] = useForm(formData, false);

  const closeAlertHandler = () => {
    setShowAlert(false);
  };

  return (
    <div className="admin-assignments-container">
      {showAlert && (
        <Alert title="Success" closeAlertHandler={closeAlertHandler}>
          changes have been applied susccessfully
        </Alert>
      )}
      {showOverlay && (
        <Overlay
          id="adminAssignmentsOverlay"
          closeOverlayHandler={closeOverlayHandler}
        >
          <form className="admin-assignments-form">
            {actionState === "new" ? <h2>New Court</h2> : <h2>Update Court</h2>}
            <Input
              initialValue={formState.inputs["courtName"].value}
              initialValid={formState.inputs["courtName"].isValid}
              label="court name"
              id="courtName"
              name="courtName"
              onInput={inputHandler}
              type="text"
              placeholder="court name"
              className="admin-custom-form__input"
              errorMsg="invalid court name"
              validators={VALIDATOR_MINLENGTH(2)}
            />
            <Input
              initialValue={formState.inputs["city"].value}
              initialValid={formState.inputs["city"].isValid}
              label="City"
              id="city"
              name="city"
              onInput={inputHandler}
              type="text"
              placeholder="city"
              className="admin-custom-form__input"
              errorMsg="invalid city"
              validators={VALIDATOR_MINLENGTH(2)}
            />
            <Input
              initialValue={formState.inputs["admin"].value}
              initialValid={formState.inputs["admin"].isValid}
              label="Admin employee id"
              id="admin"
              name="admin"
              onInput={inputHandler}
              type="text"
              placeholder="admin employee id"
              className="admin-custom-form__input"
              errorMsg="invalid id"
              validators={VALIDATOR_MINLENGTH(1)}
            />
            {actionState === "new" ? (
              <Button
                color="black"
                size="2"
                type="submit"
                onClick={submitFormHandler}
                disabled={!formState.isValid}
              >
                submit
              </Button>
            ) : (
              <Button
                color="black"
                size="2"
                type="submit"
                onClick={submitUpdateHandler}
                disabled={!formState.isValid}
              >
                update
              </Button>
            )}
          </form>
        </Overlay>
      )}

      <CourtBranchesTable
        newHandler={newHandler}
        updateHandler={updateHandler}
        courts={allCourts}
      />
    </div>
  );
};

export default CourtBranch;
