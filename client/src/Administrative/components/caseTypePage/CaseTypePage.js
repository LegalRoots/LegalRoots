import { useEffect, useRef, useState } from "react";
import Button from "../../../shared/components/Button2/Button";
import { useNavigate } from "react-router-dom";

import "./CaseTypePage.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GENERAL_FIELDS = [
  { required: true, name: "judges" },
  { required: true, name: "courts" },
  { required: true, name: "witnesses" },
  { required: true, name: "evidences" },
  { required: true, name: "plantiff" },
  { required: true, name: "defendent" },
  { required: true, name: "plantiff lawyers" },
  { required: true, name: "court's branch" },
];

const Field = ({ id, text, deleteFieldHandler, required }) => {
  const [showDelete, setShowDelete] = useState(true);
  useEffect(() => {
    GENERAL_FIELDS.forEach((field) => {
      if (field.name === id) {
        setShowDelete(false);
      }
    });
  }, [id]);

  return (
    <div className="casesStructureNew-field">
      <div>
        {required && <span>*</span>}
        <p>{text}</p>
      </div>
      {showDelete === true ? (
        <div
          id={id}
          onClick={deleteFieldHandler}
          className="casesStructureNew-field-normal"
        >
          <i className="fa-solid fa-check-double"></i>
        </div>
      ) : (
        <div id={id} className="casesStructureNew-field-common">
          <i className="fa-solid fa-check-double"></i>
        </div>
      )}
    </div>
  );
};

const CaseTypePage = ({ id, closeModalHandler }) => {
  const backgroundRef = useRef(null);
  const [caseTypeItem, setCaseTypeItem] = useState(null);
  const [renderedFieldsList, setRenderedFieldsList] = useState(GENERAL_FIELDS);
  const navigate = useNavigate();
  useEffect(() => {
    if (caseTypeItem) {
      let tmpList = GENERAL_FIELDS.concat(caseTypeItem.fields);
      setRenderedFieldsList(tmpList);
    }
  }, [caseTypeItem]);

  const fetchData = async () => {
    try {
      console.log(id);
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/caseType/${id}`
      );

      const response_data = await response.json();

      if (response.ok === true) {
        console.log(response_data);
        setCaseTypeItem(response_data.caseType);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFieldHandler = () => {};

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const stopPropagationHandler = (event) => {
    event.stopPropagation();
  };

  const deleteHandler = async () => {
    try {
      console.log(id);
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/caseType/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response_data = await response.json();

      if (response.ok === true) {
        closeModalHandler();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="caseTypePage-background"
      ref={backgroundRef}
      onClick={closeModalHandler}
    >
      {caseTypeItem && (
        <div
          className="caseTypePage-container"
          onClick={stopPropagationHandler}
        >
          <div
            className="caseTypePage-container__close"
            onClick={closeModalHandler}
          >
            <i className="fa-solid fa-x"></i>
          </div>
          <header>
            <h2>{caseTypeItem.name}</h2>
          </header>
          <div></div>
          <div className="caseTypePage-fields">
            {renderedFieldsList.map((field) => (
              <Field
                deleteFieldHandler={deleteFieldHandler}
                key={field.name}
                id={field.name}
                text={field.name}
                required={field.required}
              />
            ))}
          </div>
          <div className="caseTypePage-buttons">
            <Button color="black" size="2" onClick={deleteHandler}>
              delete
            </Button>
            <Button
              color="gold"
              size="2"
              onClick={() => {
                navigate("/admin/cases/structure/update", {
                  state: { caseTypeId: id },
                });
              }}
            >
              update
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTypePage;
