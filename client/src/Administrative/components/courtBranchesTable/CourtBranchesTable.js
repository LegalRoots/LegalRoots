import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import Card from "../headerCard/Card";
import Table from "../../../shared/components/Table/Table";

import "./CourtBranchesTable.css";

const TABLE_HEADERS = ["court name", "admin", "city"];

const CourtBranchesTable = ({
  newHandler,
  courts,
  updateHandler,
  deleteHandler,
}) => {
  const [tableData, setTableData] = useState([]);

  const formatData = (data) => {
    let tmpArray = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const { admin, name, city, _id } = element;

      const arrElement = {
        rowData: {
          name: name,
          admin: admin.full_name,
          city: city,
        },
      };

      arrElement.actionData = {
        id: _id,
        actionHandler: updateHandler,
        text: "update",
      };

      tmpArray.push(arrElement);
    }

    setTableData(tmpArray);
  };
  useEffect(() => {
    if (courts?.length > 0) {
      formatData(courts);
    }
  }, [courts]);

  return (
    <div className="admin-assignments-table">
      <Card header="Court Branches">
        <div className="admin-assignments-table-actions">
          <div
            onClick={newHandler}
            className="admin-assignments-table__newCourt"
          >
            <i className="fa-solid fa-circle-plus"></i>
            <p>new court</p>
          </div>
          <div
            onClick={newHandler}
            className="admin-assignments-table__newCourt"
          >
            <i className="fa-solid fa-circle-plus"></i>
            <p>delete court</p>
          </div>
        </div>
        <div className="admin-assignment-table-wrapper">
          <div className="employees-table">
            <Table
              data={tableData}
              headers={TABLE_HEADERS}
              headerAction="update"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourtBranchesTable;
