import CasesLinks from "../../components/casesLinks/CasesLinks";
import { Route, Routes } from "react-router-dom";
import "./Cases.css";
import CasesStructure from "../../components/casesStructure/CasesStructure";
import CasesStructureNew from "../../components/casesStructureNew/CasesStructureNew";
import CasesItems from "../../components/casesItems/CasesItems";
import CaseNew from "../../components/caseNew/CaseNew";
import CasesManage from "../../components/casesManage/CasesManage";
import CaseProfileWrapper from "../../components/caseProfileWrapper/CaseProfileWrapper";
import CasesStructureUpdate from "../../components/casesStructureUpdate/CasesStructureUpdate";
import { AuthContext } from "../../../shared/context/auth";
import { useContext, useEffect, useState } from "react";
const Cases = () => {
  const { type, user } = useContext(AuthContext);
  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (user && user.job?.permissions) {
      setPerms(user.job?.permissions);
    }
  }, [type, user]);

  return (
    <div className="cases-container">
      <CasesLinks />
      {perms && (
        <Routes>
          {perms.cases.view && <Route path="/" Component={CasesItems} />}
          {perms.cases.manage && <Route path="/new" Component={CaseNew} />}
          {perms.cases.control && (
            <Route path="/manage" Component={CasesManage} />
          )}
          {perms.cases.control && (
            <Route path="/manage/:id" Component={CaseProfileWrapper} />
          )}
          {perms.caseTypes.manage && (
            <Route path="/structure/new" Component={CasesStructureNew} />
          )}
          {perms.caseTypes.manage && (
            <Route path="/structure/update" Component={CasesStructureUpdate} />
          )}
          {perms.caseTypes.view && (
            <Route path="/structure" Component={CasesStructure} />
          )}
        </Routes>
      )}
    </div>
  );
};

export default Cases;
