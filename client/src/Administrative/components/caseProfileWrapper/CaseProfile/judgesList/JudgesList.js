import Card from "../../../judgesManagerCard/Card";
import { useCallback, useEffect, useState } from "react";
import Button from "../../../../../shared/components/Button2/Button";
import Input from "../../../../../shared/components/FormElements/aydi/Input";
import Overlay from "../../../../../shared/components/aydi/overlay/Overlay";
import "./JudgesList.css";
import NewJudge from "./newJudge/NewJudge";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const JudgesList = ({ judges, caseId, ctx }) => {
  const [action, setAction] = useState("");
  const [btnText, setBtnText] = useState(" Remove judge");
  const [inputValue, setInputValue] = useState("");

  const [showOverlay, setShowOverlay] = useState(false);
  const toggleRemove = () => {
    if (action === "remove") {
      setAction("");
      setBtnText(" Remove judge");
    } else {
      setAction("remove");
      setBtnText(" Cancel");
    }
  };

  const removeHandler = async (event) => {
    const BODY_DATA = { caseId: caseId, judgeId: event.target.id };
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/judges/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(BODY_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addHandler = async (event) => {
    const BODY_DATA = { caseId: caseId, judgeId: event.target.id };
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/judges/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(BODY_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showOverlayHandler = () => {
    setShowOverlay(true);
  };
  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };

  const inputHandler = useCallback((id, val, isValid) => {
    setInputValue(val);
  }, []);
  return (
    <div className="admin-judgeslist-container">
      {showOverlay && (
        <NewJudge
          closeOverlayHandler={closeOverlayHandler}
          inputHandler={inputHandler}
          addJudgeHandler={addHandler}
        />
      )}
      {ctx.type === "Admin" && (
        <div className="admin-judgeslist-buttons">
          <Button size="1" type="button" onClick={toggleRemove}>
            <i className="fa-solid fa-minus"></i>
            {btnText}
          </Button>
          <Button size="1" type="button" onClick={showOverlayHandler}>
            <i className="fa-solid fa-plus"></i> Add judge
          </Button>
        </div>
      )}
      <div className="admin-judgeslist-cards">
        {judges.map((judge) => (
          <Card
            key={judge._id}
            id={judge._id}
            name={judge.first_name + " " + judge.last_name}
            job={judge.email}
            action={action}
            actionHandler={removeHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default JudgesList;
