import "./Table.css";

const TableRow = ({ rowData, actionData }) => {
  let dataList = Object.keys(rowData).map((key) => (
    <td key={key}>{rowData[key]}</td>
  ));

  if (actionData) {
    dataList.push(
      <td key={actionData.id}>
        <div>
          <button id={actionData.id} onClick={actionData.actionHandler}>
            {actionData.text}
          </button>
        </div>
      </td>
    );
  }

  return <tr>{dataList}</tr>;
};

/* data=  {rowData: {} , actionData:{id: number , text: string, actionHandler: function}} */
//data is an array
const Table = ({ headers, data, headerAction }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} id={header}>
              {header}
            </th>
          ))}
          {headerAction && <th>{headerAction}</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((data, index) => (
          <TableRow
            key={index}
            rowData={data.rowData}
            actionData={data.actionData}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
