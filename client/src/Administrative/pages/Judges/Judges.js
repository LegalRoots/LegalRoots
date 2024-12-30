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

  let routes;
  if (type === "Admin") {
    routes = (
      <Routes>
        {perms?.judges?.view && <Route path="/" Component={JudgesData} />}
        {perms?.judges?.manage && <Route path="/new" Component={NewJudge} />}
      </Routes>
    );
  } else {
    routes = <Routes></Routes>;
  }

  return <div className="judges-main">{routes}</div>;
};

export default Judge;
