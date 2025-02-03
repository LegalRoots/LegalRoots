import React, { useState, useContext } from "react";
import "./ProfilePage.css"; // Separate CSS file for styles
import { AuthContext } from "../../shared/context/auth";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [isAssignmentsVisible, setAssignmentsVisible] = useState(false);

  const {
    first_name,
    last_name,
    photo,
    specialization,
    city,
    yearsOfExperience,
    consultation_price,
    email,
    phone,
    isVerified,
    description,
    ongoingCases,
    assignments,
    clientReviews,
    cv,
    practicing_certificate,
  } = user;

  const handleViewDocument = (type) => {
    alert(`View ${type}: Opening ${type}...`);
    // Implement document viewing logic here
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <img
          src={
            photo === `default.png`
              ? "https://via.placeholder.com/150"
              : `https://localhost:5000/uploads/images/${photo}`
          }
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-details">
          <h2 className="profile-name">{`${first_name} ${last_name}`}</h2>
          <p className="profile-specialization">{specialization}</p>
          <div className="profile-location">
            <span className="icon">📍</span>
            <span>{city}</span>
          </div>
          {isVerified && (
            <div className="verified-badge">
              <span className="icon">✔</span>
              Verified
            </div>
          )}
        </div>
      </div>

      {/* Overview Section */}
      <div className="profile-section">
        <h3>Overview</h3>
        <p>{description}</p>
        <p>
          <strong>Years of Experience:</strong> {yearsOfExperience}
        </p>
        <p>
          <strong>Consultation Price:</strong> ${consultation_price}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
      </div>

      {/* Assignments Section */}
      <div className="profile-section">
        <div
          className="expandable-header"
          onClick={() => setAssignmentsVisible(!isAssignmentsVisible)}
        >
          <h3>Assignments</h3>
          <span>{isAssignmentsVisible ? "▲" : "▼"}</span>
        </div>
        {isAssignmentsVisible &&
          assignments.map((assignment, index) => (
            <div key={index} className="assignment-card">
              <p>
                <strong>Case ID:</strong> {assignment.caseId}
              </p>
              <p>
                <strong>Status:</strong> {assignment.status}
              </p>
              <p>
                <strong>Requested At:</strong>{" "}
                {new Date(assignment.requestedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>

      {/* Reviews Section */}
      <div className="profile-section">
        <h3>Client Reviews</h3>
        {clientReviews.map((review, index) => (
          <div key={index} className="review-card">
            <p>
              {review.feedback} -{" "}
              <span className="rating">{review.rating}★</span>
            </p>
            <p className="review-date">
              {new Date(review.reviewedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Documents Section */}
      <div className="profile-section">
        <h3>Documents</h3>
        <button onClick={() => handleViewDocument("CV")}>View CV</button>
        <button onClick={() => handleViewDocument("Practicing Certificate")}>
          View Practicing Certificate
        </button>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="secondary-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
