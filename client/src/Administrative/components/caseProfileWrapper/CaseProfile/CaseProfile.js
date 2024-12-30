import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import ExtendedCaseView from "../../casesItem/extendedCaseView/ExtendedCaseView";
import EvidencesList from "./evidencesList/EvidencesList";
import CourtsList from "./courtsList/CourtsList";
import JudgesList from "./judgesList/JudgesList";
import { AuthContext } from "../../../../shared/context/auth";

import "./CaseProfile.css";

const CaseProfile = ({ pickedCase, evidencesList, judgesList }) => {
  const ctx = useContext(AuthContext);
  const [profilePagesState, setProfilePagesState] = useState(1);

  const changePageHandler = (event) => {
    const id = event.target.id[event.target.id.length - 1];
    if (id === "1") {
      setProfilePagesState(1);
    } else if (id === "2") {
      setProfilePagesState(2);
    } else if (id === "3") {
      setProfilePagesState(3);
    } else {
      setProfilePagesState(4);
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
        {ctx.type === "Admin" && (
          <button
            id="caseBtn4"
            onClick={changePageHandler}
            className={`${profilePagesState === 4 && "selected"}`}
          >
            manage
          </button>
        )}
      </div>
      <div className="admin-case-profile-pages">
        {profilePagesState === 1 ? (
          <EvidencesList evidences={evidencesList} />
        ) : profilePagesState === 2 ? (
          <CourtsList
            ctx={ctx}
            caseId={pickedCase._id}
            pickedCase={pickedCase}
            judges={judgesList}
          />
        ) : profilePagesState === 3 ? (
          judgesList && (
            <JudgesList ctx={ctx} caseId={pickedCase._id} judges={judgesList} />
          )
        ) : (
          <div>close the case</div>
        )}
      </div>
    </div>
  );
};

export default CaseProfile;
