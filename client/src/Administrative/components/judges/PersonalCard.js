import logo from "../../../shared/assets/m.jpg";
import { Link } from "react-router-dom";
import "./PersonalCard.css";
import { useEffect, useState } from "react";

const PersonalCard = ({ currentJudge }) => {
  const [judge, setJudge] = useState(null);

  useEffect(() => {
    if (currentJudge) {
      const data = {
        name:
          currentJudge.data.first_name +
          " " +
          currentJudge.data.second_name +
          " " +
          currentJudge.data.third_name +
          " " +
          currentJudge.data.last_name,
        court: currentJudge.data.court_name.name,
        photo: currentJudge.judge_photo,
      };
      setJudge(data);
    }
  }, [currentJudge]);
  return (
    <div className="personal-card">
      {judge && (
        <>
          {" "}
          <div className="personal-card-upper">
            <div className="personal-card-upper__image">
              <img src={`data:image/jpeg;base64,${judge.photo}`} alt="sss" />
            </div>
            <div className="personal-card-upper__data">
              <div>
                <h3>{judge.name}</h3>
                <p>{judge.court}</p>
              </div>
              <div>
                <Link>view profile</Link>
              </div>
            </div>
          </div>
          <div className="personal-card-lower">
            <div className="personal-card-lower-active">active</div>
            <div className="personal-card-lower-cases">cases: 22</div>
            <div className="personal-card-lower-courts">courts: 13</div>
          </div>
        </>
      )}
      {!judge && (
        <div className="personal-card-loading">
          <h3>pick a judge to view his data</h3>
        </div>
      )}
    </div>
  );
};

export default PersonalCard;
