import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../../../../shared/hooks/useFetch";
import Button from "../../../../../shared/components/Button2/Button";

import "./CourtsList.css";
import NewCourt from "./newCourt/NewCourt";
import Alert from "../../../../../shared/components/aydi/alert/Alert";
import EditCourt from "./editCourt/EditCourt";
import Overlay from "../../../../../shared/components/aydi/overlay/Overlay";
import Input from "../../../../../shared/components/FormElements/aydi/Input";
import { VALIDATOR_MINLENGTH } from "../../../../../shared/util/validators";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourtItem = ({ court, judges, pickedCase, ctx }) => {
  const [courtState, setCourtState] = useState("");
  const [initiator, setInitiator] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showEditingOverlay, setShowEditingOverlay] = useState(false);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (court) {
      if (court.hasStarted && court.hasFinished) {
        setCourtState("Finished");
      } else if (court.hasStarted && !court.hasFinished) {
        setCourtState("Ongoing");
      } else {
        setCourtState("Scheduled");
      }
      let init = judges.find((j) => j._id === court.initiator._id);
      if (init) setInitiator(init);
    }
  }, [court, judges]);

  const cancelCourtHandler = async (event) => {
    const id = event.target.id;

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeAlertHandler = () => {
    setShowAlert(false);
  };
  const closeOverlayHandler = () => {
    setShowEditingOverlay(false);
  };
  const editCourtHandler = (event) => {
    setShowEditingOverlay(true);
  };

  const closeResultOverlayHandler = () => {
    setShowResultOverlay(false);
  };
  const editResultHandler = (event) => {
    setShowResultOverlay(true);
  };

  const inputHandler = useCallback((id, val, isValid) => {
    setResult(val);
    console.log(val);
  }, []);

  const submitResult = async () => {
    console.log(result);
    setShowResultOverlay(false);
  };

  return (
    <div className="admin-caseprofile-courts-item">
      {showResultOverlay && (
        <Overlay
          closeOverlayHandler={closeResultOverlayHandler}
          id="courtResultOverlay"
        >
          <div className="case-profile-result">
            <Input
              // initialValue={formState.inputs["qualifications"].value}
              // initialValid={formState.inputs["qualifications"].isValid}
              label="Result"
              id="result"
              name="result"
              onInput={inputHandler}
              type="textarea"
              placeholder="set the court result"
              className="new-judge__input"
              errorMsg="invalid value"
              validators={VALIDATOR_MINLENGTH(8)}
            />
            <div>
              <Button
                color="black"
                size="2"
                id="subResult"
                onClick={submitResult}
                disabled={result.length < 8}
              >
                submit
              </Button>
            </div>
          </div>
        </Overlay>
      )}
      {showEditingOverlay && pickedCase && (
        <EditCourt
          closeOverlayHandler={closeOverlayHandler}
          pickedCase={pickedCase}
          judges={judges}
          court={court}
        />
      )}
      {showAlert && (
        <Alert closeAlertHandler={closeAlertHandler} title="Deleted a Court">
          Court has been deleted successfully
        </Alert>
      )}
      <p>
        <span>id </span>
        {court._id}
      </p>
      <p>
        <span>scheduled on </span>
        {new Date(court.time).toLocaleString()}
      </p>
      <p>
        <span>state</span>
        {" " + courtState}
      </p>
      <p>
        <span>initiator </span>
        {initiator.first_name +
          " " +
          initiator.last_name +
          ` (judge id: ${initiator.judge_id})`}
      </p>
      <p>
        <span>description </span>
        {court.description}
      </p>
      <div className="admin-caseprofile-courts-item__buttons">
        {!court.hasStarted && ctx.type === "Admin" && pickedCase.isActive && (
          <button onClick={cancelCourtHandler} id={court._id}>
            cancel
          </button>
        )}
        {!court.hasStarted && ctx.type === "Admin" && pickedCase.isActive && (
          <button onClick={editCourtHandler} id={court._id}>
            edit
          </button>
        )}
        {!court.hasStarted && ctx.type === "Admin" && pickedCase.isActive && (
          <button onClick={editResultHandler} id={court._id}>
            result
          </button>
        )}
      </div>
    </div>
  );
};

const CourtsList = ({ caseId, pickedCase, judges, ctx }) => {
  const [courtsList, setCourtsList] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const showOverlayHandler = () => {
    setShowOverlay(true);
  };
  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };

  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court/caseId/${caseId}`
  );

  useEffect(() => {
    if (!isLoading && data) {
      setCourtsList(data.courts);
    }
  }, [data, isLoading]);
  return (
    <div className="admin-caseprofile-courts-container">
      {showOverlay && pickedCase && (
        <NewCourt
          closeOverlayHandler={closeOverlayHandler}
          pickedCase={pickedCase}
          judges={judges}
        />
      )}

      <div className="admin-caseprofile-courts-buttons">
        {ctx.type === "Admin" && pickedCase.isActive && (
          <Button size="1" type="button" onClick={showOverlayHandler}>
            <i className="fa-solid fa-plus"></i> new court
          </Button>
        )}
      </div>
      <div className="admin-caseprofile-courts-list">
        {courtsList.map((court) => (
          <CourtItem
            ctx={ctx}
            court={court}
            key={court._id}
            judges={judges}
            pickedCase={pickedCase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourtsList;
