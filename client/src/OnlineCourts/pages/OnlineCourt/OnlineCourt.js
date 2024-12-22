import "./OnlineCourt.css";
import MeetingFrame from "../../components/MeetingFrame/MeetingFrame";
import Sidebar from "../../components/Sidebar/Sidebar";
const OnlineCourt = () => {
  return (
    <div className="onlinecourt-container">
      <Sidebar />
      <MeetingFrame />
    </div>
  );
};

export default OnlineCourt;
