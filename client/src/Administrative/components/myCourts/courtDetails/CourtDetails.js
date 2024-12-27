import { useState, useEffect } from "react";
import "./CourtDetails.css";
import { useFetch } from "../../../../shared/hooks/useFetch";
import Alert from "../../../../shared/components/aydi/alert/Alert";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourtDetails = ({ courtId }) => {
  const [court, setCourt] = useState();
  const [defTeam, setDefTeam] = useState([]);
  const [plTeam, setPlTeam] = useState([]);

  const [courtData, isCourtDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court/details/${courtId}`
  );
  useEffect(() => {
    if (!isCourtDataLoading && courtData) {
      setCourt(courtData.court);
    }
  }, [courtData, isCourtDataLoading]);

  useEffect(() => {
    if (court) {
      court.users.forEach((element) => {
        if (court.defense_team.includes(element.ssid)) {
          setDefTeam((pre) => {
            return [...pre, element];
          });
        } else if (court.plaintiff_team.includes(element.ssid)) {
          setPlTeam((pre) => {
            return [...pre, element];
          });
        }
      });

      court.lawyers.forEach((element) => {
        if (court.defense_team.includes(element.ssid)) {
          setDefTeam((pre) => {
            return [...pre, element];
          });
        } else if (court.plaintiff_team.includes(element.ssid)) {
          setPlTeam((pre) => {
            return [...pre, element];
          });
        }
      });
    }
  }, [court]);

  return (
    <>
      {court && (
        <div className="court-container">
          <div className="court-header">
            <h2>Case ID: {court.caseId}</h2>
            <p>Case Type: {court.caseType}</p>
            <p>Court Branch: {court.court_branch}</p>
            <p>Date: {new Date(court.time).toLocaleDateString()}</p>
            <p>Time: {new Date(court.time).toLocaleTimeString()}</p>
          </div>
          <div className="court-details">
            <div className="group">
              <h3>Plaintiff team</h3>
              <ul>
                {plTeam?.map((user, index) => (
                  <li key={index}>
                    {user.name} (SSID: {user.ssid})
                  </li>
                ))}
              </ul>
            </div>
            <div className="group">
              <h3>Defense Team</h3>
              <ul>
                {defTeam?.map((lawyer, index) => (
                  <li key={index}>
                    {lawyer.name} (SSID: {lawyer.ssid})
                  </li>
                ))}
              </ul>
            </div>
            <div className="group">
              <h3>Employees</h3>
              <ul>
                {court.employees?.map((employee, index) => (
                  <li key={index}>
                    {employee.name} (SSID: {employee.ssid})
                  </li>
                ))}
              </ul>
            </div>
            <div className="group">
              <h3>Judges</h3>
              <ul>
                {court.judges?.map((judge, index) => (
                  <li key={index}>
                    {judge.name} (SSID: {judge.ssid})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourtDetails;
