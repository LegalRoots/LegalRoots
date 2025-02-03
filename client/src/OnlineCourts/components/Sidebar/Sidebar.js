import { useRef, useState, useContext } from "react";
import "./Sidebar.css";
import FilesList from "../files/FilesList";
import { validateAction } from "../../services/auth";
import { AuthContext } from "../../../shared/context/auth";
import { useLocation } from "react-router-dom";
import UploadFile from "../files/UploadFile";
import PresenterView from "../PresenterView/PresenterView";
import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
const Sidebar = ({ controlParticipants, openShareOverlayHandler }) => {
  const ctx = useContext(AuthContext);
  const location = useLocation();
  const activeRef = useRef();
  const optionsRef = useRef([]);

  const animate = (index) => {
    const positions = [0, 56, 112, 168, 224];
    if (activeRef.current) {
      activeRef.current.style = `top: ${positions[index]}px`;

      optionsRef.current.forEach((option, i) => {
        if (option) {
          if (index === i) {
            setTimeout(() => {
              option.style = "color: white";
            }, 200);
          } else {
            setTimeout(() => {
              option.style = "color: #b4bac4";
            }, 200);
          }
        }
      });
    }
    console.log(index);
  };

  const manageActiveHandler = async (event) => {
    const { role, court } = location.state;

    const index = parseInt(event.currentTarget.id.slice(-1)) - 1;
    if (index === 4) {
      controlParticipants(false);
      //check if authorized
      const isAuth = await validateAction(
        court._id,
        role,
        "files",
        ctx.user.ssid
      );
      if (isAuth) {
        animate(index);

        openFilesOverlayHandler();
      }
    } else if (index === 3) {
      controlParticipants(false);
      const isAuth = await validateAction(
        court._id,
        role,
        "upload",
        ctx.user.ssid
      );
      if (isAuth) {
        animate(index);

        openUploadOverlayHandler();
      }
    } else if (index === 0) {
      controlParticipants(true);
      animate(index);
    } else if (index === 2) {
      controlParticipants(false);
      animate(index);
    } else if (index === 1) {
      animate(index);
      openShareOverlayHandler();
    }
  };
  const [showFilesOverlay, setShowFilesOverlay] = useState(false);
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);

  const closeFilesOverlayHandler = () => {
    setShowFilesOverlay(false);
    animate(2);
  };
  const openFilesOverlayHandler = () => {
    setShowFilesOverlay(true);
  };
  const closeUploadOverlayHandler = () => {
    setShowUploadOverlay(false);
    animate(2);
  };
  const openUploadOverlayHandler = () => {
    setShowUploadOverlay(true);
  };

  return (
    <div className="onlinecourt-sidebar">
      <UploadFile
        showUploadOverlay={showUploadOverlay}
        closeUploadOverlayHandler={closeUploadOverlayHandler}
      />
      <FilesList
        closeFilesOverlayHandler={closeFilesOverlayHandler}
        showFilesOverlay={showFilesOverlay}
      />
      <div className="onlinecourt-sidebar-upper">
        <div className="onlinecourt-sidebar-upper-container">
          <div>
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
        </div>
      </div>
      <div className="onlinecourt-sidebar-lower">
        <div
          onClick={manageActiveHandler}
          id="option1"
          ref={(el) => (optionsRef.current[0] = el)}
        >
          <i className="fa-solid fa-user"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option2"
          ref={(el) => (optionsRef.current[1] = el)}
        >
          <i className="fa-solid fa-message"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option3"
          ref={(el) => (optionsRef.current[2] = el)}
        >
          <i className="fa-solid fa-video"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option4"
          ref={(el) => (optionsRef.current[3] = el)}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option5"
          ref={(el) => (optionsRef.current[4] = el)}
        >
          <i className="fa-solid fa-hard-drive"></i>
        </div>
        <div
          className="onlinecourt-sidebar-lower__active"
          ref={activeRef}
        ></div>
      </div>
      <div className="onlinecourt-sidebar-dummy"></div>
    </div>
  );
};

export default Sidebar;
