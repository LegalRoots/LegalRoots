import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import ExtendedCaseView from "../../casesItem/extendedCaseView/ExtendedCaseView";
import EvidencesList from "./evidencesList/EvidencesList";
import CourtsList from "./courtsList/CourtsList";
import JudgesList from "./judgesList/JudgesList";
import { AuthContext } from "../../../../shared/context/auth";

import "./CaseProfile.css";
import Button from "../../../../shared/components/Button2/Button";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

  const formSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("caseForm"));
    console.log(formData.get("result"));
    const FORM_DATA = { result: formData.get("result") };

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/close/${pickedCase._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FORM_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        console.log(response_data);
      }
    } catch (error) {
      console.error(error);
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
            <JudgesList
              ctx={ctx}
              pickedCase={pickedCase}
              caseId={pickedCase._id}
              judges={judgesList}
            />
          )
        ) : (
          <form
            className="case-profile-manage"
            id="caseForm"
            onSubmit={formSubmit}
          >
            {!pickedCase.isClosed ? (
              <>
                <div className="case-profile-manage__radio">
                  <div>
                    <input
                      type="radio"
                      name="result"
                      id="resultT"
                      value="accepted"
                    />
                    <label htmlFor="resultT">Case accepted</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="result"
                      id="resultF"
                      value="denied"
                    />
                    <label htmlFor="resultF">Case Denied</label>
                  </div>
                </div>
                <Button type="submit" color="black" size="2" id="caseClose">
                  Close case
                </Button>
              </>
            ) : (
              <div>case is closed</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CaseProfile;
