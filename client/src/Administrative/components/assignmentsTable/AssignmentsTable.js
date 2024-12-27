import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import Card from "../headerCard/Card";
import Table from "../../../shared/components/Table/Table";

import "./AssignmentsTable.css";

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
  };
  useEffect(() => {
    if (assignedCases?.length > 0) {
      formatData(assignedCases);
    }
  }, [assignedCases]);

  return (
    <div className="admin-assignments-table">
      <Card header="Assigned Cases">
        <div className="admin-assignment-table-wrapper">
          <div className="employees-table">
            <div>sss</div>
            <Table
              data={tableData}
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
