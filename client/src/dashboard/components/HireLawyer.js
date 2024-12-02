// src/components/Dashboard/HireLawyer.js
import React from "react";

const HireLawyer = () => {
  const lawyers = [
    { id: 1, name: "John Doe", expertise: "Family Law" },
    { id: 2, name: "Jane Smith", expertise: "Criminal Law" },
    { id: 3, name: "Robert Williams", expertise: "Corporate Law" },
  ];

  return (
    <div className="hire-lawyer">
      <h2>Hire a Lawyer</h2>
      <ul>
        {lawyers.map((lawyer) => (
          <li key={lawyer.id}>
            <strong>{lawyer.name}</strong> - Expertise: {lawyer.expertise}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HireLawyer;
