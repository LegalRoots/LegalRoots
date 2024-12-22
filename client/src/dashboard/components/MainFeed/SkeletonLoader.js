import React from "react";
import "./SkeletonLoader.css";

const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-post">
        <div className="skeleton-author"></div>
        <div className="skeleton-content"></div>
        <div className="skeleton-timestamp"></div>
      </div>
      <div className="skeleton-post">
        <div className="skeleton-author"></div>
        <div className="skeleton-content"></div>
        <div className="skeleton-timestamp"></div>
      </div>
      <div className="skeleton-post">
        <div className="skeleton-author"></div>
        <div className="skeleton-content"></div>
        <div className="skeleton-timestamp"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
