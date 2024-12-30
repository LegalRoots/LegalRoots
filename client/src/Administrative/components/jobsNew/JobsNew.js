import React, { useState } from "react";
import "./JobsNew.css";

const JobsNew = ({ onSubmit }) => {
  const [job, setJob] = useState({
    title: "",
    description: "",
    permissions: {
      users: { view: false, manage: false },
      employees: { view: false, manage: false },
      judges: { view: false, manage: false },
      cases: { view: false, manage: false, assign: false, control: false },
      caseTypes: { view: false, manage: false },
      courtBranches: { view: false, manage: false },
      scheduled: { view: false },
      jobs: { view: false, manage: false },
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (category, permission) => {
    setJob((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: !prev.permissions[category][permission],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(job);
  };

  return (
    <form className="create-job-form" onSubmit={handleSubmit}>
      <h2>Create New Job</h2>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={job.title}
          onChange={handleInputChange}
          placeholder="Enter job title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={job.description}
          onChange={handleInputChange}
          placeholder="Enter job description"
          rows="10"
          required
        />
      </div>

      <div className="permissions-section">
        <h3>Permissions</h3>
        {Object.entries(job.permissions).map(([category, actions]) => (
          <div key={category} className="permission-category">
            <h4>{category}</h4>
            {Object.keys(actions).map((action) => (
              <div key={action} className="action-checkbox">
                <label>{action}</label>
                <input
                  type="checkbox"
                  checked={actions[action]}
                  onChange={() => handlePermissionChange(category, action)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button type="submit" className="submit-button">
        Create Job
      </button>
    </form>
  );
};

export default JobsNew;
