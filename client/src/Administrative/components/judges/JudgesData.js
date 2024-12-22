import { useEffect, useState } from "react";

import Table from "../../../shared/components/Table/Table";
import PersonalCard from "./PersonalCard";
import Card from "../judgesManagerCard/Card";
import { Link } from "react-router-dom";

import "./JudgesData.css";

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

const ListItem = (props) => {
  let icon;
  let sec1, sec2;
  if (props.type === "sec") {
    icon = <i className="fa-solid fa-user"></i>;
    sec1 = props.sec.id;
    sec2 = props.sec.name;
  } else {
    icon = <i className="fa-solid fa-gavel"></i>;
    sec1 = props.case.id;
    sec2 = props.case.type;
  }
  return (
    <li>
      {icon}
      <div>
        <p>{sec1}</p>
      </div>
      <div>
        <p>{sec2}</p>
      </div>
      <div>
        <Link>view</Link>
      </div>
    </li>
  );
};

const JudgesData = () => {
  const [judges, setJudges] = useState([]);
  const [tableJudges, setTableJudges] = useState([]);

  const [currentJudge, setCurrentJudge] = useState(null);

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
    console.log("in judges array");
  }, [judges]);

  return (
    <div className="judges-container">
      <div className="judges-details">
        <div>
          <div className="judges-details-managers">
            {managers.map((manager) => (
              <Card
                key={manager.id}
                id={manager.id}
                name={manager.name}
                job={manager.email}
              />
            ))}
          </div>
          <div className="judges-details-selected">
            <PersonalCard currentJudge={currentJudge} />
          </div>
        </div>
        <div className="judges-details-numbers">
          <div className="judges-count">
            <span>272</span>
            <span>judges</span>
            <a href="#tab">view all</a>
          </div>
          <div className="judges-actions">
            <Link to="/admin/judges/new">
              <i className="fa-solid fa-circle-plus"></i>
              new judge
            </Link>
            <Link to="/admin/judges#table">
              <i className="fa-solid fa-minus"></i>
              delete judge
            </Link>
            <a href="#table">
              <i className="fa-solid fa-globe"></i>
              active judges
            </a>
            <a href="/admin/judges#filter">
              <i className="fa-solid fa-magnifying-glass"></i>
              search
            </a>
          </div>
        </div>
      </div>
      <div className="judges-details-tables">
        <div className="judges-details-tables-sec">
          <div>
            <h2>Secretaries</h2>
          </div>
          <ul>
            <ListItem
              sec={{ id: "4085663124", name: "ali jamal yousef" }}
              type="sec"
            />
          </ul>
        </div>
        <div className="judges-details-tables-courts">
          <div>
            <h2>Cases</h2>
          </div>
          <ul>
            <ListItem case={{ type: "traffic", id: 15632 }} type="case" />
            <ListItem case={{ type: "traffic", id: 15632 }} type="case" />
            <ListItem case={{ type: "traffic", id: 15632 }} type="case" />
          </ul>
        </div>
      </div>
      <div className="judges-filter" id="filter">
        filter
      </div>
      <div className="judges-table" id="table">
        <Table headers={headers} data={tableJudges} headerAction="details" />
      </div>
    </div>
  );
};

export default JudgesData;
