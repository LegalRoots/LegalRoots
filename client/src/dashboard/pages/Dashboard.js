import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (isLoggedIn) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <h2>Welcome {user.username}</h2>
      </div>
    );
  } else {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <h2>Welcome Guest</h2>
      </div>
    );
  }
};

export default Dashboard;
