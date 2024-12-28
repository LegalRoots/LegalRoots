import { Routes, Route } from "react-router-dom";
import JudgesData from "../../components/judges/JudgesData";
import NewJudge from "../../components/judgeNew/NewJudge";
import { AuthContext } from "../../../shared/context/auth";
import { useContext, useEffect, useState } from "react";
import "./Judges.css";

const Judge = () => {
  const { type, user } = useContext(AuthContext);
  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (user && user.job?.permissions) {
      setPerms(user.job?.permissions);
    }
  }, [type, user]);
  return (
    <div className="judges-main">
      {perms && (
        <Routes>
          {perms.judges?.view && <Route path="/" Component={JudgesData} />}
          {perms.judges?.manage && <Route path="/new" Component={NewJudge} />}
        </Routes>
      )}
    </div>
  );
};

export default Judge;
