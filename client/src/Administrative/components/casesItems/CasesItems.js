import "./CasesItems.css";
import CasesItem from "../casesItem/CasesItem";
import { useEffect, useState } from "react";
import Table from "../../../shared/components/Table/Table";
import CaseStateBarChart from "../charts/caseStateBarChart/CaseStateBarChart";
import CaseStateBubbleChart from "../charts/caseStateBubbleChart/CaseStateBubbleChart";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const headers = ["Case Id", "Type", "Plantiff", "Court"];

const CasesItems = () => {
  const [cases, setCases] = useState([]);
  const [pickedCase, setPickedCase] = useState(null);
  const [tableState, setTableState] = useState(1);

  const toggleTableStateHandler = () => {
    if (tableState === 1) {
      setTableState(2);
    } else {
      setTableState(1);
    }
  };

  const tableActionHandler = (event) => {
    const id = event.target.id;
    setPickedCase(id);
    toggleTableStateHandler();
  };

  const getAllCaseTypes = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/case/all`);

      const response_data = await response.json();
      const ALL_CASES = response_data.cases;

      if (response.ok === true) {
        let tmpArray = [];
        for (let index = 0; index < ALL_CASES.length; index++) {
          const element = ALL_CASES[index];

          const { _id, caseType, plaintiff, court_branch } = element;
          const caseName = caseType.name;
          const arrElement = {
            rowData: {
              _id,
              caseName,
              plaintiff,
              court_branch: court_branch.name,
            },
            actionData: {
              id: _id,
              actionHandler: tableActionHandler,
              text: "details",
            },
          };
          tmpArray.push(arrElement);
        }
        setCases(tmpArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCaseTypes();
  }, []);

  return (
    <div className="casesItems-container">
      <div className="casesItems-container-charts-wrapper">
        <CaseStateBubbleChart />
        <div className="casesItems-container-chart">
          <CaseStateBarChart />
          <div className="casesItems-container-chart__titles">
            <p className="pointed-p">Closed cases</p>
            <p className="pointed-p">Ongoing cases</p>
            <p className="pointed-p">not Assigned cases</p>
          </div>
        </div>
      </div>
      <div className="casesItems-container-wrapper">
        <div className="casesItems-container-wrapper-table">
          {tableState === 1 ? (
            <Table headers={headers} data={cases} headerAction={"view data"} />
          ) : (
            <CasesItem
              pickedCaseId={pickedCase}
              toggleTableStateHandler={toggleTableStateHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CasesItems;
