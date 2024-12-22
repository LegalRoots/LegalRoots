import { useEffect, useState } from "react";
import Button from "../../../shared/components/Button2/Button";
import { useFetch } from "../../../shared/hooks/useFetch";
import CaseView from "./caseView/CaseView";
import { useNavigate } from "react-router-dom";
import Overlay from "../../../shared/components/aydi/overlay/Overlay";

import "./CasesItem.css";
import AssignmentPage from "./assignmentPage/AssignmentPage";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CasesItem = ({ pickedCaseId, toggleTableStateHandler }) => {
  const [dataValid, setDataValid] = useState(false);
  const [showAssignmentsPage, setShowAssignmentsPage] = useState(false);
  const [message, setMessage] = useState("loading...");
  const [pickedCase, setPickedCase] = useState(null);
  const navigate = useNavigate();

  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/case/caseId/${pickedCaseId}`
  );

  const assignHandler = () => {
    setShowAssignmentsPage(true);
  };

  const closeOverlayHandler = () => {
    setShowAssignmentsPage(false);
  };

  const detailsHandler = () => {
    navigate();
  };

  useEffect(() => {
    setTimeout(() => {
      if (!dataValid) {
        setMessage("Error occured, please try again");
      }
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isLoading && pickedCaseId) {
      setDataValid(true);
      setPickedCase(data.case);
    }
  }, [pickedCaseId, isLoading, data]);

  return (
    <div className="admin-caseitem-container">
      {dataValid ? (
        <div className="admin-caseitem">
          {showAssignmentsPage && (
            <Overlay closeOverlayHandler={closeOverlayHandler}>
              <AssignmentPage
                closeOverlayHandler={closeOverlayHandler}
                caseId={pickedCaseId}
                pickedCase={pickedCase}
              />
            </Overlay>
          )}
          <CaseView
            pickedCase={pickedCase}
            moveBackHandler={toggleTableStateHandler}
          />
          <div className="admin-caseitem-buttons">
            <Button
              id=""
              color="gold"
              size="2"
              type="button"
              onClick={assignHandler}
              disabled={pickedCase.isAssigned}
            >
              assign
            </Button>
            <Button
              id=""
              color="black"
              size="2"
              type="button"
              onClick={detailsHandler}
              disabled={!pickedCase.isAssigned}
            >
              details
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default CasesItem;
