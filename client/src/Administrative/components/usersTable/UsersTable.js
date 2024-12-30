import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import Card from "../headerCard/Card";
import Table from "../../../shared/components/Table/Table";
import Button from "../../../shared/components/Button2/Button";
import "./UsersTable.css";

const TABLE_HEADERS = ["ssid", "name", "email", "city"];

const UsersTable = ({ users, tableStateHandler, type, verifyHandler }) => {
  const [tableData, setTableData] = useState([]);

  const formatData = (data) => {
    let tmpArray = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const { first_name, last_name, SSID, email, city } = element;

      const arrElement = {
        rowData: {
          ssid: SSID,
          name: first_name + " " + last_name,
          email: email,
          city: city,
        },
      };
      if (type === 2 && !element.isVerified) {
        arrElement.actionData = {
          id: element._id,
          actionHandler: verifyHandler,
          text: "verify",
        };
      }

      tmpArray.push(arrElement);
    }
    console.log(tmpArray);

    setTableData(tmpArray);
  };
  useEffect(() => {
    if (users?.length > 0) {
      formatData(users);
    }
  }, [users]);

  const manageState = (event) => {
    let choice = 2;
    if (event.target.id === "1") {
      choice = 1;
    }

    tableStateHandler(choice);
  };

  return (
    <div className="admin-assignments-table">
      <Card header="Assigned Cases">
        <div className="admin-assignment-table-wrapper">
          <div className="employees-table">
            <div className="admin-users-table-buttons">
              <Button size="1" color="black" onClick={manageState} id="1">
                users
              </Button>
              <Button size="1" color="black" onClick={manageState} id="2">
                lawyers
              </Button>
            </div>
            <Table
              data={tableData}
              headers={TABLE_HEADERS}
              headerAction={type === 2 && "verify"}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UsersTable;
