import React from "react";
import "./FeatureCard.css";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <span className="material-symbols-outlined">{icon}</span>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  );
};

export default FeatureCard;
