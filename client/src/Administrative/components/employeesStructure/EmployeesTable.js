import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import EmployeeCard from "./EmployeeCard";
import EmployeeFilter from "../employeeFilter/EmployeeFilter";
import "./EmployeesTable.css";
import Table from "../../../shared/components/Table/Table";
import { AuthContext } from "../../../shared/context/auth";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeesTable = () => {
  const ctx = useContext(AuthContext);

  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const [employees, setEmployees] = useState();

  const [showCard, setShowCard] = useState(false);

  const [currentEmployee, setCurrentEmployee] = useState(0);
  const tableRef = useRef(null);
  const cardRef = useRef(null);

  const fetchEmployees = async () => {
    let url = `${REACT_APP_API_BASE_URL}/admin/employees`;
    if (ctx.type === "Admin" && ctx.user.court_branch) {
      url = `${REACT_APP_API_BASE_URL}/admin/employees/court/id/${ctx.user.court_branch._id}`;
    } else if (ctx.type === "Judge") {
      if (ctx.user.court_name) {
        url = `${REACT_APP_API_BASE_URL}/admin/employees/court/id/${ctx.user.court_name._id}`;
      } else {
        return;
      }
    }
    console.log(ctx.type);
    console.log(ctx.user.court_branch);
    const response = await fetch(url);

    const response_data = await response.json();
    let tmpArray = [];
    if (response.ok === true) {
      setEmployees(response_data);

      for (let index = 0; index < response_data.length; index++) {
        const element = response_data[index];
        const { employee_id, full_name, job, phone, court_branch } =
          element.data;
        let tmp;
        if (!court_branch) {
          tmp = "";
        } else {
          tmp = court_branch.name;
        }
        const arrElement = {
          rowData: { employee_id, full_name, c: tmp, job: job.title, phone },
          actionData: {
            id: employee_id,
            actionHandler: changeCurrentEmployee,
            text: "details",
          },
        };
        tmpArray.push(arrElement);
      }
      setTableData(tmpArray);
      setFilteredTableData(tmpArray);
    }
  };

  const filterEmployees = useCallback(
    (searchBy, value) => {
      if (!searchBy) {
        searchBy = "employee id";
      }
      let tmpArray = [];

      if (tableData) {
        for (let index = 0; index < tableData.length; index++) {
          const element = tableData[index];

          if (
            searchBy.trim() === "employee id" &&
            !element.rowData.employee_id.trim().includes(value)
          ) {
            continue;
          } else if (
            searchBy.trim() === "name" &&
            !element.rowData.full_name?.includes(value)
          ) {
            continue;
          }

          tmpArray.push(element);
        }
        setFilteredTableData(tmpArray);
      }
    },
    [tableData]
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  const changeCurrentEmployee = useCallback((event) => {
    setCurrentEmployee(parseInt(event.target.id));
    setShowCard(true);
    //manage the styling
    if (tableRef.current) {
      tableRef.current.style = "width: 70%";
    }
  }, []);

  return (
    <div className="employeesTable">
      <div className="employeesTable-actions">
        {ctx.type === "Admin" &&
          ctx?.user?.job?.permissions?.employees.manage && (
            <Link to="/admin/emp/new">
              <i className="fa-solid fa-circle-plus"></i>
              <p>Add Employee</p>
            </Link>
          )}
        {ctx.type === "Admin" &&
          ctx?.user?.job?.permissions?.employees.manage && (
            <Link to="/admin/emp/new">
              <i className="fa-solid fa-user-minus"></i>
              <p>Remove Employee</p>
            </Link>
          )}
      </div>
      <div className="employees-table-container">
        <div className="employees-table-wrapper" ref={tableRef}>
          <EmployeeFilter filterEmployees={filterEmployees} />
          <div className="employees-table">
            <Table
              data={filteredTableData}
              headers={["Employee ID", "name", "court", "job", "phone"]}
              headerAction="details"
            />
          </div>
        </div>
        {showCard && employees && (
          <EmployeeCard
            id={currentEmployee}
            employees={employees}
            ref={cardRef}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeesTable;
