// src/components/Dashboard/ProfileSettings.js
import React, { useState } from "react";

const ProfileSettings = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Handle save logic
    alert("Profile updated!");
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default ProfileSettings;
