import React, { useState } from "react";

const JobsUpdate = ({ onSubmit, preJob }) => {
  const [job, setJob] = useState(preJob);

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
        update
      </button>
    </form>
  );
};

export default JobsUpdate;
