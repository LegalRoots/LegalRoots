import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../../../../shared/hooks/useFetch";
import ExtendedCaseView from "../../casesItem/extendedCaseView/ExtendedCaseView";
import EvidencesList from "./evidencesList/EvidencesList";
import CourtsList from "./courtsList/CourtsList";
import JudgesList from "./judgesList/JudgesList";

import "./CaseProfile.css";

const CaseProfile = ({ pickedCase, evidencesList, judgesList }) => {
  const [profilePagesState, setProfilePagesState] = useState(1);

  const changePageHandler = (event) => {
    const id = event.target.id[event.target.id.length - 1];
    if (id === "1") {
      setProfilePagesState(1);
    } else if (id === "2") {
      setProfilePagesState(2);
    } else {
      setProfilePagesState(3);
    }
  };

  return (
    <div className="admin-case-profile-container">
      <ExtendedCaseView pickedCase={pickedCase} hideBackButton={false} />
      <div className="admin-case-profile-buttons ">
        <button
          id="caseBtn1"
          onClick={changePageHandler}
          className={`${profilePagesState === 1 && "selected"}`}
        >
          evidences
        </button>
        <button
          id="caseBtn2"
          onClick={changePageHandler}
          className={`${profilePagesState === 2 && "selected"}`}
        >
          courts
        </button>
        <button
          id="caseBtn3"
          onClick={changePageHandler}
          className={`${profilePagesState === 3 && "selected"}`}
        >
          judges
        </button>
      </div>
      <div className="admin-case-profile-pages">
        {profilePagesState === 1 && evidencesList?.length > 0 ? (
          <EvidencesList evidences={evidencesList} />
        ) : profilePagesState === 2 ? (
          <CourtsList
            caseId={pickedCase._id}
            pickedCase={pickedCase}
            judges={judgesList}
          />
        ) : (
          judgesList && (
            <JudgesList caseId={pickedCase._id} judges={judgesList} />
          )
        )}
      </div>
    </div>
  );
};

export default CaseProfile;
