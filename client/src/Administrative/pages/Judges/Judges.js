import { Routes, Route } from "react-router-dom";
import JudgesData from "../../components/judges/JudgesData";
import NewJudge from "../../components/judgeNew/NewJudge";

import "./Judges.css";

const Judge = () => {
  return (
    <div className="judges-main">
      <Routes>
        <Route path="/" Component={JudgesData} />
        <Route path="/new" Component={NewJudge} />
      </Routes>
    </div>
  );
};

export default Judge;
