import "./CasesItems.css";
import CasesItem from "../casesItem/CasesItem";
import { useEffect, useState, useContext } from "react";
import Table from "../../../shared/components/Table/Table";
import CaseStateBarChart from "../charts/caseStateBarChart/CaseStateBarChart";
import CaseStateBubbleChart from "../charts/caseStateBubbleChart/CaseStateBubbleChart";
import CasesFilter from "../filters/CasesFilter/CasesFilter";
import { useFetch } from "../../../shared/hooks/useFetch";
import { ExportJson } from "../filters/export/ExportService";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const headers = ["Case Id", "Type", "Plantiff", "Court"];

const CasesItems = () => {
  const ctx = useContext(AuthContext);

  const [cases, setCases] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [pickedCase, setPickedCase] = useState(null);
  const [tableState, setTableState] = useState(1);
  //filter states
  const [courtsList, setCourtsList] = useState([]);
  const [typesArray, setTypesArray] = useState([]);
  const [filterState, setFilterState] = useState({
    court_branch: "",
    caseType: "",
    caseState: "",
    from: "",
    to: "",
  });
  const [courtData, isCourtDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );
  const [typesData, typesDataIsLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/caseType`
  );

  useEffect(() => {
    if (!typesDataIsLoading) {
      let tmpArray = typesData.caseTypes.map((type) => type.name);
      setTypesArray(tmpArray);
    }
  }, [typesData, typesDataIsLoading]);

  useEffect(() => {
    if (!isCourtDataLoading && courtData) {
      let tmpArray = courtData.map((court) => court.name);
      setCourtsList(tmpArray);
    }
  }, [courtData, isCourtDataLoading]);
  //filter states

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

  const getFilteredCaseTypes = async (filterState) => {
    let caseType = typesData.caseTypes.find((ct) => {
      return ct.name.toLowerCase() === filterState.caseType?.toLowerCase();
    });

    let court = courtData.find((ct) => {
      return ct.name.toLowerCase() === filterState.court_branch?.toLowerCase();
    });

    filterState.court_branch = court?._id;
    filterState.caseType = caseType?._id;

    try {
      let courtId = "";
      if (ctx.user.court_branch) {
        courtId = ctx.user.court_branch._id;
      }
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/filter?court=${courtId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filterState),
        }
      );

      const response_data = await response.json();
      const ALL_CASES = response_data.cases;
      setCasesList(ALL_CASES);

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

  const applySearchHandler = async (idVal) => {
    try {
      let courtId = "";
      if (ctx.user.court_branch) {
        courtId = ctx.user.court_branch._id;
      }
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/filter/${idVal}?court=${courtId}`
      );

      const response_data = await response.json();
      const ALL_CASES = response_data.cases;
      setCasesList(ALL_CASES);

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

  const getAllCaseTypes = async () => {
    try {
      let courtId = "";
      if (ctx.user.court_branch) {
        courtId = ctx.user.court_branch._id;
      }

      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/all?court=${courtId}`
      );

      const response_data = await response.json();
      const ALL_CASES = response_data.cases;
      setCasesList(ALL_CASES);
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

  const exportHandler = () => {
    ExportJson(casesList);
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
            <p className="pointed-p">Non Assigned cases</p>
          </div>
        </div>
      </div>
      <div className="casesItems-container-wrapper">
        <CasesFilter
          applyFilterHandler={getFilteredCaseTypes}
          applySearchHandler={applySearchHandler}
          court_names={courtsList}
          types_names={typesArray}
          exportHandler={exportHandler}
        />

        <div className="casesItems-container-wrapper-table">
          {tableState === 1 ? (
            <Table headers={headers} data={cases} headerAction={"view data"} />
          ) : (
            filterState && (
              <CasesItem
                pickedCaseId={pickedCase}
                toggleTableStateHandler={toggleTableStateHandler}
                setFilterState={setFilterState}
                filterState={filterState}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CasesItems;
