import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useFetch } from "../../../shared/hooks/useFetch";
import AssignmentsTable from "../../components/assignmentsTable/AssignmentsTable";
import { useState, useEffect } from "react";
import "./Assignments.css";
import AssignmentsReplace from "../../components/assignmentsReplace/AssignmentsReplace";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Assignments = () => {
  const [allAssignements, setAllAssginments] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [AssignmentId, setAssignmentId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [empId, setEmpId] = useState("");
  const [courtId, setCourtId] = useState("");

  const [aData, isADataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/case/assigned`
  );

  useEffect(() => {
    if (!isADataLoading && aData) {
      console.log(aData);
      setAllAssginments(aData.assignedCases);
    }
  }, [aData, isADataLoading]);

  const replaceHandler = (event) => {
    const id = event.target.id;
    setAssignmentId(id);
    //here get the assignmentObject
    let assignment = allAssignements.find((a) => a._id === id);
    console.log(assignment.caseId.court_branch);

    setCaseId(assignment.caseId._id);
    setEmpId(assignment.employeeId._id);
    setCourtId(assignment.caseId.court_branch);

    setShowOverlay(true);
  };
  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };
  return (
    <div className="admin-assignments-container">
      {showOverlay && (
        <Overlay closeOverlayHandler={closeOverlayHandler}>
          <AssignmentsReplace
            closeOverlayHandler={closeOverlayHandler}
            assignmentId={AssignmentId}
            caseId={caseId}
            employeeId={empId}
            courtId={courtId}
          />
        </Overlay>
      )}
      <AssignmentsTable
        replaceHandler={replaceHandler}
        assignedCases={allAssignements}
      />
    </div>
  );
};

export default Assignments;
