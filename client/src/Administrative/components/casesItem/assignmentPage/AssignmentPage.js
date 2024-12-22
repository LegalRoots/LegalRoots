import "./AssignmentPage.css";
import Card from "../../headerCard/Card";
import Table from "../../../../shared/components/Table/Table";
import Alert from "../../../../shared/components/aydi/alert/Alert";

import { useFetch } from "../../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AssignmentPage = ({ caseId, pickedCase, closeOverlayHandler }) => {
  const [tableData, setTableData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [pickedEmployee, setPickedEmployee] = useState(false);

  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/employees/light`
  );

  const formatData = () => {
    let tmpArray = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const { employee_id, full_name, job, phone, _id } = element.data;
      const arrElement = {
        rowData: { employee_id, full_name, job, phone },
        actionData: {
          id: _id,
          actionHandler: assignmentHandler,
          text: "assign",
        },
      };
      tmpArray.push(arrElement);
    }

    setTableData(tmpArray);
  };

  useEffect(() => {
    if (!isLoading && data) {
      formatData();
    }
  }, [data, isLoading]);

  const submitRequest = async (employee) => {
    const BODY_DATA = {
      caseId: caseId,
      employeeId: employee.data._id,
    };
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(BODY_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignmentHandler = (event) => {
    let employee = data.find((emp) => String(emp.data._id) === event.target.id);
    setPickedEmployee(employee);
    submitRequest(employee);
  };

  const closeAlertHandler = () => {
    setShowAlert(false);
    closeOverlayHandler();
  };

  return (
    <div className="case-assignment-container">
      {showAlert && (
        <Alert closeAlertHandler={closeAlertHandler} title="Case Assigned">
          case number #{caseId} has been successfully assigned to{" "}
          {pickedEmployee.data.full_name}
        </Alert>
      )}
      <Card header={`Assign case`}>
        <div className="case-assignment-table-wrapper">
          <div className="employees-table">
            <Table
              data={tableData}
              headers={["Employee ID", "name", "job", "phone"]}
              headerAction="assign"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssignmentPage;
