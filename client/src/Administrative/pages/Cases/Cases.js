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
const Cases = () => {
  return (
    <div className="cases-container">
      <CasesLinks />
      <Routes>
        <Route path="/" Component={CasesItems} />
        <Route path="/new" Component={CaseNew} />
        <Route path="/manage" Component={CasesManage} />
        <Route path="/manage/:id" Component={CaseProfileWrapper} />
        <Route path="/structure/new" Component={CasesStructureNew} />
        <Route path="/structure/update" Component={CasesStructureUpdate} />
        <Route path="/structure" Component={CasesStructure} />
      </Routes>
    </div>
  );
};

export default Cases;
