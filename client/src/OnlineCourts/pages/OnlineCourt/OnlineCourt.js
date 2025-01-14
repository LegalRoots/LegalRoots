import { useState } from "react";
import MeetingFrame from "../../components/MeetingFrame/MeetingFrame";
import Sidebar from "../../components/Sidebar/Sidebar";

import "./OnlineCourt.css";
import ParticipantsList from "../../components/participantsList/ParticipantsList";

const OnlineCourt = () => {
  const [participants, setParticipants] = useState(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showShareOverlay, setShowShareOverlay] = useState(false);

  const populateParticipants = (p) => {
    let tmp = Array.from(p.values());
    setParticipants(tmp);
  };

  const controlParticipants = (val) => {
    setShowParticipants(val);
  };

  const closeShareOverlayHandler = () => {
    setShowShareOverlay(false);
  };
  const openShareOverlayHandler = () => {
    setShowShareOverlay(true);
  };

  return (
    <div className="onlinecourt-container">
      <Sidebar
        controlParticipants={controlParticipants}
        openShareOverlayHandler={openShareOverlayHandler}
      />
      <MeetingFrame
        populateParticipants={populateParticipants}
        closeShareOverlayHandler={closeShareOverlayHandler}
        showShareOverlay={showShareOverlay}
      />
      {showParticipants && <ParticipantsList participants={participants} />}
    </div>
  );
};

export default OnlineCourt;
