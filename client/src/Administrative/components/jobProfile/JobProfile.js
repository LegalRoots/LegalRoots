import React from "react";
import "./JobProfile.css";

const JobProfile = ({ job, onUpdateHandler }) => {
  const onUpdate2Handler = () => {
    onUpdateHandler(job._id);
  };

  return (
    <div className="job-profile">
      <header className="job-header">
        <h1>{job.title}</h1>
        <p>{job.description}</p>
      </header>

      <section className="job-permissions">
        <h2>Permissions</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>View</th>
              <th>Manage</th>
              <th>Assign</th>
              <th>Control</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(job.permissions).map(([category, actions]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{actions.view ? "✅" : "❌"}</td>
                <td>{actions.manage ? "✅" : "❌"}</td>
                <td>
                  {actions.assign !== undefined
                    ? actions.assign
                      ? "✅"
                      : "❌"
                    : "-"}
                </td>
                <td>
                  {actions.control !== undefined
                    ? actions.control
                      ? "✅"
                      : "❌"
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="job-metadata">
        <p>
          <strong>Status:</strong> {" " + job.isValid ? "Valid" : "not Valid"}
        </p>
        <p>
          <strong>Created on:</strong>{" "}
          {new Date(job.createdAt).toLocaleString()}
        </p>

        <p id="updateJob" onClick={onUpdate2Handler}>
          update
        </p>
      </section>
    </div>
  );
};

export default JobProfile;
