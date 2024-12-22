import CaseView from "../../casesItem/caseView/CaseView";
import Button from "../../../../shared/components/Button2/Button";
import { useFetch } from "../../../../shared/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import "./CaseCard.css";
import { useEffect, useState } from "react";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CaseCard = ({ pickedCase }) => {
  const [caseItem, setCaseItem] = useState(null);
  const [dataValid, setDataValid] = useState(false);
  const navigate = useNavigate();
  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/case/caseId/${pickedCase._id}`
  );

  useEffect(() => {
    if (!isLoading && data) {
      setCaseItem(data.case);
      setDataValid(true);
    }
  }, [data, isLoading]);

  const manageCaseHandler = () => {
    navigate(`/admin/cases/manage/${caseItem._id}`, {
      state: { pickedCase: caseItem },
    });
  };
  return (
    <>
      {dataValid && (
        <div className="admin-assigned-case-card">
          <CaseView pickedCase={caseItem} hideBackButton={false} />
          <div className="admin-assigned-case-card-buttons">
            <Button
              id=""
              color="black"
              size="2"
              type="button"
              onClick={manageCaseHandler}
            >
              open
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseCard;
