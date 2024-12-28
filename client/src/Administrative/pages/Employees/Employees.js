import { Routes, Route } from "react-router-dom";
import EmployeesTable from "../../components/employeesStructure/EmployeesTable";
import NewEmployee from "../../components/employeesStructure/NewEmployee";
import { AuthContext } from "../../../shared/context/auth";
import { useContext, useEffect, useState } from "react";

import "./Employees.css";

const Employees = () => {
  const { type, user } = useContext(AuthContext);
  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (user && user.job?.permissions) {
      setPerms(user.job?.permissions);
    }
  }, [type, user]);

  return (
    <div className="employees-conatiner">
      {perms && (
        <Routes>
          {perms.employees.view && (
            <Route path="/" Component={EmployeesTable} />
          )}
          {!perms.employees.manage && (
            <Route path="/new" Component={NewEmployee} />
          )}
        </Routes>
      )}
    </div>
  );
};

export default Employees;
