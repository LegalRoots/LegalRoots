import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useState, useEffect } from "react";
import EvidencesList from "../../../Administrative/components/caseProfileWrapper/CaseProfile/evidencesList/EvidencesList";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useLocation } from "react-router-dom";
import "./FilesList.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FilesList = ({ showFilesOverlay, closeFilesOverlayHandler }) => {
  const location = useLocation();
  const [evidences, setEvidences] = useState([]);
  const [evidencesData, isEvidencesLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/evidence/caseId/${location.state.court.caseId}`
  );
  useEffect(() => {
    if (!isEvidencesLoading && evidencesData) {
      setEvidences(evidencesData.evidences);
    }
  }, [evidencesData, isEvidencesLoading]);
  return (
    <>
      {showFilesOverlay && (
        <Overlay closeOverlayHandler={closeFilesOverlayHandler}>
          <div className="onlinecourt-filesList-container">
            <header>Evidences</header>
            {evidences.length && <EvidencesList evidences={evidences} />}
          </div>
        </Overlay>
      )}
    </>
  );
};

export default FilesList;
