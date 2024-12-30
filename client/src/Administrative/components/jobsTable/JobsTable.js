import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import Card from "../headerCard/Card";
import Table from "../../../shared/components/Table/Table";
import Item from "../../../shared/components/Item/Item";

import "./JobsTable.css";

const TABLE_HEADERS = ["job id", "title"];

const JobsTable = ({ detailsHandler, jobs, onNewHandler }) => {
  const [tableData, setTableData] = useState([]);

  const formatData = (data) => {
    let tmpArray = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const { title, _id } = element;

      const arrElement = {
        rowData: {
          id: _id,
          title: title,
        },
      };
      arrElement.actionData = {
        id: _id,
        actionHandler: detailsHandler,
        text: "details",
      };

      tmpArray.push(arrElement);
    }
    console.log(tmpArray);

    setTableData(tmpArray);
  };
  useEffect(() => {
    if (jobs?.length > 0) {
      formatData(jobs);
    }
  }, [jobs]);

  return (
    <div className="admin-assignments-table">
      <Card header="Jobs">
        <div onClick={onNewHandler}>
          <Item icon="fa-solid fa-circle-plus" text="New job" />
        </div>
        <div className="admin-assignment-table-wrapper">
          <div className="employees-table">
            <Table
              data={tableData}
              headers={TABLE_HEADERS}
              headerAction="details"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobsTable;
