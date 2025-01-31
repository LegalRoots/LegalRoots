import { useCallback, useEffect, useState, useContext } from "react";

import Table from "../../../shared/components/Table/Table";
import PersonalCard from "./PersonalCard";
import Card from "../judgesManagerCard/Card";
import { Link } from "react-router-dom";
import { useFetch } from "../../../shared/hooks/useFetch";
import { ExportJson } from "../filters/export/ExportService";
import { AuthContext } from "../../../shared/context/auth";

import "./JudgesData.css";
import JudgesFilter from "../filters/judgesFilter/JudgesFilter";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const managers = [
  { name: "محمد علي خالد موسى", email: "mohammed@ps.com", id: "1" },
  { name: "محمد كمال رمضان عايدي", email: "mohammed@ps.com", id: "2" },
  { name: "علي أحمد علي السيد", email: "mohammed@ps.com", id: "3" },
  { name: "يوسف رائد عادل داود", email: "mohammed@ps.com", id: "4" },
  { name: "يوسف رائد عادل داود", email: "mohammed@ps.com", id: "4" },
  { name: "يوسف رائد عادل داود", email: "mohammed@ps.com", id: "4" },
];

const headers = ["Judge ID", "SSID", "Name", "Court", "Email", "City"];

const JudgesData = () => {
  const [judges, setJudges] = useState([]);
  const [tableJudges, setTableJudges] = useState([]);
  const [filteredTableJudges, setFilteredTableJudges] = useState([]);
  const [currentJudge, setCurrentJudge] = useState(null);

  const { user } = useContext(AuthContext);

  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (user?.job.permissions) {
      setPerms(user.job.permissions);
      console.log(user.job.permissions);
    }
  }, [user]);

  const [courtsList, setCourtsList] = useState([]);
  const [courtData, isCourtDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );

  useEffect(() => {
    if (!isCourtDataLoading && courtData) {
      let tmpArray = courtData.map((court) => court.name);
      setCourtsList(tmpArray);
    }
  }, [courtData, isCourtDataLoading]);

  const applySearchHandler = useCallback(
    (searchVal, searchBy) => {
      let judges;
      if (searchVal === "") {
        setFilteredTableJudges(tableJudges);
        return;
      } else if (searchBy === "judge id") {
        judges = tableJudges.filter((t) => {
          return t.rowData.judge_id.includes(searchVal);
        });

        setFilteredTableJudges(judges);
      } else if (searchBy === "ssid") {
        judges = tableJudges.filter((t) => {
          return t.rowData.ssid.includes(searchVal);
        });

        setFilteredTableJudges(judges);
      } else if (searchBy === "name") {
        judges = tableJudges.filter((t) => {
          return t.rowData.name.includes(searchVal);
        });

        setFilteredTableJudges(judges);
      }
    },
    [tableJudges]
  );

  const exportHandler = () => {
    let tmps = filteredTableJudges.map((j) => {
      return j.rowData.judge_id;
    });
    let exportedObjs = judges.filter((j) => tmps.includes(j.judge_id));
    ExportJson(exportedObjs);
  };

  const fetchJudges = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/judges`);
      const response_data = await response.json();
      if (response.ok === true) {
        setJudges(response_data);
      }
    } catch (error) {
      console.error("error cant fetch data");
    }
  };
  const currnetJudgeHandler = async (event) => {
    const id = event.target.id;
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/judges/${id}`
      );
      const response_data = await response.json();
      if (response.ok === true) {
        setCurrentJudge(response_data);
      }
    } catch (error) {
      console.error("error cant fetch data");
    }
  };

  const applyFilterHandler = async (courtName) => {
    if (courtName === "") {
      fetchJudges();
      return;
    }
    const court = courtData.find((c) => c.name === courtName);
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/judges/court/${court._id}`
      );
      const response_data = await response.json();
      if (response.ok === true) {
        setJudges(response_data.result);
      }
    } catch (error) {
      console.error("error cant fetch data");
    }
  };

  useEffect(() => {
    fetchJudges();
  }, []);

  useEffect(() => {
    let elements = [];
    for (let i = 0; i < judges.length; i++) {
      const element = judges[i];
      elements.push({
        rowData: {
          judge_id: element.judge_id,
          ssid: element.ssid,
          name:
            element.first_name +
            " " +
            element.second_name +
            " " +
            element.third_name +
            " " +
            element.last_name,
          court_name: element.court_name.name,
          email: element.email,
          city: element.address.city,
        },
        actionData: {
          id: element.judge_id,
          text: "details",
          actionHandler: currnetJudgeHandler,
        },
      });
    }

    setTableJudges(elements);
    setFilteredTableJudges(elements);
  }, [judges]);

  return (
    <div className="judges-container">
      <div className="judges-details">
        <div className="judges-details-selected">
          <PersonalCard currentJudge={currentJudge} />
        </div>

        <div className="judges-actions">
          <div>
            {perms?.judges?.manage && (
              <Link to="/admin/judges/new">
                <i className="fa-solid fa-circle-plus"></i>
                new judge
              </Link>
            )}
            {perms?.judges?.manage && (
              <Link to="/admin/judges#table">
                <i className="fa-solid fa-minus"></i>
                delete judge
              </Link>
            )}
            <Link to="/admin/courtbranch">
              <i className="fa-solid fa-building-columns"></i>
              courts
            </Link>
            <a href="/admin/judges#filter">
              <i className="fa-solid fa-magnifying-glass"></i>
              search
            </a>
          </div>
        </div>
      </div>
      <div className="judges-table" id="table">
        <JudgesFilter
          court_names={courtsList}
          applyFilterHandler={applyFilterHandler}
          applySearchHandler={applySearchHandler}
          exportHandler={exportHandler}
        />
        <Table
          headers={headers}
          data={filteredTableJudges}
          headerAction="details"
        />
      </div>
    </div>
  );
};

export default JudgesData;
