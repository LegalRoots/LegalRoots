import { useEffect, useState } from "react";
import logo from "../../../../shared/assets/dummy.jpg";

const EmployeeProfile = ({
  ssid,
  employee_id,
  full_name,
  job,
  gender,
  birthdate,
  phone,
  email,
  court_branch,
  image,
  isValid,
}) => {
  return (
    <div className="judge-profile">
      <div className="profile-header">
        {!image ? (
          <img className="judge-photo" src={logo} alt={`${full_name}`} />
        ) : (
          <img
            className="judge-photo"
            src={`data:image/jpeg;base64,${image}`}
            alt={`${full_name}`}
          />
        )}
        <h2>{full_name}</h2>
      </div>
      <div className="profile-details">
        <div className="detail-group">
          <span className="label">SSID:</span>
          <span>{ssid}</span>
        </div>
        <div className="detail-group">
          <span className="label">Employee ID:</span>
          <span>{employee_id}</span>
        </div>
        <div className="detail-group">
          <span className="label">Job:</span>
          <span>{job}</span>
        </div>
        <div className="detail-group">
          <span className="label">Gender:</span>
          <span>{gender}</span>
        </div>
        <div className="detail-group">
          <span className="label">Birthdate:</span>
          <span>{birthdate}</span>
        </div>
        <div className="detail-group">
          <span className="label">Phone:</span>
          <span>{phone}</span>
        </div>
        <div className="detail-group">
          <span className="label">Email:</span>
          <span>{email}</span>
        </div>
        <div className="detail-group">
          <span className="label">Court Branch:</span>
          {court_branch ? <span>{court_branch?.name}</span> : <span>N/A</span>}
        </div>
        <div className="detail-group">
          <span className="label">Valid:</span>
          <span>{isValid ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
