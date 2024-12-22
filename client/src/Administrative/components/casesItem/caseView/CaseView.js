import { useEffect, useState } from "react";
import "./CaseView.css";

const Item = ({ text, title }) => {
  return (
    <div className="caseview-container-item">
      {title && <p className="caseview-container-item__title">{title}</p>}
      <p className="caseview-container-item__text">{text}</p>
    </div>
  );
};

const CaseView = ({ pickedCase, moveBackHandler, hideBackButton = true }) => {
  const [caseState, setCaseState] = useState("");
  const [caseStateId, setCaseStateId] = useState(0);
  const [plaintiffLawyers, setPlaintiffLawyers] = useState("");
  const [defendantLawyers, setDefendantLawyers] = useState("");

  useEffect(() => {
    if (pickedCase) {
      const tmp = pickedCase.isClosed
        ? "Colsed"
        : pickedCase.isActive
        ? "Ongoing"
        : "Not Assigned";

      const tmpId = pickedCase.isClosed ? 1 : pickedCase.isActive ? 2 : 3;
      setCaseState(tmp);
      setCaseStateId(tmpId);

      let pLawyers = "";
      pickedCase.plaintiff_lawyers.forEach((p) => {
        pLawyers += p + ", ";
      });

      pLawyers = pLawyers.slice(0, -2);

      let dLawyers = "";
      pickedCase.defendant_lawyers.forEach((p) => {
        dLawyers += p + ", ";
      });
      dLawyers = dLawyers.slice(0, -2);

      dLawyers = dLawyers === "" ? "no lawyers" : dLawyers;
      pLawyers = pLawyers === "" ? "no lawyers" : pLawyers;
      setDefendantLawyers(dLawyers);
      setPlaintiffLawyers(pLawyers);
    }
  }, [pickedCase]);

  return (
    <div className="caseview-container">
      {hideBackButton && (
        <div className="caseview-container-back" onClick={moveBackHandler}>
          <i className="fa-solid fa-arrow-left"></i>
        </div>
      )}
      <div className="caseview-container-header">
        <header>
          <span>#</span>
          <h2>{pickedCase._id}</h2>
        </header>
        <div>
          <p className="pointed-p" id={`pp${caseStateId}`}>
            {caseState}
          </p>
        </div>
      </div>
      <Item
        text={
          pickedCase.court_branch.city + ", " + pickedCase.court_branch.name
        }
        title="court"
      />
      <Item text={pickedCase.caseType.name} title="case type" />
      <div className="caseview-container-persons">
        <div>
          <Item text={pickedCase.plaintiff} title="plaintiff" />
          <Item text={plaintiffLawyers} title="plaintiff lawyers" />
        </div>
        <div>
          <Item text={pickedCase.defendant} title="defendent" />
          <Item text={defendantLawyers} title="defendent lawyers" />
        </div>
      </div>
      {pickedCase.description && (
        <Item text={pickedCase.description} title="Description" />
      )}
      <Item text={new Date(pickedCase.init_date).toDateString()} title="Date" />
    </div>
  );
};

export default CaseView;
