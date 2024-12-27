import "./AssignmentsReplace.css";
import Card from "../headerCard/Card";
import Table from "../../../shared/components/Table/Table";
import Alert from "../../../shared/components/aydi/alert/Alert";

import { useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AssignmentsReplace = ({
  assignmentId,
  caseId,
  employeeId,
  closeOverlayHandler,
  courtId,
}) => {
  const [tableData, setTableData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [pickedEmployee, setPickedEmployee] = useState(false);

  const [empData, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/employees/court/id/${courtId}`
  );

  const formatData = (data) => {
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
    if (!isLoading && empData) {
      console.log(empData);
      let tmp = empData?.filter((e) => e.data._id !== employeeId);
      formatData(tmp);
    }
  }, [empData, isLoading, employeeId]);

  const submitRequest = async (employee_id) => {
    const BODY_DATA = {
      caseId: caseId,
      employeeId: employee_id,
      assignmentId,
    };
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/case/reassign`,
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
    const id = event.target.id;

    submitRequest(id);
  };

  const closeAlertHandler = () => {
    setShowAlert(false);
    closeOverlayHandler();
  };

  return (
    <div className="case-assignment-container">
      {showAlert && (
        <Alert closeAlertHandler={closeAlertHandler} title="Case Assigned">
          case number #{caseId} has been successfully Reassigned
        </Alert>
      )}
      <Card header={`Reassign case`}>
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

export default AssignmentsReplace;
