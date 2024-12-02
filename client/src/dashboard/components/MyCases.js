// src/components/Dashboard/MyCases.js
import React from "react";

const MyCases = () => {
  const cases = [
    { id: 1, title: "Case #1", status: "In Progress" },
    { id: 2, title: "Case #2", status: "Closed" },
    { id: 3, title: "Case #3", status: "Open" },
  ];

  return (
    <div className="my-cases">
      <h2>My Cases</h2>
      <ul>
        {cases.map((courtCase) => (
          <li key={courtCase.id}>
            <strong>{courtCase.title}</strong> - {courtCase.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCases;
