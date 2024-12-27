import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import CaseProfile from "./CaseProfile/CaseProfile";

import "./CaseProfileWrapper.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CaseProfileWrapper = () => {
  const params = useParams();
  const location = useLocation();
  const [caseId, setCaseId] = useState("");
  const [pickedCase, setPickedCase] = useState(null);
  const [evidences, setEvidences] = useState(null);
  const [judges, setJudges] = useState(null);
  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/case/caseId/${location.state.pickedCase._id}`
  );

  const [evidencesData, isEvidencesLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/evidence/caseId/${location.state.pickedCase._id}`
  );

  const [judgesData, isJudgesDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/case/judges/${location.state.pickedCase._id}`
  );

  useEffect(() => {
    if (!isLoading && data) {
      setPickedCase(data.case);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (!isEvidencesLoading && evidencesData) {
      setEvidences(evidencesData.evidences);
    }
  }, [evidencesData, isEvidencesLoading]);

  useEffect(() => {
    if (!isJudgesDataLoading && judgesData) {
      setJudges(judgesData.judges);
    }
  }, [judgesData, isJudgesDataLoading]);

  useEffect(() => {
    if (params.id.length !== 24) {
    } else {
      setCaseId(params.id);
    }
  }, []);

  return (
    <>
      {caseId !== "" && pickedCase ? (
        <div className="admin-case-profile-wrapper-container">
          <CaseProfile
            pickedCase={pickedCase}
            evidencesList={evidences}
            judgesList={judges}
          />
        </div>
      ) : (
        <div>invalid case id</div>
      )}
    </>
  );
};

export default CaseProfileWrapper;
