import Table from "../../../shared/components/Table/Table";
import { useEffect, useState } from "react";

import "./CasesStructure.css";
import CaseTypePage from "../caseTypePage/CaseTypePage";
import CaseTypesBarChart from "../charts/caseTypesBarChart/caseTypesBarChart";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const headers = ["Case type Id", "Title"];

const CasesStructure = () => {
  const [types, setTypes] = useState([]);
  const [showCaseTypePage, setShowCaseTypePage] = useState(false);
  const [requestedID, setRequestedID] = useState(null);

  const tableActionHandler = (event) => {
    const id = event.target.id;
    setRequestedID(id);
    setShowCaseTypePage(true);
  };

  const getAllCaseTypes = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/caseType`);

      const response_data = await response.json();

      if (response.ok === true) {
        let tmpArray = [];
        for (let index = 0; index < response_data.caseTypes.length; index++) {
          const element = response_data.caseTypes[index];

          const { name, _id } = element;
          const arrElement = {
            rowData: { name, _id },
            actionData: {
              id: _id,
              actionHandler: tableActionHandler,
              text: "details",
            },
          };
          tmpArray.push(arrElement);
        }
        setTypes(tmpArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCaseTypes();
  }, []);

  const closeModalHandler = () => {
    setShowCaseTypePage(false);
  };

  return (
    <div className="casesStructure-container">
      <div className="casesStructure-container-table">
        <Table headers={headers} data={types} headerAction={"view data"} />
        {showCaseTypePage && (
          <CaseTypePage
            id={requestedID}
            closeModalHandler={closeModalHandler}
          />
        )}
      </div>
    </div>
  );
};

export default CasesStructure;
