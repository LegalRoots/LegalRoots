import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import Card from "../headerCard/Card";
import Table from "../../../shared/components/Table/Table";

import "./AssignmentsTable.css";
import AssigmentsFilter from "./AssignmentsFilter";

const TABLE_HEADERS = [
  "case id",
  "adding date",
  "assigning date",
  "employee",
  "employee id",
  "state",
  "canceled",
];

const AssignmentsTable = ({ replaceHandler, assignedCases }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const formatData = (data) => {
    let tmpArray = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const { caseId, employeeId, add_date, isValid, _id } = element;

      let caseState = "";
      if (caseId.isActive) {
        caseState = "ongoing";
      } else if (caseId.isClosed) {
        caseState = "ongoing";
      }
      const arrElement = {
        rowData: {
          caseId: caseId._id,
          date: new Date(caseId.init_date).toDateString(),
          assignDate: new Date(add_date).toDateString(),
          empName: employeeId.full_name,
          empId: employeeId.employee_id,
          caseState,
          isValid: isValid ? "no" : "yes",
        },
      };
      if (caseState === "ongoing" && isValid) {
        arrElement.actionData = {
          id: _id,
          actionHandler: replaceHandler,
          text: "replace",
        };
      }

      tmpArray.push(arrElement);
    }
    console.log(tmpArray);

    setTableData(tmpArray);
    setFilteredTableData(tmpArray);
  };
  useEffect(() => {
    if (assignedCases?.length > 0) {
      formatData(assignedCases);
    }
  }, [assignedCases]);

  const filterAssignments = useCallback(
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
            !element.rowData.empId.trim().includes(value)
          ) {
            continue;
          } else if (
            searchBy.trim() === "case id" &&
            !element.rowData.caseId?.includes(value)
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

  return (
    <div className="admin-assignments-table">
      <Card header="Assigned Cases">
        <div className="admin-assignment-table-wrapper">
          <div className="employees-table">
            <AssigmentsFilter filterAssignments={filterAssignments} />
            <Table
              data={filteredTableData}
              headers={TABLE_HEADERS}
              headerAction="replace employee"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssignmentsTable;
