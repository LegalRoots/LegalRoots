import { useEffect, useState } from "react";
import "./ParticipantsList.css";
import PermissionsPage from "../permissionsPage/PermissionsPage";
import { useLocation } from "react-router-dom";

const ParticipantsList = ({ participants }) => {
  const location = useLocation();

  const [showOverlay, setShowOverlay] = useState(false);
  const [ssid, setSSID] = useState(false);
  const permissionsHandler = (e) => {
    const { id } = e.currentTarget;
    setSSID(id);
    console.log(id);
    setShowOverlay(true);
  };

  useEffect(() => {
    console.log(participants);
    console.log("in upper list");
  }, [participants]);

  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };

  return (
    <div className="videocall-participantsList-container">
      <PermissionsPage
        ssid={ssid}
        showOverlay={showOverlay}
        closeOverlayHandler={closeOverlayHandler}
      />
      <header>Participants</header>
      <ul>
        {participants?.map((p) => (
          <li key={p.id}>
            <div>
              <p>{`${p.metaData.name} (${p.metaData.ssid})`}</p>
            </div>
            {location.state.role === "admin" &&
              p.metaData.role !== "admin" &&
              p.metaData.userType !== "Judge" && (
                <div id={p.metaData.ssid} onClick={permissionsHandler}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
