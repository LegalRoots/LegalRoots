import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeesTable from "../../components/employeesStructure/EmployeesTable";
import NewEmployee from "../../components/employeesStructure/NewEmployee";

import "./Employees.css";

const Employees = () => {
  return (
    <div className="employees-conatiner">
      <Routes>
        <Route path="/" Component={EmployeesTable} />
        <Route path="/new" Component={NewEmployee} />
      </Routes>
    </div>
  );
};

export default Employees;
