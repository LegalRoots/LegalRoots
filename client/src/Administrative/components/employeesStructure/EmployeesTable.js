import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import EmployeeCard from "./EmployeeCard";
import EmployeeFilter from "../employeeFilter/EmployeeFilter";
import "./EmployeesTable.css";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TableRow = ({ employee, changeCurrentEmployee }) => {
  return (
    <tr>
      {true && <td>{employee.data.employee_id}</td>}
      <td>{employee.data.full_name}</td>
      <td>{employee.data.job}</td>
      <td>{employee.data.phone}</td>
      <td>
        <div>
          <button
            id={employee.data.employee_id}
            onClick={changeCurrentEmployee}
          >
            details
          </button>
        </div>
      </td>
    </tr>
  );
};

const EmployeesTable = () => {
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const tableRef = useRef(null);
  const cardRef = useRef(null);

  const fetchEmployees = async () => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/employees`);
    const response_data = await response.json();

    if (response.ok === true) {
      setEmployees(response_data);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const changeCurrentEmployee = (event) => {
    const requestedEmployee = employees.find((employee) => {
      return employee.data.employee_id === event.target.id;
    });
    setCurrentEmployee(requestedEmployee);
    //manage the styling
    if (tableRef.current) {
      tableRef.current.style = "width: 70%";
    }
  };

  return (
    <div className="employeesTable">
      <div className="employeesTable-actions">
        <Link to="/admin/emp/new">
          <i className="fa-solid fa-circle-plus"></i>
          <p>Add Employee</p>
        </Link>
      </div>
      <div className="employees-table-container">
        <div className="employees-table-wrapper" ref={tableRef}>
          <EmployeeFilter />
          <div className="employees-table">
            <table>
              <thead>
                <tr>
                  {true && <th>Employee ID</th>}
                  <th>name</th>
                  <th>job</th>
                  <th>phone</th>
                  <th>details</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
                {employees.map((employee) => (
                  <TableRow
                    key={parseInt(employee.data.employee_id)}
                    employee={employee}
                    changeCurrentEmployee={changeCurrentEmployee}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {currentEmployee && (
          <EmployeeCard employee={currentEmployee} ref={cardRef} />
        )}
      </div>
    </div>
  );
};

export default EmployeesTable;
