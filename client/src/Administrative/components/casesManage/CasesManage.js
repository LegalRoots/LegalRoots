import Card from "../headerCard/Card";
import { useFetch } from "../../../shared/hooks/useFetch";
import "./CasesManage.css";
import { useEffect, useContext, useState } from "react";
import CaseCard from "./caseCard/CaseCard";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CasesManage = () => {
  const empId = "6718f866d1d5da5f7e811982"; //replace with logged in employee from the context
  const [assignments, setAssignments] = useState([]);
  const [cases, setCases] = useState([]);
  const [dataValid, setDataValid] = useState(false);

  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/case/assigned/employeeId/${empId}`
  );

  useEffect(() => {
    if (!isLoading) {
      console.log(data);
      setAssignments(data.assignedCases);
      setDataValid(true);

      let tmpCases = data.assignedCases.map((a) => a.caseId);
      console.log(tmpCases);
      setCases(tmpCases);
    }
  }, [data, isLoading]);
  return (
    <div className="admin-cases-manage">
      <Card header="My Cases">
        <div className="admin-cases-manage-cards">
          {cases.map((c) => (
            <CaseCard pickedCase={c} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CasesManage;
